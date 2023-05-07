export function generateJsonLdData() {
  const publicUrl = process.env.PUBLIC_URL;
  const faviconUrl = `${publicUrl}/favicon.ico`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Diablo 4 Build Calculator",
    description:
      "A build/talent calculator for the Diablo 4 action RPG video game by Blizzard.",
    image: faviconUrl,
    author: {
      "@type": "gabee1987",
      name: "Gabor Koncz",
    },
    keywords:
      "Diablo, Diablo 4, Diablo IV, Build Calculator, Talent Calculator, Build Planner, Plan, Build, Action RPG, Blizzard, Skill Tree",
    about: {
      "@type": "Game",
      name: "Diablo 4",
      description:
        "A dark, gothic, action RPG video game developed by Blizzard Entertainment.",
      // "gameItem": classData.map((classItem) => ({
      //   "@type": "GameItem",
      //   "name": classItem.name,
      //   "description": classItem.description,
      //   "image": `URL_TO_IMAGE_FOR_${classItem.name.toUpperCase()}_CLASS`,
      //   "gameItemCategory": classItem.tags,
      // })),
    },
  };

  return JSON.stringify(structuredData, null, 2);
}
