import outline_properties from "@eaws/outline_properties/index.json";
import { LanguageSchema } from "../appStore";
import { z } from "zod/v4-mini";

export const RegionOutlineSchema = z.object({
  id: z.string(),
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

export const eawsRegions = z
  .array(RegionOutlineSchema)
  .parse(outline_properties, { reportInput: true });
export type RegionOutlineProperties = z.infer<typeof RegionOutlineSchema>;

export function eawsRegionIds(): string[] {
  return eawsRegions
    .map(properties => properties.id)
    .filter(id => !config.regionsRegex.test(id));
}
