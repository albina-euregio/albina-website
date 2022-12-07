import { Injectable } from "@angular/core";

@Injectable()
export class ParamService {
  parameterClasses = {};

  constructor() {}

  public setParameterClasses(parameters: string[]) {
    for(const param of parameters) {
      this.parameterClasses[param] = param
        .replace("--", "_")
        .replace(" -", "_")
        .replace(" cm", "")
        .replace(" --", "")
        .replace(" s", "")
        .replace("-", "_")
        .replace(".", "_")
        .replace(" ", "_")
    }
  }

  public getCellClass(param: string, value: string): string {
    let params = ["N", "Nh", "Nm", "Nl", "N_CU"];
    if(params.includes(this.parameterClasses[param])) {
      const parsedVal = Number(value);
      if (parsedVal >= 7) return "darkest";
      if (parsedVal >= 5) return "darker";
      if (parsedVal >= 3) return "dark";
      if (parsedVal == 0) return "opacity-0";
    }

    params = ["RF_300", "RF_400", "RF_500", "RF_700", "RF_850", "RF_925"];
    if(params.includes(this.parameterClasses[param])) {
      const parsedVal = Number(value);
      if (parsedVal >= 90) return "darkest";
      if (parsedVal >= 80) return "darker";
      if (parsedVal >= 70) return "dark";
    }

    params = ["WX_CUF"];
    if(params.includes(this.parameterClasses[param])) {
      if (value === "NIL") return "opacity-0";
      if (value === "TS") return "yellow";
      if (value === "XXTS") return "orange";
    }

    params = ["SN_RA"];
    if(params.includes(this.parameterClasses[param])) {
      const parsedVal = Number(value);
      if(parsedVal <= 1000) return "sn-rf-color";
    }

    params = ["RR, RR_24h, SN"];
    if(params.includes(this.parameterClasses[param])) {
      if(value === "0.0" || value === "---") return "opacity-0";
    }

    params = ["QANmax"];
    if(params.includes(this.parameterClasses[param])) {
      const parsedVal = Number(value);
      if(parsedVal >= 15) return "orange";
    }

    return "";
  }

  public getWParam(value: string): string {
    const parsedVal = Number(value);
    if (parsedVal <= -1000) return `-----${value}`;
    if (parsedVal <= -25) return `---${value}`;
    if (parsedVal <= -9) return `--${value}`;
    if (parsedVal <= -3) return `-${value}`;
    if (parsedVal <= 3) return value;
    if (parsedVal <= 15) return `+${value}`;
    if (parsedVal <= 30) return `++${value}`;
    if (parsedVal <= 100) return `+++${value}`;
    return `++++${value}`;
  }
}
