import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import {
  capabilityExamples,
  capabilityExampleCopy as copy,
} from "@/content/detail-study";

export function CapabilityExample({ service }: { service: string }) {
  const example = capabilityExamples[service];
  if (!example) return null;
  return (
    <details className="capability-example" name="capability-output">
      <summary>
        <span>{copy.open}</span>
        <Plus size={16} aria-hidden />
      </summary>
      <div className="capability-example-body">
        <Image
          src={example.image}
          alt={example.title}
          width={900}
          height={640}
          className="w-full"
        />
        <p className="eyebrow text-accent mt-4">{copy.note}</p>
        <p className="text-lg tracking-tight mt-3">{example.title}</p>
        <p className="text-sm text-muted leading-relaxed mt-3">
          {example.text}
        </p>
        <Link href="/samples" className="text-link mt-3">
          {copy.link}
          <ArrowUpRight size={16} aria-hidden />
        </Link>
      </div>
    </details>
  );
}
