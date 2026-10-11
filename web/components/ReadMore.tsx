/**
 * "Pročitaj više →" at the bottom right of a news or blog card, under the
 * description. It lives inside the card's link (a `group`): hidden until that
 * card is hovered or focused, then it fades up, underlines and the arrow
 * nudges right. On touch screens, where there is no hover, it stays visible.
 */
export function ReadMore({ className = "" }: { className?: string }) {
  return (
    <span
      className={`label mt-5 flex translate-y-1 items-center justify-end gap-2.5 opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100 ${className}`}
    >
      <span className="link pb-0.5">Pročitaj više</span>
      <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">
        →
      </span>
    </span>
  );
}
