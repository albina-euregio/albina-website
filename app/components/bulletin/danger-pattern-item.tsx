import React, { useContext } from "react";
import { FormattedMessage } from "../../i18n";
import { Link } from "react-router-dom";
import type * as Caaml from "../../stores/bulletin";
import { HeadlessContext } from "../../contexts/HeadlessContext.tsx";

interface Props {
  dangerPattern: Caaml.DangerPattern;
  isInserted: boolean;
}

function DangerPatternItem({ dangerPattern, isInserted }: Props) {
  const headless = useContext(HeadlessContext);

  return (
    <Link
      to={`${headless ? "/headless" : ""}/education/danger-patterns#${dangerPattern.toLowerCase()}`}
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
    </Link>
  );
}
export default DangerPatternItem;
