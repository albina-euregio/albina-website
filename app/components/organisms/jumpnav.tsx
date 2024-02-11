import React from "react";
import { useIntl } from "../../i18n";

export default function Jumpnav() {
  const intl = useIntl();
  const entries = [
    {
      id: "page-main",
      title: intl.formatMessage({ id: "jumpnav:content" })
    },
    {
      id: "navigation",
      title: intl.formatMessage({ id: "jumpnav:navigation" })
    },
    {
      id: "page-footer",
      title: intl.formatMessage({ id: "jumpnav:footer" })
    }
  ];
  return (
    <div className="jumpnav">
      {entries.map(e => (
        <a key={e.id} href={"#" + e.id} title={e.title}>
          {e.title}
        </a>
      ))}
    </div>
  );
}
