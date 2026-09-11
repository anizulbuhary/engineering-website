import type { Article } from "@/types/content";
export const articles: Article[] = [
  {
    slug: "coordination-before-detail",
    title: "Coordinate first. Detail with confidence.",
    category: "COORDINATION",
    summary:
      "Why a clear interface review is a better starting point than a more detailed model.",
    image: "/images/projects/frame.webp",
    sections: [
      {
        title: "Start with the questions",
        paragraphs: [
          "A detailed model can still contain unresolved assumptions. Before adding information, establish what is known, which references are current and where one discipline depends on another. A short list of explicit questions is often more useful than an apparently complete model.",
          "For a structural package, useful questions might concern an opening location, the relationship between a slab edge and a facade, or the available zone for services. Record the question against a specific view so that another reviewer can understand it without reconstructing the conversation.",
        ],
      },
      {
        title: "Make interfaces visible",
        paragraphs: [
          "An isolated discipline view rarely explains an interface. Create focused views that show enough neighboring information to make the issue understandable. Hide unrelated geometry, keep the reference system visible and give each view a clear purpose.",
          "A useful review separates confirmed information from working assumptions. Do not allow a provisional decision to become an invisible dependency in a drawing package. Keep its status connected to the affected views until it has been resolved.",
        ],
      },
      {
        title: "Carry decisions into the package",
        paragraphs: [
          "Coordination does not end when a meeting closes. The value appears when a decision is reflected consistently in the model, drawing and schedule. Assign responsibility for the update and identify which outputs require another review.",
          "The practical goal is a shorter path from a question to a traceable answer. Begin with a shared reference, show the interface clearly and close the loop in the deliverables.",
        ],
      },
    ],
  },
  {
    slug: "a-readable-drawing-package",
    title: "What makes a drawing package readable?",
    category: "DOCUMENTATION",
    summary: "Hierarchy, references and the discipline of showing just enough.",
    image: "/images/projects/courtyard.webp",
    sections: [
      {
        title: "Give every view a job",
        paragraphs: [
          "A plan establishes location. A section explains a relationship. A detail resolves a condition. When each view has a clear job, a reviewer can move through the package without searching for the same answer in several places.",
          "Start with the questions a reader will bring to the sheet. Where is the element? Which condition applies? Where is the next piece of information? Arrange views and references around that sequence.",
        ],
      },
      {
        title: "Build a consistent hierarchy",
        paragraphs: [
          "Line weight, annotation size and spacing help readers separate primary geometry from supporting information. Consistency is more useful than decoration: the same kind of information should look and behave the same way across the package.",
          "Avoid repeating long notes where a clear reference will do. Equally, do not make readers follow a chain of references for a simple condition. A useful package balances local clarity with a single source for recurring information.",
        ],
      },
      {
        title: "Review the connections",
        paragraphs: [
          "A sheet can look complete while its references point to an outdated detail. Review the drawing index, section markers, revision descriptions and schedule references together. These connections are part of the information, not administrative extras.",
          "Try a review from the perspective of someone who has not developed the model. If understanding a detail requires an explanation from its author, the drawing may need a clearer view or a more direct note.",
        ],
      },
    ],
  },
  {
    slug: "model-to-handover",
    title: "A better handover starts at the beginning.",
    category: "DELIVERY",
    summary:
      "Treat the final package as a connected record, rather than a last-minute collection of files.",
    image: "/images/projects/civic.webp",
    sections: [
      {
        title: "Define the destination",
        paragraphs: [
          "Before producing deliverables, agree what the receiving team needs to find in the final package. File naming, document grouping and the relationship between models and drawings are easier to establish early than to reconstruct at the end.",
          "The package index can begin as a working outline. It provides a shared picture of expected outputs and reveals missing information while there is still time to resolve it.",
        ],
      },
      {
        title: "Keep changes connected",
        paragraphs: [
          "A change rarely affects only one file. A revised opening may appear in a plan, a section, an associated detail and a model view. Use a revision record that identifies the affected outputs instead of relying on memory.",
          "Keep superseded material distinguishable from current information. A folder full of plausible final versions makes the receiving team do the coordination work again.",
        ],
      },
      {
        title: "Review as a recipient",
        paragraphs: [
          "Open the package from its index and follow the references. Check that filenames match the register, that listed deliverables exist and that the revision trail is understandable. The test is whether someone outside the authoring team can navigate it.",
          "Good handover is the result of consistent decisions throughout delivery. An organized record makes the work easier to understand long after the original conversations have ended.",
        ],
      },
    ],
  },
];
