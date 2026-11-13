# Arata Stock & Profit — AppSheet setup (about 30 minutes)

A simple app for recording **purchases**, **sales** and **expenses**. It shows **profit** and **stock balance** for each product, updated whenever the app syncs.

Template: `Arata-Stock-Profit.xlsx` (same folder). It has 5 tabs:

| Tab | What it holds |
|---|---|
| Products | One row per item you sell (name, purchase price, sale price, opening stock, reorder level) |
| Purchases | Every stock purchase (date, supplier, product, qty, rate) |
| Sales | Every sale (date, customer, product, qty, rate, payment mode) |
| Expenses | Courier, packaging, marketing and similar costs, for net profit |
| Report | 4 fixed rows (Today / This month / This year / All time) that show the totals |

Stock, average cost and all totals are calculated **inside AppSheet**. The sheet holds plain data only, with no spreadsheet formulas.

---

## Step 1: Put the sheet in Google Drive

1. Upload `Arata-Stock-Profit.xlsx` to Google Drive.
2. Open it, then go to **File → Save as Google Sheets**. Use the Google Sheets copy from now on.
3. In the Google Sheet, go to **Extensions → AppSheet → Create an app**. AppSheet opens with the app built from the first tab (Products).
4. In AppSheet, go to **Data → + (Add table)**, pick the same sheet, and add **Purchases**, **Sales**, **Expenses** and **Report** one at a time. Allow *Adds, Updates, Deletes* on all of them except **Report**, which should be **Read-only**.

## Step 2: Set the columns

Open **Data → [table] → Columns** and set each column as shown. Leave any column not listed at the default.

### Purchases

| Column | Type | Setting |
|---|---|---|
| PurchaseID | Text | Key ✔, Initial value `UNIQUEID()`, Show ✘ |
| Date | Date | Initial value `TODAY()` |
| Product | **Ref** → Products | Required ✔ |
| Qty | Number | Valid if `[_THIS] > 0` |
| Rate | Price | Initial value `[Product].[PurchasePrice]` |
| Amount | Price | App formula `[Qty] * [Rate]` |

### Sales

| Column | Type | Setting |
|---|---|---|
| SaleID | Text | Key ✔, Initial value `UNIQUEID()`, Show ✘ |
| Date | Date | Initial value `TODAY()` |
| Phone | Phone | |
| Product | **Ref** → Products | Required ✔ |
| Qty | Number | Valid if: see below. Invalid message: `Not enough stock` |
| Rate | Price | Initial value `[Product].[SalePrice]` |
| Amount | Price | App formula `[Qty] * [Rate]` |
| CostRate | Price | Initial value `[Product].[AvgCost]`, Editable ✘, Show ✘ |
| Profit | Price | App formula `[Amount] - ([Qty] * [CostRate])` |
| Payment | Enum | Values: Cash, UPI, Card, Credit |

Qty *Valid if* (blocks selling more than you have; editing an old sale still works):

```
AND(
  [_THIS] > 0,
  [_THIS] <= [Product].[Stock]
    + IF(IN([SaleID], Sales[SaleID]), LOOKUP([SaleID], "Sales", "SaleID", "Qty"), 0)
)
```

> **Why `CostRate` is saved on each sale:** it locks in the product's average cost at the moment of sale. Later purchases at a different price don't change the profit of past sales.

### Expenses

| Column | Type | Setting |
|---|---|---|
| ExpenseID | Text | Key ✔, Initial value `UNIQUEID()`, Show ✘ |
| Date | Date | Initial value `TODAY()` |
| Category | Enum | Courier, Packaging, Marketing, Rent, Salary, Other (tick *Allow other values*) |
| Amount | Price | Valid if `[_THIS] > 0` |

### Products: add these Virtual columns

After Step 1 AppSheet adds `Related Purchases` and `Related Sales` automatically. Then, under **Products → + Add virtual column**, add:

