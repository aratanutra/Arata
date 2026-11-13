# Arata Ops — AppSheet app design

A mobile ops app for Arata Nutraceuticals: packing and shipping orders, tracking Aeternyx® stock by batch, and moderating reviews from a phone. It sits next to the website and does not replace it.

## 1. Where the data lives

The website stays the source of truth for **orders** and **reviews**. Today these are stored in Netlify Blobs (`src/lib/orders.ts`, `src/lib/reviews.ts`), and AppSheet cannot read Blobs directly. Here is how data moves:

```
Website (Netlify Blobs)  ──sync every 5 min──▶  Google Sheet "Arata Ops"  ◀──▶  AppSheet app
        ▲                                                                       │
        └──────────── webhook (ship / mark paid / approve review) ──────────────┘
```

- **Site → Sheet**: a Google Apps Script with a 5-minute time trigger calls a new read-only endpoint, `GET /api/ops/export`. The endpoint returns orders and reviews as flat JSON, and the script upserts the rows by key.
- **AppSheet → Site**: an action that changes order or review state (ship, mark paid, approve, reject) **calls the website's API through an AppSheet bot webhook**. The website still sends the customer emails, so nothing is lost. AppSheet never edits those Sheet columns itself. The next sync writes back the result.
- **AppSheet-owned data** (inventory, batches, stock movements, packing notes) exists only in the Sheet.

### Changes needed on the website

| Change | Why |
|---|---|
| `GET /api/ops/export`, authenticated with an `x-ops-key` header that matches `OPS_API_KEY` | Feeds the sync script |
| Accept `x-ops-key` as an alternative to the NextAuth session on `orders/[id]/ship`, `orders/[id]/mark-paid`, `reviews/[id]/approve` and `reviews/[id]/reject` | Lets the AppSheet webhooks act without a browser login |
| New env var `OPS_API_KEY` in Netlify (Secret) | Shared secret. Store it in AppSheet and Apps Script only, never in the Sheet |

## 2. Tables (Google Sheet tabs)

### `Orders` (synced from the site; read-only in AppSheet except `PackNotes`)

| Column | Type | Source / notes |
|---|---|---|
| OrderId | Text (**key**) | `orderId` |
| Receipt | Text | `receipt` |
| CreatedAt | DateTime | `createdAt` (shown in IST) |
| Status | Enum: created, paid, failed, refunded, shipped | `status` |
| Channel | Enum: razorpay, whatsapp, manual | Derived from receipt/order prefix |
| PackId | Ref → Packs | `pack.id` |
| Qty | Number | 1 for now (one pack per order) |
| AmountINR | Price | `amount / 100` |
| ShippingINR | Price | `breakdown.shippingPaise / 100` |
| CustomerName, Email, Phone | Name / Email / Phone | `customer.*` |
| Address1, Address2, City, State, Pincode | Text | `customer.*` |
| FullAddress | Virtual (LongText) | `CONCATENATE([Address1], ", ", [City], " ", [Pincode])` |
| PaymentId, PaidAt | Text / DateTime | |
| Courier, AWB, TrackingUrl | Text / Text / URL | |
| ShippedAt, ExpectedDelivery | DateTime / Date | |
| ShippingEmailStatus | Virtual | `IF(ISNOTBLANK([shippingEmailError]), "Failed", IF(ISNOTBLANK([shippingEmailSentAt]), "Sent", ""))` |
| BatchId | Ref → Batches | **AppSheet-owned**, filled in at packing time |
| PackNotes | LongText | **AppSheet-owned** |
| DaysWaiting | Virtual Number | `IF([Status]="paid", HOUR(NOW()-[PaidAt])/24, "")` |

> The sync script must update only site-owned columns, so `BatchId` and `PackNotes` survive each sync.

### `Packs` (seeded from `content/site-content.json → productHero.packs`)

| Column | Type |
|---|---|
| PackId | Text (**key**): single, three, ten |
| Label | Text: "1 Strip", "3 Strips", "10 strips" |
| Tablets | Number: 10, 30, 100 |
| Strips | Number: 1, 3, 10 |
| PriceINR, ShippingINR | Price |

### `Batches` (AppSheet-owned)

| Column | Type | Notes |
|---|---|---|
| BatchId | Text (**key**) | Manufacturer's batch / lot no. |
| MfgDate, ExpiryDate | Date | |
| StripsReceived | Number | |
| StripsOut | Virtual | `SUM(SELECT(StockMoves[Strips], AND([BatchId]=[_THISROW].[BatchId], [Type]="Out")))` |
| StripsOnHand | Virtual | `[StripsReceived] - [StripsOut] + adjustments` |
| DaysToExpiry | Virtual | `[ExpiryDate] - TODAY()` |
| COAFile | File | Certificate of analysis PDF |

### `StockMoves` (AppSheet-owned)

