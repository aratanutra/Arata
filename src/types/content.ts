export type CtaLink = { label: string; href: string };

export type NavLink = { label: string; href: string };

export type Ingredient = {
  name: string;
  dose: string;
  description: string;
};

export type Pathway = { name: string; detail: string };

export type BenefitTile = {
  icon: string;
  title: string;
  detail: string;
};

export type TrustBadge = { title: string; subtitle: string };

export type FooterColumn = { title: string; links: NavLink[] };


export type SiteContent = {
  brand: {
    name: string;
    trademark: string;
    taglineTrademark: string;
    company: string;
    tagline: string;
    price: string;
    priceCadence: string;
    logoMark: string;
    logoAsset: string;
    logoMarkAsset: string;
    email: string;
    phone: string;
    whatsappNumber: string;
    whatsappGreeting: string;
    domain: string;
    fssaiLicense: string;
    fssaiManufacturerLicense: string;
    fssaiCategory: string;
    manufacturer: string;
    marketer: string;
    vegetarian: boolean;
  };
  nav: {
    links: NavLink[];
    ctaLabel: string;
    ctaHref: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    tagline: string;
    subtitle: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  trustBar: { badges: TrustBadge[] };
  homeFeatured: {
    eyebrow: string;
    title: string;
    tagline: string;
    description: string;
    highlights: { label: string; value: string }[];
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  homeValues: {
    eyebrow: string;
    title: string;
    items: { title: string; detail: string }[];
  };
  product: {
    eyebrow: string;
    title: string;
    description: string;
    stats: { value: string; label: string }[];
    price: string;
    cadence: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
    image: string;
    packForm?: string;
    packLabel?: string;
  };
  ingredientsSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Ingredient[];
  };
  science: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pathways: Pathway[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    tiles: BenefitTile[];
  };
  philosophy: {
    eyebrow: string;
    quote: string;
    founderName: string;
    founderTitle: string;
  };
  aeternyxPage: {
    eyebrow: string;
    title: string;
    tagline: string;
    subtitle: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  productHero: {
    tag: string;
    endorsement: string;
    title: string;
    tagline: string;
    lead: string;
    bullets: string[];
    mrpLabel: string;
    mrp: string;
    mrpNote: string;
    netQuantity: string;
    bestBefore: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
    shipLine: string;
    trustIcons: string[];
  };
  howToUse: {
    eyebrow: string;
    title: string;
    steps: { icon: string; title: string; detail: string }[];
    warning: string;
  };
  certifications: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; detail: string; code: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  about: {
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
    };
    story: {
      title: string;
      paragraphs: string[];
    };
    values: {
      title: string;
      items: { title: string; detail: string }[];
    };
    closingCta: {
      eyebrow: string;
      title: string;
      primaryCta: CtaLink;
      secondaryCta: CtaLink;
    };
  };
  footer: {
    tagline: string;
    columns: FooterColumn[];
    address: string;
    rights: string;
    fssaiText: string;
    complianceDisclaimer: string;
    grievanceOfficer: {
      label: string;
      name: string;
      email: string;
      phone: string;
      note: string;
    };
    policies: {
      label: string;
      returns: string;
      cancellation: string;
      delivery: string;
    };
  };
};
