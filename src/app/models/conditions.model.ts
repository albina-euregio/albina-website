import * as Enums from "../enums/enums";

export class ConditionsModel {
  public airTemperature: number;
  public cloudiness: Enums.SkyCondition;
  public precipitationType: Enums.PrecipitationType;
  public precipitationIntensity: Enums.PrecipitationIntensity;
  public windSpeed: Enums.WindSpeed;
  public windDirection: Enums.Aspect;

  static createFromJson(json) {
    const conditions = new ConditionsModel();

    conditions.setAirTemperature(json.airTemperature);
    conditions.setCloudiness(json.cloudiness);
    conditions.setPrecipitationType(Enums.PrecipitationType[json.precipitationType]);
    conditions.setPrecipitationIntensity(Enums.PrecipitationIntensity[json.precipitationIntensity]);
    conditions.setWindSpeed(Enums.WindSpeed[json.windSpeed]);
    conditions.setWindDirection(Enums.Aspect[json.windDirection]);

    return conditions;
  }

  constructor(conditions?) {
    if (conditions) {
      this.airTemperature = conditions.airTemperature;
      this.cloudiness = conditions.cloudiness;
      this.precipitationType = conditions.precipitationType;
      this.precipitationIntensity = conditions.precipitationIntensity;
      this.windSpeed = conditions.windSpeed;
      this.windDirection = conditions.windDirection;
    } else {
      this.airTemperature = undefined;
      this.cloudiness = undefined;
      this.precipitationType = undefined;
      this.precipitationIntensity = undefined;
      this.windSpeed = undefined;
      this.windDirection = undefined;
    }
  }

  getAirTemperature() {
    return this.airTemperature;
  }

  setAirTemperature(airTemperature) {
    this.airTemperature = airTemperature;
  }

  getCloudiness() {
    return this.cloudiness;
  }

  setCloudiness(cloudiness) {
    this.cloudiness = cloudiness;
  }

  getPrecipitationType() {
    return this.precipitationType;
  }

  setPrecipitationType(precipitationType) {
    this.precipitationType = precipitationType;
  }

  getPrecipitationIntensity() {
    return this.precipitationIntensity;
  }

  setPrecipitationIntensity(precipitationIntensity) {
    this.precipitationIntensity = precipitationIntensity;
  }

  getWindSpeed() {
    return this.windSpeed;
  }

  setWindSpeed(windSpeed) {
    this.windSpeed = windSpeed;
  }

  getWindDirection() {
    return this.windDirection;
  }

  setWindDirection(windDirection) {
    this.windDirection = windDirection;
  }

  toJson() {
    const json = Object();

    if (this.airTemperature && this.airTemperature !== undefined) {
      json["airTemperature"] = + this.airTemperature;
    }
    if (this.cloudiness !== undefined && this.cloudiness >= 0 && this.cloudiness <= 6) {
      json["cloudiness"] = + this.cloudiness;
    }
    if (this.precipitationType && this.precipitationType !== undefined) {
      json["precipitationType"] = Enums.PrecipitationType[this.precipitationType];
    }
    if (this.precipitationIntensity && this.precipitationIntensity !== undefined) {
      json["precipitationIntensity"] = Enums.PrecipitationIntensity[this.precipitationIntensity];
    }
    if (this.windSpeed && this.windSpeed !== undefined) {
      json["windSpeed"] = Enums.WindSpeed[this.windSpeed];
    }
    if (this.windDirection && this.windDirection !== undefined) {
      json["windDirection"] = Enums.Aspect[this.windDirection];
    }

    return json;
  }
}
