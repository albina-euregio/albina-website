export enum TestType {
	ECT = 1, RB = 2, CT = 3, PST = 4
}
export class TestTypeUtil {
	public static getString(size: TestType) {
		switch (size) {
			case TestType.ECT:
				return "testType.ECT";
			case TestType.RB:
				return "testType.RB";
			case TestType.CT:
				return "testType.CT";
			case TestType.PST:
				return "testType.PST";

			default:
				return "undefined";
		}
	}
	public static getCode(size: TestType) {
		switch (size) {
			case TestType.ECT:
				return "ECT";
			case TestType.RB:
				return "RB";
			case TestType.CT:
				return "CT";
			case TestType.PST:
				return "PST";

			default:
				return "undefined";
		}
	}
	public static getSize() {
		return 4;
	}
}

export enum EctFractureType {
	propagation = 1, noPropagation = 2, noBreak = 3
}
export class EctFractureTypeUtil {
	public static getString(size) {
		switch (size) {
			case EctFractureType.propagation:
				return "ectFractureType.propagation";
			case EctFractureType.noPropagation:
				return "ectFractureType.noPropagation";
			case EctFractureType.noBreak:
				return "ectFractureType.noBreak";

			default:
				return "undefined";
		}
	}
	public static getSize() {
		return 3;
	}
}

export enum CtFractureType {
	suddenPlanar = 1, suddenCollapse = 2, resistantPlanar = 3, progressiveCompression = 4, nonPlanarBreak = 5, noBreak = 6
}
export class CtFractureTypeUtil {
	public static getString(size) {
		switch (size) {
			case CtFractureType.suddenPlanar:
				return "ctFractureType.suddenPlanar";
			case CtFractureType.suddenCollapse:
				return "ctFractureType.suddenCollapse";
			case CtFractureType.resistantPlanar:
				return "ctFractureType.resistantPlanar";
			case CtFractureType.progressiveCompression:
				return "ctFractureType.progressiveCompression";
			case CtFractureType.nonPlanarBreak:
				return "ctFractureType.nonPlanarBreak";
			case CtFractureType.noBreak:
				return "ctFractureType.noBreak";

			default:
				return "undefined";
		}
	}
	public static getCode(size) {
		switch (size) {
			case CtFractureType.suddenPlanar:
				return "SP";
			case CtFractureType.suddenCollapse:
				return "SC";
			case CtFractureType.resistantPlanar:
				return "RP";
			case CtFractureType.progressiveCompression:
				return "PC";
			case CtFractureType.nonPlanarBreak:
				return "B";
			case CtFractureType.noBreak:
				return "NB";

			default:
				return "undefined";
		}
	}
	public static getSize() {
		return 6;
	}
}

export enum RbFractureType {
	wholeBlock = 1, partialBreak = 2, noBreak = 3
}
export class RbFractureTypeUtil {
	public static getString(size) {
		switch (size) {
			case RbFractureType.wholeBlock:
				return "rbFractureType.wholeBlock";
			case RbFractureType.partialBreak:
				return "rbFractureType.partialBreak";
			case RbFractureType.noBreak:
				return "rbFractureType.noBreak";

			default:
				return "undefined";
		}
	}
	public static getCode(size) {
		switch (size) {
			case RbFractureType.wholeBlock:
				return "whole block";
			case RbFractureType.partialBreak:
				return "partial break";
			case RbFractureType.noBreak:
				return "no break";

			default:
				return "undefined";
		}
	}
	public static getSize() {
		return 3;
	}
}

export enum PstFractureType {
	Arr = 1, SF = 2, End = 3
}
export class PstFractureTypeUtil {
	public static getString(size) {
		switch (size) {
			case PstFractureType.Arr:
				return "pstFractureType.Arr";
			case PstFractureType.SF:
				return "pstFractureType.SF";
			case PstFractureType.End:
				return "pstFractureType.End";

			default:
				return "undefined";
		}
	}
	public static getCode(size) {
		switch (size) {
			case PstFractureType.Arr:
				return "Arr";
			case PstFractureType.SF:
				return "SF";
			case PstFractureType.End:
				return "End";

			default:
				return "undefined";
		}
	}
	public static getSize() {
		return 3;
	}
}

export enum StabilityTestClassification {
	weak = 1, moderate = 2, stable = 3
}
export class StabilityTestClassificationUtil {
	public static getString(classification: StabilityTestClassification) {
		switch (classification) {
			case StabilityTestClassification.weak:
				return "stabilityTestClassification.weak";
			case StabilityTestClassification.weak:
				return "stabilityTestClassification.moderate";
			case StabilityTestClassification.weak:
				return "stabilityTestClassification.stable";
			default:
				return "undefined";
		}
	}
}

