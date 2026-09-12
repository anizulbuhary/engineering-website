import type { Project } from "@/types/content";
export const projects: Project[] = [
  {
    slug: "the-frame",
    study: "slab-edge",
    title: "The Frame",
    sector: "Mixed-use",
    image: "/images/projects/frame.webp",
    alt: "Concept concrete structure with rhythmic open floor slabs",
    description:
      "An exploration of structural clarity at the scale of a mixed-use development.",
    scope: "Structural coordination · Reinforcement detailing",
    challenge:
      "A repetitive floor plate meets a changing podium geometry. This concept examines how those interfaces can be communicated without losing the logic of the overall structure.",
    approach:
      "Establish a consistent grid, isolate transfer interfaces and use coordinated plan and section views to explain the transition. A focused detail hierarchy keeps recurring information separate from exceptional conditions.",
    deliverables: [
      "Structural coordination study",
      "Typical floor documentation",
      "Podium interface details",
      "Illustrative reinforcement layouts",
    ],
    featured: true,
  },
  {
    slug: "courtyard-house",
    title: "Courtyard House",
    sector: "Residential",
    image: "/images/projects/courtyard.webp",
    alt: "Concept concrete courtyard building around an olive tree",
    description:
      "A quiet residential study built around a disciplined concrete frame.",
    scope: "Shop drawings · Documentation strategy",
    challenge:
      "Large openings and recessed elevations interrupt an otherwise regular structural rhythm. The study considers how to keep edge conditions clear across plans and sections.",
    approach:
      "Organize the package around a typical structural bay, then document the exceptions at courtyard edges and openings. Cross-reference each detail to its location rather than relying on isolated drawing fragments.",
    deliverables: [
      "Typical bay study",
      "Slab-edge sections",
      "Opening coordination views",
      "Drawing index",
    ],
    featured: true,
  },
  {
    slug: "civic-exchange",
    title: "Civic Exchange",
    sector: "Commercial",
    image: "/images/projects/civic.webp",
    alt: "Concept civic building with a broad concrete colonnade",
    description:
      "A public-facing commercial concept with long spans and a generous ground plane.",
    scope: "Model coordination · Fabrication support",
    challenge:
      "A generous ground-floor space requires the structural arrangement above to be explained clearly. Service interfaces add another layer of coordination at the ceiling zone.",
    approach:
      "Use a shared reference model and focused interface views to explore structural depth, service zones and access. Record unresolved questions alongside the drawings that depend on them.",
    deliverables: [
      "Interface model study",
      "Coordination views",
      "Structural sections",
      "Issue register example",
    ],
    featured: false,
  },
  {
    slug: "northlight-campus",
    title: "Northlight Campus",
    sector: "Education",
    image: "/images/projects/campus.webp",
    alt: "Concept low-rise educational campus with concrete fins",
    description:
      "An educational campus study connecting repeatable structure with adaptable spaces.",
    scope: "BIM detailing · Closeout planning",
    challenge:
      "Repeated teaching spaces share a structural language but require different openings and circulation connections. Information must remain consistent as the study evolves.",
    approach:
      "Use repeatable bay definitions and a controlled variation register. Link each drawing to its source view and maintain a package index so the final documentation can be reviewed as a whole.",
    deliverables: [
      "Typical bay model",
      "Reinforcement study",
      "Package register",
      "Illustrative handover index",
    ],
    featured: false,
  },
];
