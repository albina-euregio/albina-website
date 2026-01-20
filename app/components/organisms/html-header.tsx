import React from "react";
import { useIntl } from "../../i18n";
import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $province } from "../../appStore";

interface Props {
  title: string;
}

export default function HTMLHeader(props: Props) {
  const intl = useIntl();
  const province = useStore($province);
  useEffect(() => {
    document.title = [
      props.title,
      intl.formatMessage({ id: `app:title:${province}` }) ||
        intl.formatMessage({ id: "app:title" })
    ].join(" | ");
  });
  return <></>;
}
