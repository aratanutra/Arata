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

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  published: boolean;
  body?: string;
};

export type FooterColumn = { title: string; links: NavLink[] };

export type ContactFormType = { id: string; label: string };

export type DossierSpecialty = { name: string; summary: string; url: string };

export type SiteContent = {
  brand: {
    name: string;
    trademark: string;
    company: string;
    tagline: string;
    price: string;
    priceCadence: string;
    logoMark: string;
    email: string;
    domain: string;
    fssaiLicense: string;
    fssaiCategory: string;
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
  prescription: {
    eyebrow: string;
    title: string;
    subtitle: string;
    specialties: string[];
    rxCard: {
      header: string;
      patient: string;
      date: string;
      lines: string[];
      signature: string;
    };
  };
  blog: {
    eyebrow: string;
    title: string;
    posts: BlogPost[];
  };
  newsletter: {
    eyebrow: string;
    title: string;
    subtitle: string;
    placeholder: string;
    buttonLabel: string;
    disclaimer: string;
  };
  contactForm: {
    triggerLabel: string;
    title: string;
    description: string;
    endpointUrl: string;
    fallbackEmail: string;
    types: ContactFormType[];
  };
  dossier: {
    eyebrow: string;
    title: string;
    subtitle: string;
    footnote: string;
    specialties: DossierSpecialty[];
  };
  aeternyxPage: {
    eyebrow: string;
    title: string;
    tagline: string;
    subtitle: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
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
  };
};
