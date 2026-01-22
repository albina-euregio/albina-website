import React from "react";
import { FormattedMessage } from "../../i18n";
import type * as Caaml from "../../stores/bulletin";

interface Props {
  dangerPattern: Caaml.DangerPattern;
  isInserted: boolean;
}

function DangerPatternItem({ dangerPattern, isInserted }: Props) {
  return (
    <a
      href={`/education/danger-patterns#${dangerPattern.toLowerCase()}`}
      className="label"
    >
      {isInserted ? (
        <ins
        // style={{ color: "#28a745" }}
        >
          <FormattedMessage
            id={`danger-patterns:${dangerPattern.toLowerCase()}`}
          />
        </ins>
      ) : (
        <FormattedMessage
          id={`danger-patterns:${dangerPattern.toLowerCase()}`}
        />
      )}
    </a>
  );
}
export default DangerPatternItem;