| Name | Type | App formula |
|---|---|---|
| PurchasedQty | Number | `SUM([Related Purchases][Qty])` |
| SoldQty | Number | `SUM([Related Sales][Qty])` |
| **Stock** | Number | `[OpeningStock] + [PurchasedQty] - [SoldQty]` |
| AvgCost | Price | `IF(([OpeningStock] + [PurchasedQty]) > 0, (([OpeningStock] * [PurchasePrice]) + SUM([Related Purchases][Amount])) / ([OpeningStock] + [PurchasedQty]), [PurchasePrice])` |
| StockValue | Price | `[Stock] * [AvgCost]` |
| LowStock | Yes/No | `[Stock] <= [ReorderLevel]` |

Set **ProductID** as Key with Initial value `UNIQUEID()`, and set **Product** as the Label.

### Report: add these Virtual columns

Set **Period** as both Key and Label. Then add:

| Name | Type | App formula |
|---|---|---|
| From | Date | `SWITCH([Period], "Today", TODAY(), "This month", EOMONTH(TODAY(), -1) + 1, "This year", EOMONTH(TODAY(), -MONTH(TODAY())) + 1, TODAY() - 36500)` |
| SalesTotal | Price | `SUM(SELECT(Sales[Amount], [Date] >= [_THISROW].[From]))` |
| GrossProfit | Price | `SUM(SELECT(Sales[Profit], [Date] >= [_THISROW].[From]))` |
| ExpenseTotal | Price | `SUM(SELECT(Expenses[Amount], [Date] >= [_THISROW].[From]))` |
| **NetProfit** | Price | `[GrossProfit] - [ExpenseTotal]` |
| PurchaseTotal | Price | `SUM(SELECT(Purchases[Amount], [Date] >= [_THISROW].[From]))` |
| Margin | Percent | `IF([SalesTotal] > 0, [NetProfit] / [SalesTotal], 0)` |

## Step 3: Views (App → Views)

| View | Data | Type | Position | Columns / notes |
|---|---|---|---|---|
| **Profit** | Report | Table | Primary (1st) | Period, SalesTotal, GrossProfit, ExpenseTotal, NetProfit, Margin |
| **Stock** | Products | Table | Primary | Product, Stock, AvgCost, StockValue. Sort by Stock ascending |
| **New Sale** | Sales | Form | Primary | Customer, Phone, Product, Qty, Rate, Payment, Note |
| **New Purchase** | Purchases | Form | Primary | Supplier, Product, Qty, Rate, Note |
| Sales | Sales | Table | Menu | Sort Date descending. Group by Date for a daily list |
| Purchases | Purchases | Table | Menu | Sort Date descending |
| Expenses | Expenses | Table | Menu | Sort Date descending |
| Products | Products | Table | Menu | Add or edit products and prices |

**Format rule** (App → Format rules): table *Products*, condition `[LowStock]`, colour **red**, bold. Low-stock items then turn red in the Stock view.

## Step 4: Keep it live

- **Settings → Data and sync**: turn **Automatic updates** ON and **Sync on start** ON. Each phone then pushes a sale as soon as it's saved.
- Another phone sees new sales after it syncs (tap the sync button, or reopen the app). AppSheet also refreshes in the background periodically.

## Step 5: Test, clean up and share

1. Add a test purchase and a test sale. Check that **Stock** drops and **Profit** updates.
2. In the Google Sheet, **delete the sample rows** in Purchases, Sales and Expenses. **Keep** the 4 Report rows. In Products, edit the sample product's **PurchasePrice**, **OpeningStock** and **ReorderLevel** to match your real numbers. ₹400 is only a placeholder; ₹800 matches the site price. Then add any other products.
3. **Security → Require user signin** ON. Then **Share** the app with each staff member's Google email. They install the *AppSheet* app on their phone and open it.
4. Click **Deploy** when you're happy. Prototype mode allows up to 10 test users.

## How profit is calculated

- **Gross profit (per sale)** = Sale amount − (Qty × average purchase cost at the time of sale)
- **Net profit** = Gross profit − Expenses in the same period
- **Stock** = Opening stock + Purchased − Sold
- **Average cost** = weighted average of opening stock and all purchases

## Ideas for later

- Returns: add a `Type` column (Sale / Return) to Sales, and count Return qty as negative.
- Customer credit (udhaar): filter Sales by `[Payment] = "Credit"` to see who owes money.
- Daily summary email: an AppSheet **Automation → Schedule** that emails the Report table every night.
