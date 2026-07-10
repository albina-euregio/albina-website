import outline_properties from "@eaws/outline_properties/index.json";
import { LngLatBounds } from "maplibre-gl";
import { z } from "zod/mini";
import { vLanguageCode } from "../api/valibot.gen";

export const RegionOutlineSchema = z.object({
  id: z.string(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  aws: z.array(
    z.object({
      name: z.string(),
      url: z.partialRecord(
        z.union([
          z.enum(vLanguageCode.options),
          z.enum([
            "api",
            "api:date",
            "facebook",
            "flickr",
            "instagram",
            "linkedin",
            "mail",
            "telegram",
            "whatsapp",
            "twitter",
            "youtube"
          ]),
          z.string()
        ]),
        z.string()
      )
    })
  )
});

const eawsRegions = z
  .array(RegionOutlineSchema)
  .parse(outline_properties, { reportInput: true });
export type RegionOutlineProperties = z.infer<typeof RegionOutlineSchema>;

export function eawsRegion(id: string) {
  return eawsRegions.find(r => r.id === id);
}

export function eawsRegionIds(): string[] {
  return eawsRegions
    .map(properties => properties.id)
    .filter(id => !config.regionsRegex.test(id));
}

/**
 * Grow `bounds` by `n` degrees in every direction. Returns a new instance;
 * the input is left untouched. For an empty bounds the result stays empty.
 */
export function padBounds(bounds: LngLatBounds, n: number): LngLatBounds {
  if (bounds.isEmpty()) return bounds;
  return new LngLatBounds([
    bounds.getWest() - n,
    bounds.getSouth() - n,
    bounds.getEast() + n,
    bounds.getNorth() + n
  ]);
}

export function eawsRegionsBounds(
  regionCodes: string[],
  f: (
    regionCode: string
  ) => undefined | { bbox: [number, number, number, number] } = eawsRegion
): LngLatBounds {
  const bounds = new LngLatBounds();
  for (const r of regionCodes) {
    const region = f(r);
    if (region?.bbox) {
      bounds.extend(new LngLatBounds(region.bbox));
    }
  }
  return bounds;
}
