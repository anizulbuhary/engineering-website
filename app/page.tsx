import {
  Hero,
  Positioning,
  SelectedProjects,
  ProcessSection,
  SamplesPreview,
} from "@/components/sections/Home";
import { EngineeringStory } from "@/components/engineering/EngineeringStory";
import { Capabilities } from "@/components/sections/Capabilities";
import { ContactCTA } from "@/components/layout/Footer";
export default function Home() {
  return (
    <>
      <Hero />
      <Positioning />
      <EngineeringStory />
      <Capabilities />
      <SelectedProjects />
      <ProcessSection />
      <SamplesPreview />
      <ContactCTA />
    </>
  );
}
