import engineeringModel from "./engineering-model.json";

export const immersiveStory = {
  modelName: engineeringModel.name,
  modelReference: engineeringModel.reference,
  intro:
    "Follow the building from architectural form to coordinated details and construction drawings. Explore six stages, or go straight to our services.",
  skipLabel: "Skip to services",
  skipHref: "#services",
  label: "THE ENGINEERING EXPERIENCE",
  kicker: "ONE BUILDING. EVERY DISCIPLINE.",
  title: ["Beyond", "the surface."],
  words: ["FORM", "STRUCTURE", "DETAIL", "SYSTEMS", "DRAWING", "RESOLVED"],
  nav: ["Form", "Structure", "Detail", "Systems", "Drawing", "Resolved"],
  views: [
    "01 / ARCHITECTURAL FORM",
    "02 / EXPLODED STRUCTURE",
    "03 / REINFORCEMENT STUDY",
    "04 / SYSTEM COORDINATION",
    "05 / ELEVATION STUDY",
    "06 / ASSEMBLED MODEL",
  ],
  scroll: "SCROLL TO REVEAL",
  loading: "PREPARING MODEL…",
  pause: "Pause motion",
  resume: "Resume motion",
  pausedLabel: "THE ENGINEERING EXPERIENCE / STILL VIEW",
  model: engineeringModel.model,
  poster: engineeringModel.poster,
  posterAlt:
    "Architectural model of Courtyard House, with pale limestone wings, smoked glazing, subtle copper accents and planted courtyard terraces",
};
export const editorialHero = {
  comparison: {
    drawing: "/graphics/studies/construction-landscape-drawing.svg",
    drawingPortrait: "/graphics/studies/construction-portrait-drawing.svg",
    label: "Compare the concept image and vector construction sketch",
    valueLabel: "{value}% concept image",
    description:
      "An AI-generated unfinished concrete structure and an illustrative vector sketch of the same view. The sketch traces the columns, beams and slabs, highlighting their connections. Neither image is construction documentation.",
    initial: 58,
  },
  label: "PRECISION. FROM THE INSIDE OUT.",
  title: ["Engineering", "what", "endures."],
  action: "Contact",
  actionHref: "/contact",
  image: "/images/hero/construction-landscape-image.webp",
  imagePortrait: "/images/hero/construction-portrait-image.webp",
  imageAlt:
    "Concept image of an unfinished concrete building, with three connected portal frames and warm daylight across the floor",
  caption: "Concrete frame — concept study",
  companion: {
    label: "FIG. 01 / A CLOSER LOOK",
    title: "The whole, in every detail.",
    description:
      "A beam meets a column. A slab spans an opening. Before the finishes, the structure reveals the connections that make the building work.",
    imageAlt:
      "Close crop of a concrete beam meeting its column, with warm light across the recessed soffit",
    link: "See the engineering",
    href: "#engineering-story",
  },
};
export const engineeringStages = [
  {
    id: "form",
    title: "Understand the building",
    label: "INITIAL FORM",
    description:
      "Establish the building’s form, layout and structural requirements before developing the details.",
  },
  {
    id: "structure",
    title: "Reveal the structural frame",
    label: "STRUCTURAL FRAME",
    description:
      "Examine how slabs, beams and columns connect to form the supporting structure.",
  },
  {
    id: "rebar",
    title: "Detail the reinforcement",
    label: "REINFORCEMENT",
    description:
      "Develop reinforcement arrangements around connections, openings and the sequence of construction.",
  },
  {
    id: "coordination",
    title: "Coordinate the building systems",
    label: "COORDINATION",
    description:
      "Review where services meet the structure and identify clashes before they reach the site.",
  },
  {
    id: "documentation",
    title: "Develop the construction drawings",
    label: "DOCUMENTATION",
    description:
      "Translate the coordinated model into clear plans, sections and schedules for project review.",
  },
  {
    id: "final",
    title: "Bring the package together",
    label: "FINAL PACKAGE",
    description:
      "Align models, drawings and schedules in a consistent package, with revisions clearly recorded.",
  },
];
