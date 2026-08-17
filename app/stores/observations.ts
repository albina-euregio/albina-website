import * as v from "valibot";
import { vGenericObservation } from "../api/valibot.gen";

/**
 * A pre-rendered label/value pair the observation feeds append to an
 * observation. The rows carry whatever the reporting app collected beyond the
 * fixed `GenericObservation` fields, already localized by the feed.
 */
export const vExtraDialogRow = v.object({
  label: v.string(),
  value: v.optional(v.string()),
  number: v.optional(v.number())
});

/**
 * The generated `GenericObservation` schema, adjusted for what the feed
 * actually ships: a list of image URLs rather than a single one, plus the
 * `$extraDialogRows` the OpenAPI spec does not describe.
 */
export const vObservation = v.object({
  ...vGenericObservation.entries,
  $externalImgs: v.optional(v.union([v.string(), v.array(v.string())])),
  $extraDialogRows: v.optional(v.array(vExtraDialogRow))
});

export type ExtraDialogRow = v.InferOutput<typeof vExtraDialogRow>;
export type Observation = v.InferOutput<typeof vObservation>;

/** The observation's images, as a list regardless of how the feed ships them. */
export function observationImages(observation: Observation): string[] {
  const images = observation.$externalImgs;
  if (!images) return [];
  return Array.isArray(images) ? images : [images];
}
