import React, { ReactNode, useEffect, useState } from "react";
import { EnabledLanguages, findGlossaryStrings } from "./internal-glossary";

export default function BulletinInternalGlossaryText({
  text,
  locale,
  textKey,
  glossaryParams
}: {
  text: string;
  locale: EnabledLanguages;
  textKey: string;
  glossaryParams?: Record<string, string>;
}) {
  const [withGlossary, setWithGlossary] = useState<string | ReactNode[]>(text);
  useEffect(() => {
    try {
      findGlossaryStrings(text, locale, textKey, glossaryParams).then(g => setWithGlossary(g));
    } catch (e) {
      console.warn(e);
    }
  }, [locale, textKey, text, glossaryParams]);
  return <>{withGlossary}</>;
}
