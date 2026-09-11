export type Service = {
  id: string;
  title: string;
  stage: string;
  description: string;
  outputs: string[];
};
export type Project = {
  slug: string;
  title: string;
  sector: string;
  image: string;
  alt: string;
  description: string;
  scope: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  featured: boolean;
};
export type Sample = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  pdf: string;
};
export type Article = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  sections: { title: string; paragraphs: string[] }[];
};
