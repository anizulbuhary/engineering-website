import type { Service } from "@/types/content";
export const services: Service[] = [
  {
    id: "coordination",
    title: "Structural coordination",
    stage: "COORDINATE",
    description:
      "Check how slabs, columns, openings and building services fit together. Record clashes and questions that need resolving before construction.",
    outputs: ["Model reviews", "Clash and issue lists", "Interface drawings"],
  },
  {
    id: "reinforcement",
    title: "Steel reinforcement detailing",
    stage: "DETAIL",
    description:
      "Show where reinforcing steel sits inside the concrete. Prepare 3D models and details that help teams review spacing, connections and installation.",
    outputs: [
      "Reinforcement models",
      "Bar arrangement details",
      "Section views",
    ],
  },
  {
    id: "drawings",
    title: "Structural shop drawings",
    stage: "DOCUMENT",
    description:
      "Turn the structural design into detailed plans, sections and instructions for construction teams. Keep each drawing linked to the current design.",
    outputs: ["Drawing packages", "Annotated sections", "Revision registers"],
  },
  {
    id: "schedules",
    title: "Bar schedules & quantities",
    stage: "SCHEDULE",
    description:
      "Prepare bar bending schedules (BBS): lists of reinforcing steel shapes, sizes and quantities. Link each bar reference back to its drawing.",
    outputs: [
      "Illustrative bar schedules",
      "Quantity summaries",
      "Drawing references",
    ],
  },
  {
    id: "site-support",
    title: "Fabrication & site support",
    stage: "EXECUTE",
    description:
      "Help fabrication and site teams understand the drawings. Explain specific details, illustrate work sequences and record agreed changes.",
    outputs: ["Technical clarification", "Sequence diagrams", "Detail updates"],
  },
  {
    id: "closeout",
    title: "As-built documentation",
    stage: "HAND OVER",
    description:
      "Update models and drawings to reflect verified changes made during construction. Organize a clear record of what was built for handover.",
    outputs: ["Record models", "Updated drawing sets", "Handover indexes"],
  },
];
