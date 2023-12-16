import React from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";

export default function HTMLHeader(props) {
  const intl = useIntl();
  useEffect(() => {
    document.title = [
      props.title,
      intl.formatMessage({ id: "app:title" })
    ].join(" | ");
  });
  return <></>;
}
