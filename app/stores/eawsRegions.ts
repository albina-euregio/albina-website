import outline_properties from "@eaws/outline_properties/index.json";
import * as v from "valibot";
import { vLanguageCode } from "../api/valibot.gen";

export const RegionOutlineSchema = v.object({
  id: v.string(),
  bbox: v.tuple([v.number(), v.number(), v.number(), v.number()]),
  aws: v.array(
    v.object({
      name: v.string(),
      url: v.record(
        v.union([
          v.picklist(vLanguageCode.options),
          v.picklist([
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
          v.string()
        ]),
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
