import React from "react";
import { observer } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import DangerPatternItem from "./danger-pattern-item";
import BulletinDaytimeReport from "./bulletin-daytime-report";
import { dateToLongDateString, parseDate } from "../../util/date";
import { preprocessContent } from "../../util/htmlParser";
import { getWarnlevelNumber } from "../../util/warn-levels";

const GLOSSARY_LINKS = [
  [
    /\babbauend umgewandelt\b/g,
    "abbauendeschneeumwandlungisothermemetamorphose"
  ],
  [/\bAbstrahlung \b/g, "abstrahlungausstrahlungstrahlungsnacht"],
  [/\bnächtliche Abstrahlung\b/g, "abstrahlungausstrahlungstrahlungsnacht"],
  [/\bAltschnee\b/g, "altschneedecke"],
  [/\bAltschneedecke\b/g, "altschneedecke"],
  [/\baufbauend umgewandelt\b/g, "aufbauendeumwandlungfacettenbildung"],
  [/\bkaum gebunden\b/g, "bindungsarmeschneeschicht"],
  [/\bschwach gebunden\b/g, "bindungsarmeschneeschicht"],
  [/\bAnfeuchtung\b/g, "durchfeuchteterschneeschwachfeucht"],
  [/\bdurchnässte\b/g, "durchnssterschnee"],
  [/\bdurchnässten \b/g, "durchnssterschnee"],
  [/\bDurchnässung\b/g, "durchnssterschnee"],
  [/\bSonneneinstrahlung\b/g, "einstrahlung"],
  [/\bEinzugsgebieten\b/g, "einzugsgebietvonlawinen"],
  [/\bEntlastungsabstände\b/g, "entlastungsabstnde"],
  [/\bexponierte\b/g, "exponiert"],
  [/\bexponierten\b/g, "exponiert"],
  [/\bexponierter\b/g, "exponiert"],
  [/\bExpositionen\b/g, "expositionhangrichtung"],
  [/\bextremen Steilgelände\b/g, "extremessteilgelnde"],
  [/\bFelswandfüssen \b/g, "felswandfu"],
  [/\bFernauslösungen\b/g, "fernauslsung"],
  [/\bFestigkeit\b/g, "festigkeitimschnee"],
  [/\bFestigkeitsverlust\b/g, "festigkeitsabnahmeverlustineinerschneeschicht"],
  [/\binstabil\b/g, "festigkeitsabnahmeverlustineinerschneeschicht"],
  [/\bverfestigen\b/g, "festigkeitszunahmeineinerschneeschicht"],
  [/\bverfestigt\b/g, "festigkeitszunahmeineinerschneeschicht"],
  [/\bverfestigte\b/g, "festigkeitszunahmeineinerschneeschicht"],
  [/\bVerfestigung\b/g, "festigkeitszunahmeineinerschneeschicht"],
  [/\bstabilisierten\b/g, "festigkeitszunahmeineinerschneeschicht"],
  [/\bstabilisieren\b/g, "festigkeitszunahmeineinerschneeschicht"],
  [/\bstabil\b/g, "festigkeitszunahmeineinerschneeschicht"],
  [/\bGleitschneerissen\b/g, "fischmaulgleitschneemaulgleitschneeriss"],
  [/\bgebunden\b/g, "gebundenerschnee"],
  [/\bgebundener\b/g, "gebundenerschnee"],
  [/\bGefahrenstellen \b/g, "gefahrenstellebeilawinen"],
  [/\bgesicherter\b/g, "gesichertegebiete"],
  [/\babgleiten\b/g, "gleitenschneegleiten"],
  [/\bGleitschneelawinen\b/g, "gleitschneerutschlawine"],
  [/\bGrundlawinen\b/g, "grundlawine"],
  [/\bflaches\b/g, "hangneigung"],
  [/\bsteilem\b/g, "hangneigung"],
  [/\bsteiles\b/g, "hangneigung"],
  [/\bflachem\b/g, "hangneigung"],
  [/\bsteile\b/g, "hangneigung"],
  [/\bsteilen\b/g, "hangneigung"],
  [/\bhohe Lagen\b/g, "hhenlage"],
  [/\bhohen Lagen\b/g, "hhenlage"],
  [/\bhohen Einzugsgebieten\b/g, "hhenlage"],
  [/\bmittlere Lagen\b/g, "hhenlage"],
  [/\bmittleren Lagen\b/g, "hhenlage"],
  [/\btiefe Lagen\b/g, "hhenlage"],
  [/\btiefen Lagen\b/g, "hhenlage"],
  [/\btieferen Lagen\b/g, "hhenlage"],
  [/\btieferen Einzugsgebieten\b/g, "hhenlage"],
  [/\bHochgebirge\b/g, "hochgebirge"],
  [/\bGeländekanten\b/g, "kamm"],
  [/\bkammfern\b/g, "kammfernfreiehanglage"],
  [/\bGipfellagen\b/g, "kammlagekammnahgratnahgipfelnah"],
  [/\bKamm-\b/g, "kammlagekammnahgratnahgipfelnah"],
  [/\bKammlagen\b/g, "kammlagekammnahgratnahgipfelnah"],
  [/\bkammnahen\b/g, "kammlagekammnahgratnahgipfelnah"],
  [/\bkantig \b/g, "kantigkrnigerschnee"],
  [/\bkleinräumig\b/g, "kleinrumig"],
  [/\bgesprengt\b/g, "knstlichelawinenauslsung"],
  [/\bkünstich ausgelöste\b/g, "knstlichelawinenauslsung"],
  [/\bLawinensprengungen\b/g, "knstlichelawinenauslsung"],
  [/\bkleine Lawine\b/g, "lawinengre"],
  [/\bRutsch\b/g, "lawinengre"],
  [/\bRutsche\b/g, "lawinengre"],
  [/\bRutschen\b/g, "lawinengre"],
  [/\bLawinenbulletins\b/g, "lawinenlageberichtlawinenbulletin"],
  [/\bLockerschneelawinen\b/g, "lockerschneelawine"],
  [/\blokal \b/g, "lokalrtlich"],
  [/\bmöglich\b/g, "mglichetwasistmglich"],
  [/\bMulden\b/g, "mulde"],
  [/\bNass-\b/g, "nassschneelawine"],
  [
    /\bspontan\b/g,
    "natrlichelawinenauslsungselbstauslsungvonlawinenspontanelawinen"
  ],
  [
    /\bspontane\b/g,
    "natrlichelawinenauslsungselbstauslsungvonlawinenspontanelawinen"
  ],
  [
    /\bspontanen\b/g,
    "natrlichelawinenauslsungselbstauslsungvonlawinenspontanelawinen"
  ],
  [/\bNeu- \b/g, "neuschnee"],
  [/\bNeuschnee\b/g, "neuschnee"],
  [/\bOberflächenreif\b/g, "oberflchenreif"],
  [/\bPasslagen\b/g, "passlage"],
  [/\bRinnen\b/g, "rinnerunse"],
  [/\bRisse \b/g, "rissbildung"],
  [/\bSchattenhängen\b/g, "schattenhangschattenseitigschattseitig"],
  [/\bschattig\b/g, "schattenhangschattenseitigschattseitig"],
  [/\bschattigen\b/g, "schattenhangschattenseitigschattseitig"],
  [/\bschattseitigen\b/g, "schattenhangschattenseitigschattseitig"],
  [/\bschattseitig\b/g, "schattenhangschattenseitigschattseitig"],
  [/\bSchmelzharschkruste\b/g, "schmelzharschschmelzharschdeckelschmelzkruste"],
  [/\bSchneebrettlawinen\b/g, "schneebrettlawine"],
  [/\bSchneedecke\b/g, "schneedecke"],
  [/\bAufbau\b/g, "schneedeckenaufbau"],
  [/\bSchneedeckenaufbau\b/g, "schneedeckenaufbau"],
  [/\bSchneedeckenaufbaus\b/g, "schneedeckenaufbau"],
  [/\bDünen \b/g, "schneednendnen"],
  [/\bSchneefallgrenze\b/g, "schneefallgrenze"],
  [/\bSchneehöhen\b/g, "schneehhe"],
  [/\bverfrachtet\b/g, "schneeverfrachtung"],
  [/\bverfrachtete\b/g, "schneeverfrachtung"],
  [/\bSchwachschichten \b/g, "schwachschichtschwacheschicht"],
  [/\bgesetzt\b/g, "setzung"],
  [/\bsetzen\b/g, "setzung"],
  [/\bsetzt\b/g, "setzung"],
  [/\bsetzte\b/g, "setzung"],
  [/\bEinzelabfahrten\b/g, "sicherheitsabstand"],
  [/\beinzeln befahren\b/g, "sicherheitsabstand"],
  [/\bsonnenbeschienenen\b/g, "sonnenhangsonnenseitigsonnseitig"],
  [/\bSonnenhängen\b/g, "sonnenhangsonnenseitigsonnseitig"],
  [/\bStabilität\b/g, "stabilittschneedeckenstabilitt"],
  [/\bStaublawinen\b/g, "staublawine"],
  [/\bSteilgelände\b/g, "steilgelnde"],
  [/\bstöranfällig\b/g, "stranfllig"],
  [/\bstöranfällige\b/g, "stranfllig"],
  [/\bstöranfälligen\b/g, "stranfllig"],
  [/\bstöranfälliger\b/g, "stranfllig"],
  [/\btageszeitlichen Erwärmung\b/g, "tagesgangtagesverlauf"],
  [/\bTallawinen\b/g, "tallawine"],
  [/\btragfähig\b/g, "tragfhigeschneedecke"],
  [/\bTrieb-\b/g, "triebschneeansammlungtriebschneeablagerungtriebschneelinse"],
  [
    /\bTriebschnee\b/g,
    "triebschneeansammlungtriebschneeablagerungtriebschneelinse"
  ],
  [
    /\bTriebschneeansammlungen\b/g,
    "triebschneeansammlungtriebschneeablagerungtriebschneelinse"
  ],
  [
    /\bTriebschneehängen\b/g,
    "triebschneeansammlungtriebschneeablagerungtriebschneelinse"
  ],
  [/\bungebunden\b/g, "ungebundenerschnee"],
  [/\bungebundener\b/g, "ungebundenerschnee"],
  [/\bwahrscheinlich\b/g, "wahrscheinlichetwasistwahrscheinlich"],
  [/\bWaldgrenzbereich\b/g, "waldgrenze"],
  [/\bWaldgrenze\b/g, "waldgrenze"],
  [/\bwindabgewandten\b/g, "windabgewandt"],
  [/\bwindgeschützten\b/g, "windabgewandt"],
  [/\bder Wind mässig\b/g, "windstrke"],
  [/\bder Wind schwach\b/g, "windstrke"],
  [/\bder Wind stark\b/g, "windstrke"],
  [/\bder Wind teilweise mässig\b/g, "windstrke"],
  [/\bder Wind teilweise schwach\b/g, "windstrke"],
  [/\bder Wind teilweise stark\b/g, "windstrke"],
  [/\bmässige Wind\b/g, "windstrke"],
  [/\bmässigem Wind\b/g, "windstrke"],
  [/\bOrkan\b/g, "windstrke"],
  [/\borkanartig\b/g, "windstrke"],
  [/\borkanartigem\b/g, "windstrke"],
  [/\borkanartigen\b/g, "windstrke"],
  [/\bschwache Wind\b/g, "windstrke"],
  [/\bschwachem Wind\b/g, "windstrke"],
  [/\bstarke Wind\b/g, "windstrke"],
  [/\bstarkem Wind\b/g, "windstrke"],
  [/\bSturm\b/g, "windstrke"],
  [/\bstürmisch\b/g, "windstrke"],
  [/\bstürmische\b/g, "windstrke"],
  [/\bstürmischen\b/g, "windstrke"],
  [/\bstürmischer\b/g, "windstrke"],
  [/\bstürmischem\b/g, "windstrke"],
  [/\bmässigen\b/g, "windstrke"],
  [/\bmässige Wind\b/g, "windstrke"],
  [/\bmässigem\b/g, "windstrke"],
  [/\bmässiger\b/g, "windstrke"],
  [/\bmässig bis stark\b/g, "windstrke"],
  [/\bschwach bis mässig\b/g, "windstrke"],
  [/\bbläst mässig\b/g, "windstrke"],
  [/\bblies mässig\b/g, "windstrke"],
  [/\bteilweise mässig\b/g, "windstrke"],
  [/\bschwachen bis mässigen\b/g, "windstrke"],
  [/\bschwachen Wind\b/g, "windstrke"],
  [/\bschwachem Wind\b/g, "windstrke"],
  [/\bschwachem bis mässigem\b/g, "windstrke"],
  [/\bmässige Nordwind\b/g, "windstrke"],
  [/\bmässige Nordostwind\b/g, "windstrke"],
  [/\bmässige Ostwind\b/g, "windstrke"],
  [/\bmässige Südostwind\b/g, "windstrke"],
  [/\bmässige Südwind\b/g, "windstrke"],
  [/\bmässige Südwestwind\b/g, "windstrke"],
  [/\bmässige Westwind\b/g, "windstrke"],
  [/\bmässige Nordwestwind\b/g, "windstrke"],
  [/\bmässige Föhn\b/g, "windstrke"],
  [/\bmässige Nordföhn\b/g, "windstrke"],
  [/\bmässige Südföhn\b/g, "windstrke"],
  [/\bschwachen Nordwind\b/g, "windstrke"],
  [/\bschwachen Nordostwind\b/g, "windstrke"],
  [/\bschwachen Ostwind\b/g, "windstrke"],
  [/\bschwachen Südostwind\b/g, "windstrke"],
  [/\bschwachen Südwind\b/g, "windstrke"],
  [/\bschwachen Südwestwind\b/g, "windstrke"],
  [/\bschwachen Westwind\b/g, "windstrke"],
  [/\bschwachen Nordwestwind\b/g, "windstrke"],
  [/\bschwachen Föhn\b/g, "windstrke"],
  [/\bschwachen Nordföhn\b/g, "windstrke"],
  [/\bschwachen Südföhn\b/g, "windstrke"],
  [/\bschwachem Nordwind\b/g, "windstrke"],
  [/\bschwachem Nordostwind\b/g, "windstrke"],
  [/\bschwachem Ostwind\b/g, "windstrke"],
  [/\bschwachem Südostwind\b/g, "windstrke"],
  [/\bschwachem Südwind\b/g, "windstrke"],
  [/\bschwachem Südwestwind\b/g, "windstrke"],
  [/\bschwachem Westwind\b/g, "windstrke"],
  [/\bschwachem Nordwestwind\b/g, "windstrke"],
  [/\bschwachem Föhn\b/g, "windstrke"],
  [/\bschwachem Nordföhn\b/g, "windstrke"],
  [/\bschwachem Südföhn\b/g, "windstrke"],
  [/\bstarke\b/g, "windstrke"],
  [/\bschwache Wind\b/g, "windstrke"],
  [/\bschwache Nordwind\b/g, "windstrke"],
  [/\bschwache Nordostwind\b/g, "windstrke"],
  [/\bschwache Ostwind\b/g, "windstrke"],
  [/\bschwache Südostwind\b/g, "windstrke"],
  [/\bschwache Südwind\b/g, "windstrke"],
  [/\bschwache Südwestwind\b/g, "windstrke"],
  [/\bschwache Westwind\b/g, "windstrke"],
  [/\bschwache Nordwestwind\b/g, "windstrke"],
  [/\bschwache Föhn\b/g, "windstrke"],
  [/\bschwache Nordföhn\b/g, "windstrke"],
  [/\bschwache Südföhn\b/g, "windstrke"],
  [/\bschwacher Wind\b/g, "windstrke"],
  [/\bschwacher Nordwind\b/g, "windstrke"],
  [/\bschwacher Nordostwind\b/g, "windstrke"],
  [/\bschwacher Ostwind\b/g, "windstrke"],
  [/\bschwacher Südostwind\b/g, "windstrke"],
  [/\bschwacher Südwind\b/g, "windstrke"],
  [/\bschwacher Südwestwind\b/g, "windstrke"],
  [/\bschwacher Westwind\b/g, "windstrke"],
  [/\bschwacher Nordwestwind\b/g, "windstrke"],
  [/\bschwacher Föhn\b/g, "windstrke"],
  [/\bschwacher Nordföhn\b/g, "windstrke"],
  [/\bschwacher Südföhn\b/g, "windstrke"],
  [/\bschwacher bis mässiger\b/g, "windstrke"],
  [/\bschwache bis mässige\b/g, "windstrke"],
  [/\bstarkem Wind\b/g, "windstrke"],
  [/\bstarkem Nordwind\b/g, "windstrke"],
  [/\bstarkem Nordostwind\b/g, "windstrke"],
  [/\bstarkem Ostwind\b/g, "windstrke"],
  [/\bstarkem Südostwind\b/g, "windstrke"],
  [/\bstarkem Südwind\b/g, "windstrke"],
  [/\bstarkem Südwestwind\b/g, "windstrke"],
  [/\bstarkem Westwind\b/g, "windstrke"],
  [/\bstarkem Nordwestwind\b/g, "windstrke"],
  [/\bstarkem Föhn\b/g, "windstrke"],
  [/\bstarkem Nordföhn\b/g, "windstrke"],
  [/\bstarkem Südföhn\b/g, "windstrke"],
  [/\bstarken Wind\b/g, "windstrke"],
  [/\bstarken Nordwind\b/g, "windstrke"],
  [/\bstarken Nordostwind\b/g, "windstrke"],
  [/\bstarken Ostwind\b/g, "windstrke"],
  [/\bstarken Südostwind\b/g, "windstrke"],
  [/\bstarken Südwind\b/g, "windstrke"],
  [/\bstarken Südwestwind\b/g, "windstrke"],
  [/\bstarken Westwind\b/g, "windstrke"],
  [/\bstarken Nordwestwind\b/g, "windstrke"],
  [/\bstarken Föhn\b/g, "windstrke"],
  [/\bstarken Nordföhn\b/g, "windstrke"],
  [/\bstarken Südföhn\b/g, "windstrke"],
  [/\bstarker Wind\b/g, "windstrke"],
  [/\bstarker Nordwind\b/g, "windstrke"],
  [/\bstarker Nordostwind\b/g, "windstrke"],
  [/\bstarker Ostwind\b/g, "windstrke"],
  [/\bstarker Südostwind\b/g, "windstrke"],
  [/\bstarker Südwind\b/g, "windstrke"],
  [/\bstarker Südwestwind\b/g, "windstrke"],
  [/\bstarker Westwind\b/g, "windstrke"],
  [/\bstarker Nordwestwind\b/g, "windstrke"],
  [/\bstarker Föhn\b/g, "windstrke"],
  [/\bstarker Nordföhn\b/g, "windstrke"],
  [/\bstarker Südföhn\b/g, "windstrke"],
  [/\bWumm- und Zischgeräusche\b/g, "wummgeruschsetzungsgerusch"],
  [/\bWummgeräusche\b/g, "wummgeruschsetzungsgerusch"],
  [/\bBelastung\b/g, "zusatzbelastung"],
  [/\bZusatzbelastung\b/g, "zusatzbelastung"],
  [/\bkleine Lawinen\b/g, "lawinengre"],
  [/\bkleine trockene\b/g, "lawinengre"],
  [/\bkleine feuchte\b/g, "lawinengre"],
  [/\bkleine nasse\b/g, "lawinengre"],
  [/\bkleine Schneebrettlawinen\b/g, "lawinengre"],
  [/\bkleine Lockerschneelawinen\b/g, "lawinengre"],
  [/\bkleine Grundlawinen\b/g, "lawinengre"],
  [/\bkleine Tallawinen\b/g, "lawinengre"],
  [/\bkleine Staublawinen\b/g, "lawinengre"],
  [/\bkleine spontane\b/g, "lawinengre"],
  [/\bkleine Rutsche\b/g, "lawinengre"],
  [/\bkleine Lockerschneerutsche\b/g, "lawinengre"],
  [/\bkleine Nass-\b/g, "lawinengre"],
  [/\bmittlere Lawinen\b/g, "lawinengre"],
  [/\bmittlere trockene\b/g, "lawinengre"],
  [/\bmittlere feuchte\b/g, "lawinengre"],
  [/\bmittlere nasse\b/g, "lawinengre"],
  [/\bmittlere Schneebrettlawinen\b/g, "lawinengre"],
  [/\bmittlere Lockerschneelawinen\b/g, "lawinengre"],
  [/\bmittlere Grundlawinen\b/g, "lawinengre"],
  [/\bmittlere Tallawinen\b/g, "lawinengre"],
  [/\bmittlere Staublawinen\b/g, "lawinengre"],
  [/\bmittlere spontane\b/g, "lawinengre"],
  [/\bmittlere Rutsche\b/g, "lawinengre"],
  [/\bmittlere Lockerschneerutsche\b/g, "lawinengre"],
  [/\bmittlere Nass-\b/g, "lawinengre"],
  [/\bmittelgroße Lawinen\b/g, "lawinengre"],
  [/\bmittelgroße trockene\b/g, "lawinengre"],
  [/\bmittelgroße feuchte\b/g, "lawinengre"],
  [/\bmittelgroße nasse\b/g, "lawinengre"],
  [/\bmittelgroße Schneebrettlawinen\b/g, "lawinengre"],
  [/\bmittelgroße Lockerschneelawinen\b/g, "lawinengre"],
  [/\bmittelgroße Grundlawinen\b/g, "lawinengre"],
  [/\bmittelgroße Tallawinen\b/g, "lawinengre"],
  [/\bmittelgroße Staublawinen\b/g, "lawinengre"],
  [/\bmittelgroße spontane\b/g, "lawinengre"],
  [/\bmittelgroße Rutsche\b/g, "lawinengre"],
  [/\bmittelgroße Lockerschneerutsche\b/g, "lawinengre"],
  [/\bmittelgroße Nass-\b/g, "lawinengre"],
  [/\bgrosse Lawinen\b/g, "lawinengre"],
  [/\bgrosse trockene\b/g, "lawinengre"],
  [/\bgrosse feuchte\b/g, "lawinengre"],
  [/\bgrosse nasse\b/g, "lawinengre"],
  [/\bgrosse Schneebrettlawinen\b/g, "lawinengre"],
  [/\bgrosse Lockerschneelawinen\b/g, "lawinengre"],
  [/\bgrosse Grundlawinen\b/g, "lawinengre"],
  [/\bgrosse Tallawinen\b/g, "lawinengre"],
  [/\bgrosse Staublawinen\b/g, "lawinengre"],
  [/\bgrosse spontane\b/g, "lawinengre"],
  [/\bgrosse Rutsche\b/g, "lawinengre"],
  [/\bgrosse Lockerschneerutsche\b/g, "lawinengre"],
  [/\bgrosse Nass-\b/g, "lawinengre"],
  [/\bkleinen Lawinen\b/g, "lawinengre"],
  [/\bkleinen trockenen\b/g, "lawinengre"],
  [/\bkleinen feuchten\b/g, "lawinengre"],
  [/\bkleinen nassen\b/g, "lawinengre"],
  [/\bkleinen Schneebrettlawinen\b/g, "lawinengre"],
  [/\bkleinen Lockerschneelawinen\b/g, "lawinengre"],
  [/\bkleinen Grundlawinen\b/g, "lawinengre"],
  [/\bkleinen Tallawinen\b/g, "lawinengre"],
  [/\bkleinen Staublawinen\b/g, "lawinengre"],
  [/\bkleinen spontanen\b/g, "lawinengre"],
  [/\bkleinen Rutschen\b/g, "lawinengre"],
  [/\bkleinen Lockerschneerutschen\b/g, "lawinengre"],
  [/\bkleinen Nass-\b/g, "lawinengre"],
  [/\bmittleren Lawinen\b/g, "lawinengre"],
  [/\bmittleren trockenen\b/g, "lawinengre"],
  [/\bmittleren feuchten\b/g, "lawinengre"],
  [/\bmittleren nassen\b/g, "lawinengre"],
  [/\bmittleren Schneebrettlawinen\b/g, "lawinengre"],
  [/\bmittleren Lockerschneelawinen\b/g, "lawinengre"],
  [/\bmittleren Grundlawinen\b/g, "lawinengre"],
  [/\bmittleren Tallawinen\b/g, "lawinengre"],
  [/\bmittleren Staublawinen\b/g, "lawinengre"],
  [/\bmittleren spontanen\b/g, "lawinengre"],
  [/\bmittleren Rutschen\b/g, "lawinengre"],
  [/\bmittleren Lockerschneerutschen\b/g, "lawinengre"],
  [/\bmittleren Nass-\b/g, "lawinengre"],
  [/\bmittelgroßen Lawinen\b/g, "lawinengre"],
  [/\bmittelgroßen trockenen\b/g, "lawinengre"],
  [/\bmittelgroßen feuchten\b/g, "lawinengre"],
  [/\bmittelgroßen nassen\b/g, "lawinengre"],
  [/\bmittelgroßen Schneebrettlawinen\b/g, "lawinengre"],
  [/\bmittelgroßen Lockerschneelawinen\b/g, "lawinengre"],
  [/\bmittelgroßen Grundlawinen\b/g, "lawinengre"],
  [/\bmittelgroßen Tallawinen\b/g, "lawinengre"],
  [/\bmittelgroßen Staublawinen\b/g, "lawinengre"],
  [/\bmittelgroßen spontanen\b/g, "lawinengre"],
  [/\bmittelgroßen Rutschen\b/g, "lawinengre"],
  [/\bmittelgroßen Lockerschneerutsche\b/g, "lawinengre"],
  [/\bmittelgroßen Nass-\b/g, "lawinengre"],
  [/\bgrossen Lawinen\b/g, "lawinengre"],
  [/\bgrossen trockenen\b/g, "lawinengre"],
  [/\bgrossen feuchten\b/g, "lawinengre"],
  [/\bgrossen nassen\b/g, "lawinengre"],
  [/\bgrossen Schneebrettlawinen\b/g, "lawinengre"],
  [/\bgrossen Lockerschneelawinen\b/g, "lawinengre"],
  [/\bgrossen Grundlawinen\b/g, "lawinengre"],
  [/\bgrossen Tallawinen\b/g, "lawinengre"],
  [/\bgrossen Staublawinen\b/g, "lawinengre"],
  [/\bgrossen spontanen\b/g, "lawinengre"],
  [/\bgrossen Rutschen\b/g, "lawinengre"],
  [/\bgrossen Lockerschneerutschen\b/g, "lawinengre"],
  [/\bgrossen Nass-\b/g, "lawinengre"],
  [/\bauch sehr grosse\b/g, "lawinengre"],
  [/\bgross werden\b/g, "lawinengre"],
  [/\bmittlere Grösse\b/g, "lawinengre"],
  [/\bextrem gross\b/g, "lawinengre"],
  [/\bmittelgross\b/g, "lawinengre"],
  [/\bnur kleine\b/g, "lawinengre"],
  [/\bextrem grosse\b/g, "lawinengre"],
  [/\bsehr gross\b/g, "lawinengre"]
];

