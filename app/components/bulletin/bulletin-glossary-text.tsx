import React, { ReactNode, useEffect, useState } from "react";
import { EnabledLanguages, findGlossaryStrings } from "./bulletin-glossary";

export default function BulletinGlossaryText({
  text,
  locale
}: {
  text: string;
  locale: EnabledLanguages;
}) {
  const [withGlossary, setWithGlossary] = useState<string | ReactNode[]>(text);
  useEffect(() => {
    findGlossaryStrings(text, locale).then(g => setWithGlossary(g));
  }, [locale, text]);
  try {
    return <>{withGlossary}</>;
  } catch (e) {
    console.warn(e);
    return <>{text}</>;
  }
}
