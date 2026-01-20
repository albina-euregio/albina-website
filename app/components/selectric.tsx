import React from "react";

interface Props {
  onChange: (value: string) => void;
  value: string;
  disabled: boolean;
  title: string;
  children: React.ReactNode;
}

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