/**
 * This component shows the detailed bulletin report including all icons and
 * texts.
 *
 * @typedef {object} Props
 * @prop {Albina.DaytimeBulletin} daytimeBulletin
 * @prop {*} date
 * @prop {*} intl
 *
 * @extends {React.Component<Props>}
 */
class BulletinReport extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * @returns {Caaml.Bulletin}
   */
  get bulletin() {
    return this.props.daytimeBulletin?.forenoon;
  }

  get dangerPatterns() {
    return this.bulletin.dangerPatterns || [];
  }

  getLocalizedText(elem) {
    // bulletins are loaded in correct language
    if (!elem) return "";
    elem = elem.replace(/&lt;br\/&gt;/g, "<br/>");
    elem = GLOSSARY_LINKS.reduce(
      (e, [re, glossary]) =>
        e.replace(
          re,
          `<a class="glossary" href="https://www.avalanches.org/glossary/?lang=de#${glossary}">$&</a>`
        ),
      elem
    );
    return preprocessContent(elem);
  }

  render() {
    const daytimeBulletin = this.props.daytimeBulletin;
    const bulletin = this.bulletin;
    if (!daytimeBulletin || !bulletin) {
      return <div />;
    }

    const maxWarnlevel = {
      id: daytimeBulletin.maxWarnlevel,
      number: getWarnlevelNumber(daytimeBulletin.maxWarnlevel)
    };
    const classes = "panel field callout warning-level-" + maxWarnlevel.number;

    return (
      <div>
        <section
          id={daytimeBulletin.id + "-main"}
          className="section-centered section-bulletin section-bulletin-report"
        >
          <div className={classes}>
            <header className="bulletin-report-header">
              <p className="bulletin-report-header-meta">
                <FormattedHTMLMessage
                  id="bulletin:report:headline"
                  values={{
                    date: dateToLongDateString(parseDate(this.props.date)),
                    daytime: ""
                  }}
                />
              </p>
              <h1 className="bulletin-report-header-danger-level">
                <FormattedHTMLMessage
                  id={
                    maxWarnlevel.number == 0
                      ? "bulletin:report:headline2:level0"
                      : "bulletin:report:headline2"
                  }
                  values={{
                    number: maxWarnlevel.number,
                    text: this.props.intl.formatMessage({
                      id: "danger-level:" + maxWarnlevel.id
                    })
                  }}
                />
              </h1>
            </header>
            {daytimeBulletin.hasDaytimeDependency ? (
              [
                <BulletinDaytimeReport
                  key={"am"}
                  bulletin={daytimeBulletin.forenoon}
                  date={this.props.date}
                  publicationTime={daytimeBulletin.forenoon.publicationTime}
                  ampm={"am"}
                />,
                <BulletinDaytimeReport
                  key={"pm"}
                  bulletin={daytimeBulletin.afternoon}
                  date={this.props.date}
                  publicationTime={daytimeBulletin.afternoon.publicationTime}
                  ampm={"pm"}
                />
              ]
            ) : (
              <BulletinDaytimeReport
                bulletin={daytimeBulletin.forenoon}
                date={this.props.date}
                publicationTime={daytimeBulletin.forenoon.publicationTime}
              />
            )}
            {bulletin.highlights && (
              <p className="bulletin-report-public-alert">
                <span className="icon-attention bulletin-report-public-alert-icon"></span>
                {bulletin.highlights}
              </p>
            )}
            <h2 className="subheader">
              {this.getLocalizedText(bulletin.avalancheActivityHighlights)}
            </h2>
            <p>{this.getLocalizedText(bulletin.avalancheActivityComment)}</p>
          </div>
        </section>
        {(bulletin.tendencyComment || bulletin.snowpackStructureComment) && (
          <section
            id={daytimeBulletin.id + "-bulletin-additional"}
            className="section-centered section-bulletin section-bulletin-additional"
          >
            <div className="panel brand">
              {(this.dangerPatterns.length > 0 ||
                bulletin.snowpackStructureComment) && (
                <div>
                  <h2 className="subheader">
                    <FormattedHTMLMessage id="bulletin:report:snowpack-structure:headline" />
                  </h2>
                  {this.dangerPatterns.length > 0 && (
                    <ul className="list-inline list-labels">
                      <li>
                        <span className="tiny heavy letterspace">
                          <FormattedHTMLMessage id="bulletin:report:danger-patterns" />
                        </span>
                      </li>
                      {this.dangerPatterns.map((dp, index) => (
                        <li key={index}>
                          <DangerPatternItem dangerPattern={dp} />
                        </li>
                      ))}
                    </ul>
                  )}
                  <p>
                    {this.getLocalizedText(bulletin.snowpackStructureComment)}
                  </p>
                </div>
              )}
              {bulletin.tendencyComment &&
                this.getLocalizedText(bulletin.tendencyComment) && (
                  <div>
                    <h2 className="subheader">
                      <FormattedHTMLMessage id="bulletin:report:tendency:headline" />
                    </h2>
                    <p>{this.getLocalizedText(bulletin.tendencyComment)}</p>
                  </div>
                )}
              {/*
            <p className="bulletin-author">
              <FormattedHTMLMessage id="bulletin:report:author" />
              :&nbsp;
              {bulletin.author &&
                bulletin.author.name && (
                  <span>{bulletin.author.name}</span>
                )}
            </p>
              */}
            </div>
          </section>
        )}
        <section
          id={daytimeBulletin.id + "-back-to-map"}
          className="section-centered section-bulletin section-bulletin-additional"
        >
          <div className="panel brand">
            <a
              href="#page-main"
              title={this.props.intl.formatMessage({
                id: "bulletin:linkbar:back-to-map:hover"
              })}
              className="icon-link icon-arrow-up tooltip"
              data-scroll=""
            >
              <FormattedHTMLMessage id="bulletin:linkbar:back-to-map" />
            </a>
          </div>
        </section>
      </div>
    );
  }
}

export default injectIntl(observer(BulletinReport));
