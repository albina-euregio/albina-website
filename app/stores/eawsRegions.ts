import outline_properties from "@eaws/outline_properties/index.json";
import { LanguageSchema } from "../appStore";
import { z } from "zod/mini";

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

class LatLngBounds {
  constructor(
    public west: number,
    public south: number,
    public east: number,
    public north: number
  ) {}

  extend(other: LatLngBounds) {
    this.west = isFinite(this.west)
      ? Math.min(this.west, other.west)
      : other.west;
    this.south = isFinite(this.south)
      ? Math.min(this.south, other.south)
      : other.south;
    this.east = isFinite(this.east)
      ? Math.max(this.east, other.east)
      : other.east;
    this.north = isFinite(this.north)
      ? Math.max(this.north, other.north)
      : other.north;
    return this;
  }

  pad(n: number) {
    this.west -= n;
    this.south -= n;
    this.east += n;
    this.north += n;
    return this;
  }

  asArray(): [[number, number], [number, number]] {
    return [
      [this.west, this.south],
      [this.east, this.north]
    ];
  }
}

export function eawsRegionsBounds(
  regionCodes: string[],
  f: (
    regionCode: string
  ) => undefined | { bbox: [number, number, number, number] } = eawsRegion
): LatLngBounds {
  return regionCodes.reduce(
    (b, r) => {
      const region = f(r);
      if (region?.bbox) {
        b.extend(new LatLngBounds(...region.bbox));
      }
      return b;
    },
    new LatLngBounds(NaN, NaN, NaN, NaN)
  );
}
