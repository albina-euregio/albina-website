import React from "react";
import { useIntl } from "../../i18n"; // Import useIntl for formatMessage
import { FormattedMessage } from "../../i18n";
import type * as Caaml from "../../stores/bulletin";
import BulletinInternalGlossaryText from "./internal-glossary-text";
import { EnabledLanguages } from "./internal-glossary";
import {
  internalGlossaryEnum,
  getContentIdentifier
} from "./InternalGlossary/internal-glossary-lookupId";

interface Props {
  dangerPattern: Caaml.DangerPattern;
  isInserted: boolean;
}

function DangerPatternItem({ dangerPattern, isInserted }: Props) {
  const intl = useIntl(); // Get the intl object for formatting messages

  const dangerPatternText = intl.formatMessage({
    id: `danger-patterns:${dangerPattern.toLowerCase()}`
  });
  return (
    <a
      href={`/education/danger-patterns#${dangerPattern.toLowerCase()}`}
      className="label"
    >
      {isInserted ? (
        <ins
        // style={{ color: "#28a745" }}
        >
          <BulletinInternalGlossaryText
            text={dangerPatternText}
            locale={intl.locale.slice(0, 2) as EnabledLanguages}
            textKey={getContentIdentifier(internalGlossaryEnum.dangerPattern, dangerPattern)}
          />
        </ins>
      ) : (
        <BulletinInternalGlossaryText
          text={dangerPatternText}
          locale={intl.locale.slice(0, 2) as EnabledLanguages}
          textKey={getContentIdentifier(internalGlossaryEnum.dangerPattern, dangerPattern)}
        />
      )}
    </a>
  );
}

export default DangerPatternItem;