export enum GrainShape {
	PP = 1, PPgp = 2, MM = 3, DF = 4, RG = 5, FC = 6, FCxr = 7, DH = 8, SH = 9, MF = 10, MFcr = 11, IF = 12
}
export class GrainShapeUtil {
	public static getString(size: GrainShape) {
		switch (size) {
			case GrainShape.PP:
				return "grainShape.PP";
			case GrainShape.PPgp:
				return "grainShape.PPgp";
			case GrainShape.MM:
				return "grainShape.MM";
			case GrainShape.DF:
				return "grainShape.DF";
			case GrainShape.RG:
				return "grainShape.RG";
			case GrainShape.FC:
				return "grainShape.FC";
			case GrainShape.FCxr:
				return "grainShape.FCxr";
			case GrainShape.DH:
				return "grainShape.DH";
			case GrainShape.SH:
				return "grainShape.SH";
			case GrainShape.MF:
				return "grainShape.MF";
			case GrainShape.MFcr:
				return "grainShape.MFcr";
			case GrainShape.IF:
				return "grainShape.IF";

			default:
				return "undefined";
		}
	}
	public static getCode(size: GrainShape) {
		switch (size) {
			case GrainShape.PP:
				return "PP";
			case GrainShape.PPgp:
				return "PPgp";
			case GrainShape.MM:
				return "MM";
			case GrainShape.DF:
				return "DF";
			case GrainShape.RG:
				return "RG";
			case GrainShape.FC:
				return "FC";
			case GrainShape.FCxr:
				return "FCxr";
			case GrainShape.DH:
				return "DH";
			case GrainShape.SH:
				return "SH";
			case GrainShape.MF:
				return "MF";
			case GrainShape.MFcr:
				return "MFcr";
			case GrainShape.IF:
				return "IF";

			default:
				return "undefined";
		}
	}
	public static getSize() {
		return 12;
	}
}

export enum Aspect {
	N = 1, NE = 2, E = 3, SE = 4, S = 5, SW = 6, W = 7, NW = 8
}
export class AspectUtil {
	public static getSize() {
		return 8;
	}
}

export enum Quality {
	measured = 1, estimated = 2
}
export class QualityUtil {
	public static getSize() {
		return 2;
	}
}

export enum CountryAlpha2Code {
	AF, AX, AL, DZ, AS, AD, AO, AI, AQ, AG, AR, AM, AW, AU, AT, AZ, BS, BH, BD, BB, BY, BE, BZ, BJ, BM, BT, BO, BQ, BA, BW, BV, BR, IO, BN, BG, BF, BI, CV, KH, CM, CA, KY, CF, TD, CL, CN, CX, CC, CO, KM, CD, CG, CK, CR, CI, HR, CU, CW, CY, CZ, DK, DJ, DM, DO, EC, EG, SV, GQ, ER, EE, ET, FK, FO, FJ, FI, FR, GF, PF, TF, GA, GM, GE, DE, GH, GI, GR, GL, GD, GP, GU, GT, GG, GN, GW, GY, HT, HM, VA, HN, HK, HU, IS, IN, ID, IR, IQ, IE, IM, IL, IT, JM, JP, JE, JO, KZ, KE, KI, KP, KR, KW, KG, LA, LV, LB, LS, LR, LY, LI, LT, LU, MO, MK, MG, MW, MY, MV, ML, MT, MH, MQ, MR, MU, YT, MX, FM, MD, MC, MN, ME, MS, MA, MZ, MM, NA, NR, NP, NL, NC, NZ, NI, NE, NG, NU, NF, MP, NO, OM, PK, PW, PS, PA, PG, PY, PE, PH, PN, PL, PT, PR, QA, RE, RO, RU, RW, BL, SH, KN, LC, MF, PM, VC, WS, SM, ST, SA, SN, RS, SC, SL, SG, SX, SK, SI, SB, SO, ZA, GS, SS, ES, LK, SD, SR, SJ, SZ, SE, CH, SY, TW, TJ, TZ, TH, TL, TG, TK, TO, TT, TN, TR, TM, TC, TV, UG, UA, AE, GB, UM, US, UY, UZ, VU, VE, VN, VG, VI, WF, EH, YE, ZM, ZW
}
export class CountryAlpha2CodeUtil {
	public static getSize() {
		return Object.keys(CountryAlpha2Code).length / 2 - 2;
	}
}

export enum WindSpeed {
	calm = 1, gentle = 2, moderate = 3, strong = 4, gale = 5, storm = 6
}
export class WindSpeedUtil {
	public static getSize() {
		return 6;
	}
}

export enum PrecipitationType {
	none = 1, snow = 2, rain = 3, graupel = 4
}
export class PrecipitationTypeUtil {
	public static getSize() {
		return 4;
	}
}

