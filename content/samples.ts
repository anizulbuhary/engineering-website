import type { Sample } from "@/types/content";
import drawingSheets from "./drawing-sheets.json";

export const sampleGalleryCopy = {
  preview: "Open preview",
  fullSize: "Open full-size drawing",
  newTab: "opens in a new tab",
};

export const samples: Sample[] = drawingSheets.map(
  ({ id, title, category, description }) => ({
    id,
    title,
    category,
    description,
    image: `/graphics/samples/${id}.svg`,
    pdf: `/documents/samples/${id}.pdf`,
  }),
);
