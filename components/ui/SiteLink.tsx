"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { requestNavigationScroll } from "@/lib/navigation-scroll";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Keep native links and Next prefetching, with one explicit scroll policy. */
export default function SiteLink({
  href,
  onNavigate,
  scroll,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      href={href}
      scroll={false}
      onNavigate={(event) => {
        let cancelled = false;
        onNavigate?.({
          preventDefault() {
            cancelled = true;
            event.preventDefault();
          },
        });
        if (!cancelled && scroll !== false) requestNavigationScroll(href);
      }}
    />
  );
}
