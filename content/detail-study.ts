export const detailStudy = {
  label: "A CLOSER LOOK / STUDY 01",
  title: "Every detail has a context.",
  intro:
    "Follow one slab edge from its position in the frame to the information on the sheet.",
  controls: "Explore the drawing",
  figureLabel: "Slab-edge communication study",
  figureAlt:
    "Schematic section through a slab and its supporting column, with indicative reinforcement and a reference linking the section to a plan.",
  sheet: "FW–01 / SECTION A–A",
  status: "SCHEMATIC / NOT TO SCALE",
  note: "An illustration of how information connects. Geometry and reinforcement are indicative, not a construction design.",
  labels: {
    section: "SECTION A–A",
    slab: "SLAB EDGE",
    column: "SUPPORT",
    reference: "PLAN → SECTION",
    plan: "LOCATE IN PLAN",
    axis: "A",
  },
  options: [
    {
      id: "interface",
      label: "Interface",
      number: "01",
      title: "Read the relationship.",
      text: "The slab edge is shown with its support. Keeping both in the section makes the junction legible, rather than presenting an isolated edge.",
      reference: "CONTEXT / SLAB + SUPPORT",
    },
    {
      id: "reinforcement",
      label: "Reinforcement",
      number: "02",
      title: "Make the arrangement legible.",
      text: "A second layer distinguishes the indicative reinforcement from the concrete outline. This study explains a drawing hierarchy; bar sizes, spacing and anchorage require project design.",
      reference: "LAYER / INDICATIVE REINFORCEMENT",
    },
    {
      id: "reference",
      label: "Drawing reference",
      number: "03",
      title: "Keep the route back clear.",
      text: "The A–A marker locates this section in the plan. The same identifier follows the view onto sheet FW–01, so the detail can always be read in context.",
      reference: "REFERENCE / A–A → FW–01",
    },
  ],
  link: {
    label: "Follow the complete study",
    href: "/projects/the-frame#study",
  },
};

export const frameDossier = {
  metadata: {
    scope: "STUDY SCOPE",
    status: "STATUS",
    statusValue: "Independent concept demonstration",
  },
  label: "THE FRAME / STUDY DOSSIER",
  title: "One junction.\nA connected set of information.",
  intro:
    "This study follows a typical slab edge through a plan, a section and a package index. It explores the clarity of the documentation, rather than proposing a structural design.",
  index: ["Locate", "Explain", "Connect", "Review"],
  constraint: {
    label: "01 / LOCATE",
    title: "Start with the whole.",
    text: "A detail needs an address. The plan establishes the structural bays and shows where section A–A passes through the slab edge. A shared reference keeps that relationship visible as the view changes.",
    caption: "FIG. 01 / PLAN LOCATION → SECTION A–A",
    alt: "Schematic plan with structural bays and an A–A section marker at the right-hand slab edge",
  },
  decision: {
    label: "02 / EXPLAIN",
    title: "Give the junction room.",
    text: "The section isolates the slab and support while retaining enough context to read their relationship. The concrete outline, indicative reinforcement and drawing reference each have a distinct visual role.",
  },
  package: {
    label: "03 / CONNECT",
    title: "A detail belongs\nto a package.",
    intro:
      "One identifier connects the location, the view and the register. These three study records demonstrate that thread.",
    columns: ["Reference", "Study record", "Connection"],
    rows: [
      {
        ref: "A–A",
        title: "Section location",
        connection: "Marked on the study plan",
      },
      {
        ref: "FW–01",
        title: "Slab-edge section",
        connection: "Carries the A–A view",
      },
      {
        ref: "IDX–01",
        title: "Study package index",
        connection: "Lists sheet FW–01",
      },
    ],
  },
  review: {
    label: "04 / REVIEW",
    title: "Clarity includes the limits.",
    text: "The plan and section use matching identifiers, and the package index names the same sheet. These are communication checks within an independent concept study. No structural analysis, reinforcement design, site verification or client approval is represented.",
    checks: [
      "A location for the section",
      "A reference on the view",
      "A record in the package",
    ],
  },
  next: {
    label: "CONTINUE THE CONVERSATION",
    title: "From a study to your scope.",
    links: [
      {
        label: "Explore structural coordination",
        href: "/capabilities#coordination",
      },
      { label: "Browse illustrative samples", href: "/samples" },
      { label: "Contact", href: "/contact" },
    ],
  },
};

export const sampleReading = {
  label: "READING A DETAIL",
  title: "From a line\nto its meaning.",
  intro:
    "Explore the three layers of a section, then follow the same reference through The Frame study. This companion illustration explains how a drawing is read.",
};

export const capabilityExamples: Record<
  string,
  { image: string; title: string; text: string }
> = {
  coordination: {
    image: "/graphics/samples/coordination-view.svg",
    title: "Structural interface view",
    text: "Bring the frame and its interfaces into the same view, with a clear record of the questions to resolve.",
  },
  reinforcement: {
    image: "/graphics/samples/beam-detail.svg",
    title: "Reinforcement arrangement",
    text: "Read the elevation alongside the section. Distinct line weights separate the outline from the indicative reinforcement.",
  },
  drawings: {
    image: "/graphics/samples/slab-plan.svg",
    title: "A referenced drawing sheet",
    text: "Locate the structural bays, openings and view references before reading an individual detail.",
  },
  schedules: {
    image: "/graphics/samples/bar-schedule.svg",
    title: "An organized schedule",
    text: "Connect a bar mark with its shape and drawing reference. These sample entries demonstrate the layout, not quantities for construction.",
  },
  "site-support": {
    image: "/graphics/samples/column-section.svg",
    title: "A focused clarification",
    text: "Use a close section to communicate a specific condition alongside its surrounding documentation.",
  },
  closeout: {
    image: "/graphics/samples/handover-index.svg",
    title: "A traceable package index",
    text: "Keep models, drawings and schedules together in a readable register with consistent references.",
  },
};
export const capabilityExampleCopy = {
  open: "Explore a sample output",
  note: "ILLUSTRATIVE / NOT FOR CONSTRUCTION",
  link: "View documentation samples",
};
