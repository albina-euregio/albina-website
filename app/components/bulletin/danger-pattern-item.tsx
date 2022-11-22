import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import type * as Caaml from "../../stores/bulletin";

type Props = { dangerPattern: Caaml.DangerPattern };

function DangerPatternItem({ dangerPattern }: Props) {
  const intl = useIntl();
  return (
    <Link
      to={"/education/danger-patterns#" + dangerPattern.id.toLowerCase()}
      className="label"
    >
      {intl.formatMessage({
        id: "danger-patterns:" + dangerPattern.id.toLowerCase()
      })}
    </Link>
  );
}
export default DangerPatternItem;
