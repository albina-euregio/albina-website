import outline_properties from "@eaws/outline_properties/index.json";
import * as v from "valibot";

export const RegionOutlineSchema = v.object({
  id: v.string(),
  bbox: v.tuple([v.number(), v.number(), v.number(), v.number()]),
  aws: v.array(
    v.object({
      name: v.string(),
      url: v.objectWithRest(
        { "api:lang": v.optional(v.array(v.string())) },
        v.string()
      )
    })
  )
});

const eawsRegions = v.parse(v.array(RegionOutlineSchema), outline_properties);
export type RegionOutlineProperties = v.InferOutput<typeof RegionOutlineSchema>;

export function eawsRegion(id: string) {
  return eawsRegions.find(r => r.id === id);
}

export function eawsRegionIds(): string[] {
  return eawsRegions
    .map(properties => properties.id)
    .filter(id => !config.regionsRegex.test(id));
}
