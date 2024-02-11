import React from "react";

type Props = {
  onChange: (value: string) => void;
  value: string;
  disabled: boolean;
  title: string;
  children: React.ReactNode;
};

/**
 * Component to be used for selectric select boxes.
 * Implementation is inspired by
 * https://reactjs.org/docs/integrating-with-other-libraries.html#integrating-with-jquery-chosen-plugin
 */
export default function Selectric(props: Props) {
  return (
    <select
      className="dropdown selectric"
      onChange={e => props.onChange(e.target.value)}
      value={props.value}
      disabled={props.disabled}
      title={props.title}
    >
      {props.children}
    </select>
  );
}
