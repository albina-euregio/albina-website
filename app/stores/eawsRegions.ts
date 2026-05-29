import outline_properties from "@eaws/outline_properties/index.json";
import { LanguageSchema } from "../appStore";
import { z } from "zod/mini";
import { LatLngBounds } from "leaflet";

export const RegionOutlineSchema = z.object({
  id: z.string(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  aws: z.array(
    z.object({
      name: z.string(),
      url: z.partialRecord(
        z.union([
          LanguageSchema,
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

export function eawsRegionsBounds(
  regionCodes: string[],
  f: (
    regionCode: string
  ) => undefined | { bbox: [number, number, number, number] } = eawsRegion
): LatLngBounds {
  return regionCodes.reduce((b, r) => {
    const region = f(r);
    if (region?.bbox) {
      b.extend(
        new LatLngBounds([
          [region.bbox[1], region.bbox[0]],
          [region.bbox[3], region.bbox[2]]
        ])
      );
    }
    return b;
  }, new LatLngBounds([]));
}
