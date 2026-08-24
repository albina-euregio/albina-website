type CsvCell = string | number | null | undefined;

/** Quote a single cell per RFC 4180, only when it contains a special char. */
function escapeCell(cell: CsvCell): string {
  const s = cell == null ? "" : String(cell);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Serialize a matrix of cells to CSV text (CRLF line endings). */
export function toCsv(rows: CsvCell[][]): string {
  return rows.map(row => row.map(escapeCell).join(",")).join("\r\n");
}

/** Create a transient anchor and click it to trigger a browser download. */
function clickDownload(
  href: string,
  { download, rel }: { download?: string; rel?: string } = {}
): void {
  const a = document.createElement("a");
  a.href = href;
  if (download !== undefined) a.download = download;
  if (rel) a.rel = rel;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Trigger a client-side download of text content. Prepends a UTF-8 BOM so
 * Excel opens non-ASCII characters (e.g. localized headers) correctly.
 */
export function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/csv;charset=utf-8"
): void {
  const blob = new Blob(["﻿", content], { type: mime });
  const url = URL.createObjectURL(blob);
  clickDownload(url, { download: filename });
  URL.revokeObjectURL(url);
}

/**
 * Download from a same-origin URL, letting the server's Content-Disposition
 * supply the filename. rel="external" stops the nanostores router from
 * hijacking the same-origin click into a client-side navigation.
 */
export function downloadUrl(url: string): void {
  clickDownload(url, { rel: "external" });
}
