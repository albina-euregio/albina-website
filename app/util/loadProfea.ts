export interface ProfeaData {
  meta: Record<string, unknown>;
  layers: unknown[];
  temperatures: unknown[];
  densities: unknown[];
  tests: unknown[];
}

export interface ProfeaDrawOptions {
  colorizeByGrain?: boolean;
  hardnessDisplay?: "both" | "hand" | "ram";
}

export interface Profea {
  parse(xmlString: string): ProfeaData;
  draw(
    data: ProfeaData,
    svgEl: SVGSVGElement,
    options?: ProfeaDrawOptions
  ): SVGSVGElement;
}

declare global {
  interface Window {
    profea?: Profea;
  }
}

const PROFEA_SCRIPT_URL = `${import.meta.env.BASE_URL}vendor/profea/profea.js`;

let profeaPromise: Promise<Profea> | undefined;

/**
 * Lazily loads the vendored profea.js and resolves with the global it attaches.
 *
 * profea is a git submodule at `public/vendor/profea` (pinned to a profea
 * commit), served verbatim by Vite from `public/`. To update it:
 *   git submodule update --remote public/vendor/profea
 * then commit the submodule bump. No copy step — the served file *is* the
 * submodule's profea.js.
 */
export function loadProfea(): Promise<Profea> {
  if (window.profea) return Promise.resolve(window.profea);
  profeaPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PROFEA_SCRIPT_URL;
    script.onload = () => {
      if (window.profea) resolve(window.profea);
      else reject(new Error("profea.js loaded but window.profea is not set"));
    };
    script.onerror = () => reject(new Error("Failed to load profea.js"));
    document.head.appendChild(script);
  });
  return profeaPromise;
}
