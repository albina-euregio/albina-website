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
    try {
      findGlossaryStrings(text, locale).then(g => setWithGlossary(g));
    } catch (e) {
      console.warn(e);
    }
  }, [locale, text]);
  return <>{withGlossary}</>;
}