| Column | Type | Notes |
|---|---|---|
| MoveId | Text (**key**) | `UNIQUEID()` |
| Date | DateTime | `NOW()` |
| BatchId | Ref → Batches | |
| Type | Enum: In, Out, Adjust, Sample, Damaged | |
| Strips | Number | Positive number. The type decides the sign. |
| OrderId | Ref → Orders | Required when Type = Out |
| By | Email | `USEREMAIL()` |

### `Reviews` (synced from the site)

Columns: Id (**key**), CreatedAt, Name, City, Rating (1–5), Title, Body, OrderId (Ref → Orders), VerifiedPurchaser (Yes/No), PhotoUrl (Image, served from `/api/reviews/photo/[key]`), Status (pending/approved/rejected), ModerationNote.

### `Users`

Email (**key**), Role (Enum: Owner, Packer). Used for security filters.

## 3. Views

| View | Type | Data | For |
|---|---|---|---|
| **To Pack** (home) | Deck | Orders where `Status="paid"`, sorted by PaidAt ascending | Packer |
| **Shipped** | Table | Orders where `Status="shipped"`, grouped by ShippedAt (day) | Both |
| **All Orders** | Table | All orders, grouped by Status, with search | Owner |
| **Stock** | Card | Batches, sorted by ExpiryDate | Both |
| **Review Queue** | Deck | Reviews where `Status="pending"` | Owner |
| **Dashboard** | Dashboard | To Pack count, today's revenue chart (Orders by day), stock on hand, pending reviews | Owner |
| Order Detail | Detail | Customer, address (tap to copy), pack, actions | Both |

Format rules:
- Red: `DaysWaiting > 2` (paid but not shipped).
- Amber: Batches with `DaysToExpiry < 90`, or `StripsOnHand < 30`.
- Grey: Orders with `Status` in failed or refunded.

## 4. Actions

| Action | Table | Shown when | Does |
|---|---|---|---|
| **Mark shipped** | Orders | `Status="paid"` | Opens a form for Courier, AWB, TrackingUrl, ExpectedDelivery and BatchId → writes a StockMoves "Out" row (`Strips = [PackId].[Strips]`) → bot **Ship webhook** |
| **Mark paid** | Orders | `AND([Status]="created", [Channel]<>"razorpay")` | Bot **Mark-paid webhook** (WhatsApp and manual orders only) |
| **Call customer** / **WhatsApp customer** | Orders | Always | `tel:` / `https://wa.me/91…` deep link |
| **Open tracking** | Orders | `ISNOTBLANK([TrackingUrl])` | Opens the URL |
| **Approve** / **Reject** | Reviews | `Status="pending"` | Bot **Review webhook** |
| **Receive batch** | Batches | Always | Adds a StockMoves "In" row |

### Bots

1. **Ship webhook**: triggered by an update to Orders where a hidden `ShipRequested` changes to TRUE. Sends `POST https://aratanutra.com/api/orders/<<[OrderId]>>/ship` with the header `x-ops-key` and the body `{courier, awbNumber, trackingUrl, expectedDeliveryDate}`, then clears `ShipRequested`. The site sends the shipping email.
2. **Mark-paid webhook**: same pattern, posts to `/mark-paid`.
3. **Review webhook**: posts to `/api/reviews/<<[Id]>>/approve` or `/reject`.
4. **Low-stock alert**: runs daily at 09:00 IST. If any batch has `StripsOnHand < 30` or `DaysToExpiry < 90`, it emails the Owner.
5. **Stale-order alert**: runs daily. Pushes a notification for paid orders older than 48 h.

## 5. Security

- Sign-in is required, through Google. Only emails listed in `Users` can open the app.
- **Packer** sees To Pack, Shipped, Stock and Order Detail only. Packers cannot see revenue, the dashboard or reviews, or delete anything. Security filter on Reviews: `LOOKUP(USEREMAIL(), Users, Email, Role)="Owner"`.
- **Owner** sees everything.
- Customer PII (phone and address) stays in a private Google Sheet shared only with app users. Turn off "Allow public access" and "Offline mode" for Packers if devices are shared.
- `OPS_API_KEY` lives only in the AppSheet webhook header and the Apps Script properties. Rotate it by changing the value in Netlify.

## 6. Build order

1. **Read-only MVP**: create the Sheet tabs, Apps Script sync and `/api/ops/export`. Build the To Pack, All Orders and Order Detail views.
2. **Inventory**: add Packs, Batches and StockMoves, plus the stock view and low-stock bot.
3. **Write-back**: add `x-ops-key` support to the four website routes, then the Ship, Mark-paid and Review webhooks.
4. **Polish**: dashboard, format rules, Packer role, stale-order alert.

Phase 1 involves no website writes, so it is safe to roll out first. Phase 3 is the only phase that touches order state.
