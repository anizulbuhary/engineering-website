import type { Service } from "@/types/content";
export const services: Service[] = [
  {
    id: "coordination",
    title: "Structural coordination",
    stage: "COORDINATE",
    description:
      "Bring models, interfaces and design information into alignment. Identify the questions that need answers before work reaches the site.",
    outputs: [
      "Model reviews",
      "Coordination issue registers",
      "Interface drawings",
    ],
  },
  {
    id: "reinforcement",
    title: "Reinforcement BIM detailing",
    stage: "DETAIL",
    description:
      "Translate structural intent into clear reinforcement arrangements, with attention to congestion, continuity and practical installation.",
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
      "Make complex information legible. Prepare coordinated plans, sections and details that communicate the work clearly.",
    outputs: ["Drawing packages", "Annotated sections", "Revision registers"],
  },
  {
    id: "schedules",
    title: "BBS & quantity outputs",
    stage: "SCHEDULE",
    description:
      "Connect the model to organized schedules. Keep bar marks, quantities and revisions traceable throughout the package.",
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
      "Support the transition from a drawing package to the workface, with focused clarification and documentation of project decisions.",
    outputs: ["Technical clarification", "Sequence diagrams", "Detail updates"],
  },
  {
    id: "closeout",
    title: "As-built documentation",
    stage: "HAND OVER",
    description:
      "Consolidate verified project changes into a clear final record, organized for handover and future reference.",
    outputs: ["Record models", "Updated drawing sets", "Handover indexes"],
  },
];
