import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  // Localhost
  //public serverUrl: string = 'http://localhost:8080/albina/api/';
  //public socketIOUrl: string = 'http://localhost:9092';

  // Development server
  public serverUrl: string = 'http://212.47.231.185:8080/albina/api/';
  public socketIOUrl: string = 'http://212.47.231.185:9092';

  // CentOS
  //public serverUrl: string = 'http://163.172.132.87:8080/albina/api/';
  //public socketIOUrl: string = 'http://163.172.132.87:9092';

  // CLESIUS
  //public serverUrl: string = 'http://192.168.30.189:8080/albina/api/';
  //public socketIOUrl: string = 'http://192.168.30.189:9092';

  public textcatUrl: string = 'http://albina.clesius.it/textcat/c_pm.html';

  public snowObserverServerUrl: string = 'https://snowobserver.com/snowobserver/api/';
  public natlefsServerUrl: string = 'https://natlefs.snowobserver.com/snowobserver/api/';
  public natlefsUsername: string = 'norbert.lanzanasto@tirol.gv.at';
  public natlefsPassword: string = 'FRYLjTQ2';

  public codeTyrol: string = 'AT-07';
  public codeSouthTyrol: string = 'IT-32-BZ';
  public codeTrentino: string = 'IT-32-TN';
  public codeStyria: string = 'AT-06';

  public roleAdmin: string = 'ADMIN';
  public roleForecaster: string = 'FORECASTER';
  public roleForeman: string = 'FOREMAN';
  public roleObserver: string = 'OBSERVER';
    
  public lat: Map<String, number> = new Map([["", 47.10], [this.codeTyrol, 47.10], [this.codeSouthTyrol, 46.65], [this.codeTrentino, 46.05], [this.codeStyria, 47.26]])
  public lng: Map<String, number> = new Map([["", 11.44], [this.codeTyrol, 11.44], [this.codeSouthTyrol, 11.40], [this.codeTrentino, 11.07], [this.codeStyria, 14.94]])

  public mapBoundaryN: number = 48.0;
  public mapBoundaryE: number = 13.5;
  public mapBoundaryS: number = 45.0;
  public mapBoundaryW: number = 9.0;

  public timeframe: number = 14;
  public autoSaveIntervall: number = 1000;

  public regions: Map<string, String[]> = new Map([
    [this.codeTyrol, ['AT-07-01', 'AT-07-02', 'AT-07-03', 'AT-07-04', 'AT-07-05', 'AT-07-06', 'AT-07-07', 'AT-07-08', 'AT-07-09', 'AT-07-10', 'AT-07-11', 'AT-07-12', 'AT-07-13', 'AT-07-14', 'AT-07-15', 'AT-07-16', 'AT-07-17', 'AT-07-18', 'AT-07-19', 'AT-07-20', 'AT-07-21', 'AT-07-22', 'AT-07-23', 'AT-07-24', 'AT-07-25', 'AT-07-26', 'AT-07-27', 'AT-07-28', 'AT-07-29']],
    [this.codeSouthTyrol, ['IT-32-BZ-01', 'IT-32-BZ-02', 'IT-32-BZ-03', 'IT-32-BZ-04', 'IT-32-BZ-05', 'IT-32-BZ-06', 'IT-32-BZ-07', 'IT-32-BZ-08', 'IT-32-BZ-09', 'IT-32-BZ-10', 'IT-32-BZ-11', 'IT-32-BZ-12', 'IT-32-BZ-13', 'IT-32-BZ-14', 'IT-32-BZ-15', 'IT-32-BZ-16', 'IT-32-BZ-17', 'IT-32-BZ-18', 'IT-32-BZ-19', 'IT-32-BZ-20']],
    [this.codeTrentino, ['IT-32-TN-01', 'IT-32-TN-02', 'IT-32-TN-03', 'IT-32-TN-04', 'IT-32-TN-05', 'IT-32-TN-06', 'IT-32-TN-07', 'IT-32-TN-08', 'IT-32-TN-09', 'IT-32-TN-10', 'IT-32-TN-11', 'IT-32-TN-12', 'IT-32-TN-13', 'IT-32-TN-14', 'IT-32-TN-15', 'IT-32-TN-16', 'IT-32-TN-17', 'IT-32-TN-18', 'IT-32-TN-19', 'IT-32-TN-20', 'IT-32-TN-21']],
    [this.codeStyria, ['AT-06-01', 'AT-06-02', 'AT-06-03', 'AT-06-04', 'AT-06-05', 'AT-06-06', 'AT-06-07', 'AT-06-08']]
  ]);

  public colorDangerRatingLow = '#CCFF66';
  public colorDangerRatingModerate = '#FFFF00';
  public colorDangerRatingConsiderable = '#FF9900';
  public colorDangerRatingHigh = '#FF0000';
  // not standardized
  public colorDangerRatingVeryHigh = '#800000';
  public colorDangerRatingMissing = '#969696';
  // TODO use correct color
  public colorDangerRatingNoSnow = "#A0522D";
  public colorActiveSelection = '#3852A4';

  public lineColor = '#000000';
  public lineWeight = 0.5;
  public lineOpacityOwnRegion = 1.0;
  public lineOpacityForeignRegion = 0.3;

  public fillOpacityOwnSelected = 1.0;
  public fillOpacityOwnDeselected = 0.6;
  public fillOpacityOwnSelectedSuggested = 0.8;
  public fillOpacityOwnDeselectedSuggested = 0.5;

  public fillOpacityForeignSelected = 0.5;
  public fillOpacityForeignDeselected = 0.3;
  public fillOpacityForeignSelectedSuggested = 0.5;
  public fillOpacityForeignDeselectedSuggested = 0.2;

  public fillOpacityEditSelected = 0.5;
  public fillOpacityEditSuggested = 0.3;

  public newSnowTextcat = "13[9378[5862],11641,9413].13[9382[3741],11645[10214,5932[4170,3773]],9413].13[9367,11650[10215[9257,7593,825,12250],5932[4170,3773]],9413].92[2977[6242],3761,10399[3790],2798[7468,9568],12126[9570]].61[9516[12004],7703,9808,6621,11633,14841,7358,3736,9413].110[6144[10033,12054,10192],14928,8413[6754],7522,4185,5890,9413].8[796,7855,14189,477,9413].72[3674,4259]";
  public newSnowDe = "Der Neuschnee der letzten zwei Tage bildet die Hauptgefahr. Er kann an allen Expositionen oberhalb der Waldgrenze leicht ausgelöst werden oder spontan abgleiten. Der Neuschnee kann besonders an den Expositionen West über Nord bis Süd oberhalb der Waldgrenze von einzelnen Wintersportlern ausgelöst werden. Bis am Morgen fallen verbreitet oberhalb von rund 1800 m 50 cm Schnee, lokal bis zu 70 cm. Vor allem in den Hauptniederschlagsgebieten sind mit der Intensivierung der Schneefälle zahlreiche mittlere und vereinzelt grosse Schneebrettlawinen zu erwarten. Mit Neuschnee und teils stürmischem Wind entstehen im Tagesverlauf an allen Expositionen teils grosse Triebschneeansammlungen. Die Verhältnisse abseits der Pisten sind gefährlich. Temporäre Sicherheitsmassnahmen können nötig werden.";
  public newSnowIt = "La neve fresca degli ultimi due giorni rappresenta la principale fonte di pericolo. Essa può facilmente subire un distacco provocato o spontaneo a tutte le esposizioni al di sopra del limite del bosco. La neve fresca può subire un distacco in seguito al passaggio di un singolo appassionato di sport invernali soprattutto sui pendii esposti da ovest a nord sino a sud al di sopra del limite del bosco. In molte regioni sino al mattino cadranno 50 cm di neve al di sopra dei 1800 m circa, localmente sino a 70 cm. Con l'intensificarsi delle nevicate, soprattutto nelle regioni più colpite dalle precipitazioni sono previste numerose valanghe di neve a lastroni di medie e, a livello isolato, di grandi dimensioni. Con neve fresca e vento in parte tempestoso nel corso della giornata a tutte le esposizioni si formeranno accumuli di neve ventata in parte di grandi dimensioni. Le condizioni al di fuori delle piste sono pericolose. Misure temporanee di sicurezza potrebbero rendersi necessarie.";
  public newSnowEn = "The fresh snow of the last two days represents the main danger. It can be released easily or naturally in all aspects above the tree line. The fresh snow can be released by a single winter sport participant especially on west to north to south facing aspects above the tree line. Over a wide area 50 cm of snow, and up to 70 cm in some localities, will fall until the early morning above approximately 1800 m. In particular in the regions exposed to heavier precipitation numerous medium-sized and, in isolated cases, large slab avalanches are to be expected as the snowfall becomes more intense. As a consequence of fresh snow and a sometimes storm force wind, sometimes large wind slabs will form as the day progresses in all aspects. The off-piste conditions are dangerous. Temporary safety measures may be necessary.";
  public newSnowFr = "La neige fraîche des deux derniers jours constitue le danger principal. Elle peut facilement être déclenchée, ou glisser spontanément à toutes les expositions au-dessus de la limite de la forêt. La neige fraîche peut être déclenchée par un seul amateur de sports d'hiver particulièrement sur les pentes exposées à l'ouest à sud en passant par le nord au-dessus de la limite de la forêt. Jusqu'au matin il tombera en général au-dessus d'environ 1800 m 50 cm de neige, localement jusqu'à 70 cm. Avec l'intensification des chutes de neige de très nombreuses avalanches de plaque de neige de moyenne et rarement grande taille sont à attendre surtout dans les régions concernées par les précipitations principales. Des accumulations de neige soufflée en partie grandes se forment avec la neige fraîche et le vent partiellement tempétueux en cours de journée à toutes les expositions. Les conditions en dehors des pistes sont dangereuses. Des mesures de sécurité temporaires peuvent devenir nécessaires.";
  public windDriftedSnowTextcat = "";
  public windDriftedSnowDe = "";
  public windDriftedSnowIt = "";
  public windDriftedSnowEn = "";
  public windDriftedSnowFr = "";
  public oldSnowTextcat = "";
  public oldSnowDe = "";
  public oldSnowIt = "";
  public oldSnowEn = "";
  public oldSnowFr = "";
  public wetSnowTextcat = "";
  public wetSnowDe = "";
  public wetSnowIt = "";
  public wetSnowEn = "";
  public wetSnowFr = "";
  public glidingSnowTextcat = "";
  public glidingSnowDe = "";
  public glidingSnowIt = "";
  public glidingSnowEn = "";
  public glidingSnowFr = "";


  constructor() {
  }

  getDangerRatingColor(dangerRating) {
    switch (dangerRating) {
      case "very_high":
        return this.colorDangerRatingVeryHigh;
      case "high":
        return this.colorDangerRatingHigh;
      case "considerable":
        return this.colorDangerRatingConsiderable;
      case "moderate":
        return this.colorDangerRatingModerate;
      case "low":
        return this.colorDangerRatingLow;
      case "no_snow":
        return this.colorDangerRatingNoSnow;
      
      default:
        return this.colorDangerRatingMissing;
    }
  }

  getServerUrl() {
    return this.serverUrl;
  }

  getSnowObserverServerUrl() {
    return this.snowObserverServerUrl;
  }

  getNatlefsServerUrl() {
    return this.natlefsServerUrl;
  }

  getNatlefsUsername() {
    return this.natlefsUsername;
  }

  getNatlefsPassword() {
    return this.natlefsPassword;
  }

  getTimeframe() {
    return this.timeframe;
  }

  getISOStringWithTimezoneOffsetUrlEncoded(date: Date) {
    return encodeURIComponent(this.getISOStringWithTimezoneOffset(date));
  }

  getISOStringWithTimezoneOffset(date: Date) {
    let offset = -date.getTimezoneOffset();
    let dif = offset >= 0 ? '+' : '-';

    return date.getFullYear() + 
      '-' + this.extend(date.getMonth() + 1) +
      '-' + this.extend(date.getDate()) +
      'T' + this.extend(date.getHours()) +
      ':' + this.extend(date.getMinutes()) +
      ':' + this.extend(date.getSeconds()) +
      dif + this.extend(offset / 60) +
      ':' + this.extend(offset % 60);
  }

  extend(num: number) {
    let norm = Math.abs(Math.floor(num));
    return (norm < 10 ? '0' : '') + norm;
  }

  getLat(region: String) {
    if (region && region != undefined)
      return this.lat.get(region);
    else
      return this.lat.get("");
  }

  getLng(region: String) {
    if (region && region != undefined)
      return this.lng.get(region);
    else
      return this.lng.get("");
  }
}