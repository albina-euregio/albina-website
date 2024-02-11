export function scrollIntoView(e: React.MouseEvent): void {
  const href = (e.target as HTMLLinkElement).getAttribute("href");
  if (!href?.startsWith("#")) return;
  e.preventDefault();
  document
    .getElementById(href.slice(1))
    ?.scrollIntoView({ behavior: "smooth" });
}
