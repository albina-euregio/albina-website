export enum Aspect {
	N = 1, NE = 2, E = 3, SE = 4, S = 5, SW = 6, W = 7, NW = 8
}
export class AspectUtil {
	public static getSize() {
		return 8;
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

export enum DangerRating {
	low = 1, moderate = 2, considerable = 3, high = 4, very_high = 5
}
export class DangerRatingUtil {
	public static getSize() {
		return 5;
	}
}

export enum AvalancheProblem {
	new_snow, wind_drifted_snow, old_snow, wet_snow, gliding_snow
}
export class AvalancheProblemUtil {
	public static getSize() {
		return 5;
	}
}

export enum BulletinStatus {
	missing, incomplete, complete
}