export enum PrecipitationIntensity {
	light = 1, moderate = 2, heavy = 3
}
export class PrecipitationIntensityUtil {
	public static getString(size: PrecipitationIntensity) {
		switch (size) {
			case PrecipitationIntensity.light:
				return "precipitationIntensity.light";
			case PrecipitationIntensity.moderate:
				return "precipitationIntensity.moderate";
			case PrecipitationIntensity.heavy:
				return "precipitationIntensity.heavy";

			default:
				return "undefined";
		}
	}
	public static getSize() {
		return 3;
	}
}

export enum GrainSize {
	fine = 2, medium = 3, coarse = 4, very_coarse = 5, extreme = 6
}
export class GrainSizeUtil {
	public static getString(size: GrainSize) {
		switch (size) {
			case GrainSize.fine:
				return "grainSize.fine";
			case GrainSize.medium:
				return "grainSize.medium";
			case GrainSize.coarse:
				return "grainSize.coarse";
			case GrainSize.very_coarse:
				return "grainSize.very_coarse";
			case GrainSize.extreme:
				return "grainSize.extreme";

			default:
				return "undefined";
		}
	}
	public static getMinGrainSize(size: GrainSize) {
		switch (size) {
			case GrainSize.fine:
				return undefined;
			case GrainSize.medium:
				return 0.5;
			case GrainSize.coarse:
				return 1.0;
			case GrainSize.very_coarse:
				return 2.0;
			case GrainSize.extreme:
				return 5.0;

			default:
				return undefined;
		}
	}
	public static getMaxGrainSize(size: GrainSize) {
		switch (size) {
			case GrainSize.fine:
				return 0.5;
			case GrainSize.medium:
				return 1.0;
			case GrainSize.coarse:
				return 2.0;
			case GrainSize.very_coarse:
				return 5.0;
			case GrainSize.extreme:
				return undefined;

			default:
				return undefined;
		}
	}
	public static getSize() {
		return 5;
	}
}

export enum Wetness {
	dry = 1, moist = 2, wet = 3, very_wet = 4, soaked = 5
}
export class WetnessUtil {
	public static getString(size: Wetness) {
		switch (size) {
			case Wetness.dry:
				return "wetness.dry";
			case Wetness.moist:
				return "wetness.moist";
			case Wetness.wet:
				return "wetness.wet";
			case Wetness.very_wet:
				return "wetness.very_wet";
			case Wetness.soaked:
				return "wetness.soaked";

			default:
				return "undefined";
		}
	}
	public static getSize() {
		return 5;
	}
}

export enum Hardness {
	very_soft = 1, soft = 2, medium = 3, hard = 4, very_hard = 5, ice = 6
}
export class HardnessUtil {
	public static getSize() {
		return 6;
	}
}

export enum HandHardness {
	F = 1, F_FF = 2, FF = 3, FF_OF = 4, OF = 5, OF_P = 6, P = 7, P_K = 8, K = 9, K_I = 10, I = 11
}
export class HandHardnessUtil {
	public static getString(size: HandHardness) {
		switch (size) {
			case HandHardness.F:
				return "handHardness.F";
			case HandHardness.F_FF:
				return "handHardness.F_FF";
			case HandHardness.FF:
				return "handHardness.FF";
			case HandHardness.FF_OF:
				return "handHardness.FF_OF";
			case HandHardness.OF:
				return "handHardness.OF";
			case HandHardness.OF_P:
				return "handHardness.OF_P";
			case HandHardness.P:
				return "handHardness.P";
			case HandHardness.P_K:
				return "handHardness.P_K";
			case HandHardness.K:
				return "handHardness.K";
			case HandHardness.K_I:
				return "handHardness.K_I";
			case HandHardness.I:
				return "handHardness.I";

			default:
				return "undefined";
		}
	}
	public static getPercent(size: HandHardness) {
		switch (size) {
			case HandHardness.F:
				return "1";
			case HandHardness.F_FF:
				return "3";
			case HandHardness.FF:
				return "5";
			case HandHardness.FF_OF:
				return "10";
			case HandHardness.OF:
				return "15";
			case HandHardness.OF_P:
				return "25";
			case HandHardness.P:
				return "35";
			case HandHardness.P_K:
				return "50";
			case HandHardness.K:
				return "65";
			case HandHardness.K_I:
				return "85";
			case HandHardness.I:
				return "100";

			default:
				return "undefined";
		}
	}
	public static getSize() {
		return 11;
	}
}

