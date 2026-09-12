import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/Primitives";
export default function NotFound() {
  return (
    <Reveal as="section" stagger className="shell section-space min-h-[65vh]">
      <p className="eyebrow text-accent mb-8">404 / OUTSIDE THE DRAWING</p>
      <h1 className="heading">
        This page isn’t
        <br />
        in the plan.
      </h1>
      <p className="text-muted mt-8">
        The address may have changed, or the page does not exist.
      </p>
      <TextLink href="/" className="mt-8">
        Return to the studio
      </TextLink>
    </Reveal>
  );
}
