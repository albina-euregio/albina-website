import { InfoModel } from "./info.model";
import { AuthorModel } from "./author.model";
import { ConditionsModel } from "./conditions.model";
import { LocationModel } from "./location.model";
import { DatetimeModel } from "./datetime.model";
import * as Enums from "../enums/enums";

export class QuickReportModel {

  public id: number;
  public serverId: string;
  public status: Enums.Status;

  public showUsername: boolean = true;

  public info: InfoModel;

  public ridingQuality: Enums.RidingQuality;
  public snowConditions: Enums.SnowConditions[];
  public rode: Enums.TerrainFeature[];
  public avoided: Enums.TerrainFeature[];
  public alarmSigns: Enums.AlarmSignsFrequency;
  public newSnow: Enums.NewSnow;
  public driftingSnow: Enums.DriftingSnow;
  public avalanches: Enums.Avalanches;
  public penetrationDepth: Enums.PenetrationDepth;
  public surfaceSnowWetness: Enums.SurfaceSnowWetness;
  public avalancheProblems: Enums.AvalancheSituation[];
  public tracks: Enums.Tracks;

  static createFromJson(json, id?) {
    const quickReport = new QuickReportModel(json.showUsername);

    if (id) {
      quickReport.setId(id);
    }
    if (json.serverId) {
      quickReport.setServerId(json.serverId);
    }
    if (json.status) {
      quickReport.setStatus(Enums.Status[json.status]);
    }

    const info = new InfoModel();
    if (json.author) {
      info.setAuthor(AuthorModel.createFromJson(json.author));
    }
    if (json.conditions) {
      info.setConditions(ConditionsModel.createFromJson(json.conditions));
    }
    if (json.location) {
      info.setLocation(LocationModel.createFromJson(json.location));
    }
    if (json.datetime) {
      info.setDatetime(DatetimeModel.createFromJson(json.datetime));
    }
    if (json.comment) {
      info.setComment(json.comment);
    }
    quickReport.setInfo(info);

    if (json.ridingQuality) {
      quickReport.setRidingQuality(Enums.RidingQuality[json.ridingQuality]);
    }

    if (json.snowConditions) {
      const snowConditions = new Array<string>();
      for (let i = json.snowConditions.length - 1; i >= 0; i--) {
        snowConditions.push(Enums.SnowConditions[json.snowConditions[i]]);
      }
      quickReport.setSnowConditions(snowConditions);
    }

    if (json.rode) {
      const rode = new Array<string>();
      for (let i = json.rode.length - 1; i >= 0; i--) {
        rode.push(Enums.TerrainFeature[json.rode[i]]);
      }
      quickReport.setRode(rode);
    }

    if (json.avoided) {
      const avoided = new Array<string>();
      for (let i = json.avoided.length - 1; i >= 0; i--) {
        avoided.push(Enums.TerrainFeature[json.avoided[i]]);
      }
      quickReport.setAvoided(avoided);
    }

    if (json.alarmSigns) {
      quickReport.setAlarmSigns(Enums.AlarmSignsFrequency[json.alarmSigns]);
    }
    if (json.newSnow) {
      quickReport.setNewSnow(Enums.NewSnow[json.newSnow]);
    }
    if (json.driftingSnow) {
      quickReport.setDriftingSnow(Enums.DriftingSnow[json.driftingSnow]);
    }
    if (json.avalanches) {
      quickReport.setAvalanches(Enums.Avalanches[json.avalanches]);
    }
    if (json.penetrationDepth) {
      quickReport.setPenetrationDepth(Enums.PenetrationDepth[json.penetrationDepth]);
    }
    if (json.surfaceSnowWetness) {
      quickReport.setSurfaceSnowWetness(Enums.SurfaceSnowWetness[json.surfaceSnowWetness]);
    }

    if (json.avalancheProblems) {
      const avalancheProblems = new Array<string>();
      for (let i = json.avalancheProblems.length - 1; i >= 0; i--) {
        avalancheProblems.push(Enums.AvalancheSituation[json.avalancheProblems[i]]);
      }
      quickReport.setAvalancheProblems(avalancheProblems);
    }

    if (json.tracks) {
      quickReport.setTracks(Enums.Tracks[json.tracks]);
    }

    return quickReport;
  }

