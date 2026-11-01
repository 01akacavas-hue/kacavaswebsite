import { SITE_URL } from "@/lib/site"

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Kacavas",
      url: SITE_URL,
      description:
        "Elias, Nicholas, and Alec Kacavas. An actor, a U.S. Army captain, and a GTM lead.",
    },
    {
      "@type": "Person",
      name: "Elias Kacavas",
      alternateName: "Eli Kacavas",
      jobTitle: "Actor",
      url: `${SITE_URL}/eli`,
      homeLocation: "Manchester, New Hampshire",
      sameAs: [
        "https://www.imdb.com/name/nm10094535/",
        "https://www.instagram.com/eliaskacavas/",
        "https://www.rottentomatoes.com/celebrity/elias_kacavas",
      ],
    },
    {
      "@type": "Person",
      name: "Nicholas H. Kacavas",
      alternateName: ["Niko Kacavas", "Nicholas Kacavas"],
      jobTitle: "Captain, United States Army",
      url: `${SITE_URL}/niko`,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "United States Military Academy",
      },
      sameAs: ["https://www.linkedin.com/in/nicholas-kacavas-b65337201"],
    },
    {
      "@type": "Person",
      name: "Alec Kacavas",
      jobTitle: "GTM Lead",
      url: `${SITE_URL}/alec`,
      worksFor: {
        "@type": "Organization",
        name: "Lance",
        url: "https://lance.live",
      },
      sameAs: ["https://www.linkedin.com/in/aleckacavas"],
    },
  ],
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  )
}
