export interface MicroRegionElevationProperties {
  id: string;
  elevation: "high" | "low";
  "elevation line_visualization"?: number;
  threshold?: number;
  start_date?: Date;
  end_date?: Date;
}
