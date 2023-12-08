import React from "react";
import { preprocessContent } from "../../util/htmlParser";
import { EnabledLanguages, findGlossaryStrings } from "./bulletin-glossary";

export default function BulletinGlossaryText({
  text,
  locale
}: {
  text: string;
  locale: EnabledLanguages;
}) {
  try {
    const withGlossary = findGlossaryStrings(text, locale);
    return <>{preprocessContent(withGlossary)}</>;
  } catch (e) {
    console.warn(e, { text });
    return <></>;
  }
}
