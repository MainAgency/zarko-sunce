"use client";

import { useState } from "react";

import { NEWS } from "@/lib/content";

import { NewsList } from "./NewsList";

const ALL = "Sve";
const CATEGORIES = [ALL, ...Array.from(new Set(NEWS.map((n) => n.category)))];

/** Category filter over the news list; switching remounts the rows so they animate in again. */
export function NewsIndex() {
  const [category, setCategory] = useState(ALL);
  const items = category === ALL ? NEWS : NEWS.filter((n) => n.category === category);

  return (
    <>
      <div role="group" aria-label="Filtriraj po kategoriji" className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const count = c === ALL ? NEWS.length : NEWS.filter((n) => n.category === c).length;
          const on = c === category;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={on}
              className={`label flex h-10 items-center gap-3 border px-4 transition-colors duration-300 ${
                on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
              }`}
            >
              {c}
              <span className={on ? "text-yellow" : "text-muted"}>{String(count).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>

      <div key={category} className="mt-10">
        <NewsList items={items} />
      </div>
    </>
  );
}
