import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as types from './../../qfa/types/QFA';
import { QfaFile } from "../../qfa/models/qfa-file.model";
import { GetFilenamesService } from "./filenames.service";
import { GetDustParamService } from "./dust.service";
import { ParamService } from "./param.service";
import { R3BoundTarget } from '@angular/compiler';

@Injectable()
export class QfaService {
  baseUrl = "https://static.avalanche.report/zamg_qfa/";
  dustParams = {};
  coords = {
    "bozen": {
      lng: 11.33,
      lat: 46.47
    },
    "innsbruck": {
      lng: 11.35,
      lat: 47.27
    },
    "lienz": {
      lng: 12.80,
      lat: 46.83
    }
  };
  cities: string[];
  files = {
    "innsbruck": [],
    "bozen": [],
    "lienz": [],
  }

  constructor(
    public filenamesService: GetFilenamesService,
    public dustParamService: GetDustParamService,
    public paramService: ParamService,
    private http: HttpClient,
  ) {
    this.cities = Object.keys(this.files);
  }

  async loadDustParams() {
    this.dustParams = await this.dustParamService.parseDustParams();
  }

  async getFiles() {
    for (const city of this.cities) {
      const filenames = await this.filenamesService.getFilenames(this.baseUrl, city);
      const parsedFiles = [];
      for(const file of filenames) {
        const parsedFile = this.filenamesService.parseFilename(file.name);
        parsedFiles.push(parsedFile);
      }
      this.files[city] = parsedFiles.filter(el => el.startDay === "00");
    }

    return this.files;
  }

  async getRun(file, startDay: number, first: boolean) {
    const days = `0${startDay}0${startDay+2}`;
    const filename = file.filename.replace(/\d{4}\.txt/g, `${days}.txt`);
    const run = new QfaFile(this.http);
    await run.loadFromURL(filename);

    const parameters = Object.keys(run.data.parameters);

    if(first) {
      const city = run.data.metadata.location.split(" ")[2].toLowerCase();
      if(this.dustParams) {
        const dust = this.dustParams[city][startDay / 3];
        run.data.parameters["DUST"] = dust;
        parameters.unshift("DUST");
      }
    }

    const qfa = {
      data: run.data,
      date: run.date,
      dates: run.paramDates,
      parameters: parameters,
      file: file
    }

    return qfa;
  }
}
