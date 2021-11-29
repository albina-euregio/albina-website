export interface NeighborBulletin {
  valid_regions: string[];
  danger_main: DangerMain[];
  dangerpattern: string[];
  problem_list: ProblemList[];
  report_texts: null;
  rep_date: Date;
  report_id: string;
  validity_begin: Date;
  validity_end: Date;
}

interface DangerMain {
  main_value: number;
  valid_elevation?: string;
}

interface ProblemList {
  problem_type: string;
  aspect: Aspect[];
  valid_elevation?: string;
}

enum Aspect {
  E = "E",
  N = "N",
  Ne = "NE",
  No = "NO",
  Nw = "NW",
  O = "O",
  S = "S",
  SE = "SE",
  So = "SO",
  Sw = "SW",
  W = "W"
}
