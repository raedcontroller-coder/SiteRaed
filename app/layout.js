import "./globals.css";

export const metadata = {
  metadataBase: new URL('https://raed.world'),
  title: {
    default: "Raed | Boutique de Desenvolvimento de Software & Inteligência Artificial",
    template: "%s | Raed World",
  },
  description: "Boutique de desenvolvimento de software sob medida, agentes de inteligência artificial, plataformas SaaS e automação de processos de alta performance.",
  keywords: [
    "desenvolvimento de software",
    "inteligência artificial",
    "software sob medida",
    "agentes de IA",
    "Voice AI",
    "SaaS development",
    "automação de processos",
    "consultoria em IA",
    "Raed World",
    "Next.js",
    "boutique de software"
  ],
  authors: [{ name: "Raed", url: "https://raed.world" }],
  creator: "Raed",
  publisher: "Raed",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://raed.world',
  },
  openGraph: {
    title: "Raed | Boutique de Desenvolvimento de Software & Inteligência Artificial",
    description: "Transformamos operações complexas em sistemas reais e validados de software e inteligência artificial orientados a resultado.",
    url: 'https://raed.world',
    siteName: 'Raed',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/assets/img/Logo.svg',
        width: 800,
        height: 600,
        alt: 'Raed | Future Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Raed | Software & Inteligência Artificial",
    description: "Boutique de software sob medida, agentes de IA, SaaS e automação corporativa.",
    images: ['/assets/img/Logo.svg'],
  },
  icons: {
    icon: '/assets/img/Logo.svg',
    shortcut: '/assets/img/Logo.svg',
    apple: '/assets/img/Logo.svg',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://raed.world/#organization",
      "name": "Raed",
      "url": "https://raed.world",
      "logo": "https://raed.world/assets/img/Logo.svg",
      "description": "Boutique de desenvolvimento de software e IA orientados a resultado.",
      "sameAs": [
        "https://www.linkedin.com/company/raedworld",
        "https://www.instagram.com/raed.world"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://raed.world/#website",
      "url": "https://raed.world",
      "name": "Raed",
      "publisher": {
        "@id": "https://raed.world/#organization"
      }
    },
    {
      "@type": "ProfessionalService",
      "name": "Raed - Software & Inteligência Artificial",
      "url": "https://raed.world",
      "image": "https://raed.world/assets/img/Logo.svg",
      "priceRange": "$$$$",
      "areaServed": "Global",
      "serviceType": [
        "Desenvolvimento de Software Sob Medida",
        "Agentes de Inteligência Artificial",
        "Desenvolvimento de SaaS",
        "Automação de Processos",
        "Voice AI"
      ]
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
