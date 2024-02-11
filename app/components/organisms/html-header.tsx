import React from "react";
import { useIntl } from "../../i18n";
import { useEffect } from "react";

type Props = {
  title: string;
};

export default function HTMLHeader(props: Props) {
  const intl = useIntl();
  useEffect(() => {
    document.title = [
      props.title,
      intl.formatMessage({ id: "app:title" })
    ].join(" | ");
  });
  return <></>;
}
