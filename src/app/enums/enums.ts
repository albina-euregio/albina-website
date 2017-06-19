export enum Aspect {
	N = 1, NE = 2, E = 3, SE = 4, S = 5, SW = 6, W = 7, NW = 8
}
export class AspectUtil {
	public static getSize() {
		return 8;
	}
}

export enum LanguageCode {
	ab, aa, af, ak, sq, am, ar, an, hy, as, av, ae, ay, az, bm, ba, eu, be, bn, bh, bi, bs, br, bg, my, ca, ch, ce, ny, zh, cv, kw, co, cr, hr, cs, da, dv, nl, dz, en, eo, et, ee, fo, fj, fi, fr, ff, gl, ka, de, el, gn, gu, ht, ha, he, hz, hi, ho, hu, ia, id, ie, ga, ig, ik, io, is, it, iu, ja, jv, kl, kn, kr, ks, kk, km, ki, rw, ky, kv, kg, ko, ku, kj, la, lb, lg, li, ln, lo, lt, lu, lv, gv, mk, mg, ms, ml, mt, mi, mr, mh, mn, na, nv, nd, ne, ng, nb, nn, no, ii, nr, oc, oj, cu, om, or, os, pa, pi, fa, pl, ps, pt, qu, rm, rn, ro, ru, sa, sc, sd, se, sm, sg, sr, gd, sn, si, sk, sl, so, st, es, su, sw, ss, sv, ta, te, tg, th, ti, bo, tk, tl, tn, to, tr, ts, tt, tw, ty, ug, uk, ur, uz, ve, vi, vo, wa, cy, wo, fy, xh, yi, yo, za, zu
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
	no_rating = 0, low = 1, moderate = 2, considerable = 3, high = 4, very_high = 5
}
export class DangerRatingUtil {
	public static getSize() {
		return 6;
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
	missing, incomplete, complete, pending, published
}

export enum NewsStatus {
	incomplete, complete, pending, published
}