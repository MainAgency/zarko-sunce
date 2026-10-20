"use client";

import { useEffect, useState } from "react";

import { photoUrl, type Project } from "@/lib/content";

import GlassFolder, { type FolderFile } from "./ui/glass-folder-cards";

type NextProjectProps = {
  /** The project this page shows: its cover sits in the back of the folder. */
  current: Project;
  /** The projects that follow it, nearest first. */
  others: Project[];
};

/**
 * Closing block of a project page: one glass folder labelled "Sljedeći
 * projekt". Click it and the next few projects rise out of it as cards, each
 * with the project's name along the top and its cover as the picture; the
 * nearest project sits in front. Each card links to its project.
 */
export function NextProject({ current, others }: NextProjectProps) {
  // The folder keeps the newest file in front, so the next project goes in last.
  const files: FolderFile[] = [...others].reverse().map((p) => ({
    name: p.title,
    image: photoUrl(p.cover, 800),
    href: `/projekti/${p.slug}`,
  }));

  // One size on phones, a larger one from tablets up.
  const [width, setWidth] = useState(340);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setWidth(mq.matches ? 400 : 300);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section aria-label="Sljedeći projekt" className="px-page border-t border-line py-20 lg:py-28">
      <div className="flex flex-col items-center">
        <GlassFolder
          label="Sljedeći projekt"
          meta=""
          image={photoUrl(current.cover, 800)}
          files={files}
          action="none"
          width={width}
          // The site face instead of the component's system stack.
          style={{ fontFamily: "var(--font-nohemi), ui-sans-serif, system-ui, sans-serif" }}
        />
        <p className="label mt-10 text-muted">Kliknite na mapu za sljedeće projekte</p>
      </div>
    </section>
  );
}
