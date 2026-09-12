export const site = {
  name: "FORMWORK",
  descriptor: "ENGINEERING",
  title: "FORMWORK Engineering",
  description:
    "Structural BIM, reinforcement detailing and construction-ready documentation. Precision from model to execution.",
  demo: true,
  tagline: "Structural BIM. Considered details.\nConstruction-ready thinking.",
  copyright: "© 2026 FORMWORK Engineering",
  demoNote:
    "An independent concept studio website. Projects and visuals are illustrative.",
};
export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/capabilities" },
  { label: "Projects", href: "/projects" },
  { label: "Drawing samples", href: "/samples" },
  { label: "Why Us", href: "/why-us" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];
export const primaryNavigation = [
  "Services",
  "Projects",
  "Drawing samples",
  "About",
];
export const mobileNavigation = ["Home", ...primaryNavigation, "Contact"];
export const navigationCopy = { contact: "Contact" };
