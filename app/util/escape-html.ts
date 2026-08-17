/**
 * Escapes text before it is interpolated into an HTML string — e.g. the marker
 * tooltips the incident and snow-profile maps build for maplibre's `setHTML`.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
