export function scrollIntoView(e: React.MouseEvent): void {
  // Read the href from currentTarget (the <a> the handler is attached to), not
  // e.target — clicking a child (e.g. the arrow icon or label) would otherwise
  // yield no href and skip the scroll.
  const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
  if (!href?.startsWith("#")) return;
  e.preventDefault();
  const id = href.slice(1);

  const scroll = () => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    return !!el;
  };

  // The target (e.g. the selected bulletin report) may render right after the
  // click, so retry briefly until it is in the DOM.
  if (scroll()) return;
  let tries = 0;
  const timer = setInterval(() => {
    if (scroll() || ++tries > 20) clearInterval(timer);
  }, 100);
}