export enum Cloudiness {
	one_okta = 1, two_okta = 2, three_okta = 3, four_okta = 4, five_okta = 5, six_okta = 6, seven_okta = 7, eight_okta = 8
}
export class CloudinessUtil {
	public static getString(size: Cloudiness) {
		switch (size) {
			case Cloudiness.one_okta:
				return "Cloudiness.one_okta";
			case Cloudiness.two_okta:
				return "Cloudiness.two_okta";
			case Cloudiness.three_okta:
				return "Cloudiness.three_okta";
			case Cloudiness.four_okta:
				return "Cloudiness.four_okta";
			case Cloudiness.five_okta:
				return "Cloudiness.five_okta";
			case Cloudiness.six_okta:
				return "Cloudiness.six_okta";
			case Cloudiness.seven_okta:
				return "Cloudiness.seven_okta";
			case Cloudiness.eight_okta:
				return "Cloudiness.eight_okta";

			default:
				return "undefined";
		}
	}
	public static getValue(size: Cloudiness) {
		switch (size) {
			case Cloudiness.one_okta:
				return 1;
			case Cloudiness.two_okta:
				return 2;
			case Cloudiness.three_okta:
				return 3;
			case Cloudiness.four_okta:
				return 4;
			case Cloudiness.five_okta:
				return 5;
			case Cloudiness.six_okta:
				return 6;
			case Cloudiness.seven_okta:
				return 7;
			case Cloudiness.eight_okta:
				return 8;

			default:
				return undefined;
		}
	}
	public static getSize() {
		return 8;
	}
}

export enum SkyCondition {
	CLR = 1, FEW = 2, SCT = 3, BKN = 4, OVC = 5, X = 6
}
export class SkyConditionUtil {
	public static getString(size: SkyCondition) {
		switch (size) {
			case SkyCondition.CLR:
				return "SkyCondition.CLR";
			case SkyCondition.FEW:
				return "SkyCondition.FEW";
			case SkyCondition.SCT:
				return "SkyCondition.SCT";
			case SkyCondition.BKN:
				return "SkyCondition.BKN";
			case SkyCondition.OVC:
				return "SkyCondition.OVC";
			case SkyCondition.X:
				return "SkyCondition.X";

			default:
				return "undefined";
		}
	}
	public static getValue(size: SkyCondition) {
		switch (size) {
			case SkyCondition.CLR:
				return 1;
			case SkyCondition.FEW:
				return 2;
			case SkyCondition.SCT:
				return 3;
			case SkyCondition.BKN:
				return 4;
			case SkyCondition.OVC:
				return 5;
			case SkyCondition.X:
				return 6;

			default:
				return undefined;
		}
	}
	public static getSize() {
		return 6;
	}
}

export enum LayerThickness {
	half = 1, one = 2, two = 3, five = 4, ten = 5, twenty = 6, thirty = 7, fourty = 8, fifty = 9, sixty = 10, seventy = 11, eighty = 12, ninety = 13, hundred = 14
}
export class LayerThicknessUtil {
	public static getString(size: LayerThickness) {
		switch (size) {
			case LayerThickness.half:
				return "layerThickness.half";
			case LayerThickness.one:
				return "layerThickness.one";
			case LayerThickness.two:
				return "layerThickness.two";
			case LayerThickness.five:
				return "layerThickness.five";
			case LayerThickness.ten:
				return "layerThickness.ten";
			case LayerThickness.twenty:
				return "layerThickness.twenty";
			case LayerThickness.thirty:
				return "layerThickness.thirty";
			case LayerThickness.fourty:
				return "layerThickness.fourty";
			case LayerThickness.fifty:
				return "layerThickness.fifty";
			case LayerThickness.sixty:
				return "layerThickness.sixty";
			case LayerThickness.seventy:
				return "layerThickness.seventy";
			case LayerThickness.eighty:
				return "layerThickness.eighty";
			case LayerThickness.ninety:
				return "layerThickness.ninety";
			case LayerThickness.hundred:
				return "layerThickness.hundred";

			default:
				return "undefined";
		}
	}
	public static getValue(size: LayerThickness) {
		switch (size) {
			case LayerThickness.half:
				return 0.5;
			case LayerThickness.one:
				return 1;
			case LayerThickness.two:
				return 2;
			case LayerThickness.five:
				return 5;
			case LayerThickness.ten:
				return 10;
			case LayerThickness.twenty:
				return 20;
			case LayerThickness.thirty:
				return 30;
			case LayerThickness.fourty:
				return 40;
			case LayerThickness.fifty:
				return 50;
			case LayerThickness.sixty:
				return 60;
			case LayerThickness.seventy:
				return 70;
			case LayerThickness.eighty:
				return 80;
			case LayerThickness.ninety:
				return 90;
			case LayerThickness.hundred:
				return 100;

			default:
				return undefined;
		}
	}
	public static getSize() {
		return 14;
	}
}