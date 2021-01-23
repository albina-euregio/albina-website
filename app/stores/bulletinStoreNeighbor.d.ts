namespace Albina {
  export interface NeighborBulletin {
    validRegions: string[];
    repDate: Date;
    timeBegin: string;
    timeEnd: string;
    dangerMain: DangerMain[];
    dangerPattern: any[];
    problemList: ProblemList[];
    activityHighl: null;
    activityCom: null;
    snowStrucCom: null;
    tendencyCom: null;
  }

  export interface DangerMain {
    mainValue: number;
    validElev?: string;
  }

  export interface ProblemList {
    type: string;
    aspect: Aspect[];
    validElev?: string;
  }

  export enum Aspect {
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
}
