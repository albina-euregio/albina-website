import type { MessageId } from "../../i18n";
import type { FeatureSchema } from "@albina-euregio/linea/src/schema/listing";

export type ParameterType = keyof typeof FeatureSchema.shape.properties.shape;

export interface ParameterOption {
  id: ParameterType;
  label: MessageId;
  unit: string;
  thresholds: number[];
  colors: Record<number, [number, number, number]>;
  direction?: string | false;
}

export const AVAILABLE_PARAMETERS: ParameterOption[] = [
  {
    id: "HS",
    label: "measurements:table:header:HS",
    unit: "cm",
    thresholds: [1, 10, 25, 50, 100, 200, 300, 400],
    colors: {
      1: [255, 255, 254],
      2: [255, 255, 179],
      3: [176, 255, 188],
      4: [140, 255, 255],
      5: [3, 205, 255],
      6: [4, 129, 255],
      7: [3, 91, 190],
      8: [120, 75, 255],
      9: [204, 12, 232]
    },
    direction: false
  },
  {
    id: "HSD_24",
    label: "measurements:table:header:HSD_24",
    unit: "cm",
    thresholds: [-20, -10, -5, 1, 5, 10, 20, 30, 50],
    colors: {
      1: [255, 100, 100],
      2: [255, 160, 160],
      3: [255, 210, 210],
      4: [255, 255, 254],
      5: [255, 255, 179],
      6: [176, 255, 188],
      7: [140, 255, 255],
      8: [3, 205, 255],
      9: [4, 129, 255],
      10: [204, 12, 232]
    },
    direction: false
  },
  {
    id: "HSD_48",
    label: "measurements:table:header:HSD_48",
    unit: "cm",
    thresholds: [-20, -10, -5, 1, 5, 10, 20, 30, 50],
    colors: {
      1: [255, 100, 100],
      2: [255, 160, 160],
      3: [255, 210, 210],
      4: [255, 255, 254],
      5: [255, 255, 179],
      6: [176, 255, 188],
      7: [140, 255, 255],
      8: [3, 205, 255],
      9: [4, 129, 255],
      10: [204, 12, 232]
    },
    direction: false
  },
  {
    id: "HSD_72",
    label: "measurements:table:header:HSD_72",
    unit: "cm",
    thresholds: [-20, -10, -5, 1, 5, 10, 20, 30, 50],
    colors: {
      1: [255, 100, 100],
      2: [255, 160, 160],
      3: [255, 210, 210],
      4: [255, 255, 254],
      5: [255, 255, 179],
      6: [176, 255, 188],
      7: [140, 255, 255],
      8: [3, 205, 255],
      9: [4, 129, 255],
      10: [204, 12, 232]
    },
    direction: false
  },
  {
    id: "TA",
    label: "measurements:table:header:TA",
    unit: "°C",
    thresholds: [-20, -10, -5, 0, 5, 10, 15, 20],
    colors: {
      1: [0, 0, 255],
      2: [100, 150, 255],
      3: [150, 200, 255],
      4: [200, 230, 255],
      5: [255, 255, 200],
      6: [255, 200, 100],
      7: [255, 150, 50],
      8: [255, 100, 0],
      9: [200, 0, 0]
    },
    direction: false
  },
  {
    id: "TSS",
    label: "measurements:table:header:TSS",
    unit: "°C",
    thresholds: [-20, -10, -5, 0, 5, 10, 15, 20],
    colors: {
      1: [0, 0, 255],
      2: [100, 150, 255],
      3: [150, 200, 255],
      4: [200, 230, 255],
      5: [255, 255, 200],
      6: [255, 200, 100],
      7: [255, 150, 50],
      8: [255, 100, 0],
      9: [200, 0, 0]
    },
    direction: false
  },
  {
    id: "PSUM_24",
    label: "measurements:table:header:PSUM_24",
    unit: "mm",
    thresholds: [1, 5, 10, 15, 20, 30, 50, 75],
    colors: {
      1: [255, 255, 254],
      2: [200, 230, 255],
      3: [150, 200, 255],
      4: [100, 150, 255],
      5: [50, 100, 255],
      6: [0, 50, 200],
      7: [0, 0, 150],
      8: [0, 0, 100],
      9: [0, 0, 50]
    },
    direction: false
  },
  {
    id: "RH",
    label: "measurements:table:header:RH",
    unit: "%",
    thresholds: [20, 30, 40, 50, 60, 70, 80, 90],
    colors: {
      1: [255, 255, 255],
      2: [223, 229, 242],
      3: [191, 204, 229],
      4: [159, 178, 216],
      5: [128, 153, 203],
      6: [96, 127, 190],
      7: [64, 102, 177],
      8: [32, 76, 164],
      9: [0, 50, 150]
    },
    direction: false
  },
  {
    id: "VW",
    label: "measurements:table:header:VW",
    unit: "km/h",
    thresholds: [5, 10, 20, 40, 60, 80],
    colors: {
      1: [255, 255, 100],
      2: [200, 255, 100],
      3: [150, 255, 150],
      4: [50, 200, 255],
      5: [100, 150, 255],
      6: [150, 100, 255],
      7: [255, 50, 50]
    },
    direction: "DW"
  },
  {
    id: "VW_MAX",
    label: "measurements:table:header:VW_MAX",
    unit: "km/h",
    thresholds: [5, 10, 20, 40, 60, 80],
    colors: {
      1: [255, 255, 100],
      2: [200, 255, 100],
      3: [150, 255, 150],
      4: [50, 200, 255],
      5: [100, 150, 255],
      6: [150, 100, 255],
      7: [255, 50, 50]
    },
    direction: "DW"
  }
];