  constructor(showUsername, quickReport?) {
    if (showUsername !== undefined && showUsername !== null) {
      this.setShowUsername(showUsername);
    }

    this.status = Enums.Status.draft;
    if (quickReport) {
      this.setId(quickReport.getId());
      this.setServerId(quickReport.getServerId());
      this.setShowUsername(quickReport.getShowUsername());
      this.setInfo(quickReport.getInfo());
      this.setRidingQuality(quickReport.getRidingQuality());
      this.setSnowConditions(quickReport.getSnowConditions());
      this.setAvoided(quickReport.getAvoided());
      this.setRode(quickReport.getRode());
      this.setAlarmSigns(quickReport.getAlarmSigns());
      this.setNewSnow(quickReport.getNewSnow());
      this.setDriftingSnow(quickReport.getDriftingSnow());
      this.setAvalanches(quickReport.getAvalanches());
      this.setPenetrationDepth(quickReport.getPenetrationDepth());
      this.setSurfaceSnowWetness(quickReport.getSurfaceSnowWetness());
      this.setAvalancheProblems(quickReport.getAvalancheProblems());
      this.setTracks(quickReport.getTracks());
    } else {
      this.id = undefined;
      this.serverId = undefined;
      this.info = new InfoModel();
      this.ridingQuality = undefined;
      this.snowConditions = new Array<Enums.SnowConditions>();
      this.avoided = new Array<Enums.TerrainFeature>();
      this.rode = new Array<Enums.TerrainFeature>();
      this.alarmSigns = undefined;
      this.newSnow = undefined;
      this.driftingSnow = undefined;
      this.avalanches = undefined;
      this.penetrationDepth = undefined;
      this.surfaceSnowWetness = undefined;
      this.avalancheProblems = new Array<Enums.AvalancheSituation>();
      this.tracks = undefined;
    }
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getServerId() {
    return this.serverId;
  }

  setServerId(serverId) {
    this.serverId = serverId;
  }

  getStatus() {
    return this.status;
  }

  setStatus(status) {
    this.status = status;
  }

  isDraft() {
    return this.getStatus() === Enums.Status.draft;
  }

  isPublished() {
    return this.getStatus() === Enums.Status.published;
  }

  getShowUsername() {
    return this.showUsername;
  }

  setShowUsername(showUsername) {
    this.showUsername = showUsername;
  }

  getInfo() {
    return this.info;
  }

  setInfo(info) {
    this.info = info;
  }

  getRidingQuality() {
    return this.ridingQuality;
  }

  setRidingQuality(ridingQuality) {
    this.ridingQuality = ridingQuality;
  }

  getSnowConditions() {
    return this.snowConditions;
  }

  setSnowConditions(snowConditions) {
    this.snowConditions = snowConditions;
  }

  addSnowCondition(snowCondition) {
    if (this.snowConditions.indexOf(snowCondition) === -1) {
      this.snowConditions.push(snowCondition);
    }
  }

  removeSnowCondition(snowCondition) {
    const index = this.snowConditions.indexOf(snowCondition);
    if (index > -1) {
      this.snowConditions.splice(index, 1);
    }
  }

  getRode() {
    return this.rode;
  }

  setRode(rode) {
    this.rode = rode;
  }

  addRode(rode) {
    if (this.rode.indexOf(rode) === -1) {
      this.rode.push(rode);
    }
  }

  removeRode(rode) {
    const index = this.rode.indexOf(rode);
    if (index > -1) {
      this.rode.splice(index, 1);
    }
  }

  getAvoided() {
    return this.avoided;
  }

  setAvoided(avoided) {
    this.avoided = avoided;
  }

  addAvoided(avoided) {
    if (this.avoided.indexOf(avoided) === -1) {
      this.avoided.push(avoided);
    }
  }

  removeAvoided(avoided) {
    const index = this.avoided.indexOf(avoided);
    if (index > -1) {
      this.avoided.splice(index, 1);
    }
  }

  getAlarmSigns() {
    return this.alarmSigns;
  }

  setAlarmSigns(alarmSigns) {
    this.alarmSigns = alarmSigns;
  }

  getNewSnow() {
    return this.newSnow;
  }

  setNewSnow(newSnow) {
    this.newSnow = newSnow;
  }

  getDriftingSnow() {
    return this.driftingSnow;
  }

  setDriftingSnow(driftingSnow) {
    this.driftingSnow = driftingSnow;
  }

  getAvalanches() {
    return this.avalanches;
  }

  setAvalanches(avalanches) {
    this.avalanches = avalanches;
  }

  getPenetrationDepth() {
    return this.penetrationDepth;
  }

  setPenetrationDepth(penetrationDepth) {
    this.penetrationDepth = penetrationDepth;
  }

  getSurfaceSnowWetness() {
    return this.surfaceSnowWetness;
  }

  setSurfaceSnowWetness(surfaceSnowWetness) {
    this.surfaceSnowWetness = surfaceSnowWetness;
  }

  getAvalancheProblems() {
    return this.avalancheProblems;
  }

  setAvalancheProblems(avalancheProblems) {
    this.avalancheProblems = avalancheProblems;
  }

  addAvalancheProblem(avalancheProblem) {
    if (this.avalancheProblems.indexOf(avalancheProblem) === -1) {
      this.avalancheProblems.push(avalancheProblem);
    }
  }

  removeAvalancheProblem(avalancheProblem) {
    const index = this.avalancheProblems.indexOf(avalancheProblem);
    if (index > -1) {
      this.avalancheProblems.splice(index, 1);
    }
  }

  getTracks() {
    return this.tracks;
  }

  setTracks(tracks) {
    this.tracks = tracks;
  }

  toJson() {
    const json = Object();

    if (this.showUsername !== undefined) {
      json["showUsername"] = this.showUsername;
    } else {
      json["showUsername"] = true;
    }

    if (this.info) {
      if (this.info.getAuthor() && Object.keys(this.info.getAuthor().toJson()).length !== 0) {
        json["author"] = this.info.getAuthor().toJson();
      }
      if (this.info.getLocation() && Object.keys(this.info.getLocation().toJson()).length !== 0) {
        json["location"] = this.info.getLocation().toJson();
      }
      if (this.info.getConditions() && Object.keys(this.info.getConditions().toJson()).length !== 0) {
        json["conditions"] = this.info.getConditions().toJson();
      }
      if (this.info.getDatetime() && Object.keys(this.info.getDatetime().toJson()).length !== 0) {
        json["datetime"] = this.info.getDatetime().toJson();
      }
      if (this.info.getComment()) {
        json["comment"] = this.info.getComment();
      }
    }

    if (this.ridingQuality !== undefined) {
      json["ridingQuality"] = Enums.RidingQuality[this.ridingQuality];
    }

    if (this.snowConditions !== undefined) {
      const jsonSnowConditions = [];
      for (let i = this.snowConditions.length - 1; i >= 0; i--) {
        jsonSnowConditions.push(Enums.SnowConditions[this.snowConditions[i]]);
      }
      json["snowConditions"] = jsonSnowConditions;
    }

    if (this.rode !== undefined) {
      const jsonRode = [];
      for (let i = this.rode.length - 1; i >= 0; i--) {
        jsonRode.push(Enums.TerrainFeature[this.rode[i]]);
      }
      json["rode"] = jsonRode;
    }

    if (this.avoided !== undefined) {
      const jsonAvoided = [];
      for (let i = this.avoided.length - 1; i >= 0; i--) {
        jsonAvoided.push(Enums.TerrainFeature[this.avoided[i]]);
      }
      json["avoided"] = jsonAvoided;
    }

    if (this.alarmSigns !== undefined) {
      json["alarmSigns"] = Enums.AlarmSignsFrequency[this.alarmSigns];
    }

    if (this.newSnow !== undefined) {
      json["newSnow"] = Enums.NewSnow[this.newSnow];
    }

    if (this.driftingSnow !== undefined) {
      json["driftingSnow"] = Enums.DriftingSnow[this.driftingSnow];
    }

    if (this.avalanches !== undefined) {
      json["avalanches"] = Enums.Avalanches[this.avalanches];
    }

    if (this.penetrationDepth !== undefined) {
      json["penetrationDepth"] = Enums.PenetrationDepth[this.penetrationDepth];
    }

    if (this.surfaceSnowWetness !== undefined) {
      json["surfaceSnowWetness"] = Enums.SurfaceSnowWetness[this.surfaceSnowWetness];
    }

    if (this.avalancheProblems !== undefined) {
      const jsonAvalancheProblems = [];
      for (let i = this.avalancheProblems.length - 1; i >= 0; i--) {
        jsonAvalancheProblems.push(Enums.AvalancheSituation[this.avalancheProblems[i]]);
      }
      json["avalancheProblems"] = jsonAvalancheProblems;
    }

    if (this.tracks !== undefined) {
      json["tracks"] = Enums.Tracks[this.tracks];
    }

    return json;
  }

  toInternalJson() {
    const json = this.toJson();
    json["serverId"] = this.serverId;
    json["status"] = Enums.Status[this.status];

    return json;
  }
}
