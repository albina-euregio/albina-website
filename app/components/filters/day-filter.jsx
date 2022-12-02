import React, { useMemo } from "react";
import Selectric from "../selectric";
import { getDaysOfMonth } from "../../util/date";

export default function DayFilter(props) {
  const days = useMemo(() => {
    const days = [];
    const maxDay = getDaysOfMonth(this.props.year, this.props.month);
    for (let i = 1; i <= maxDay; i++) {
      days.push(i);
    }

    return days;
  }, []);
  return (
    <div>
      {props.title && <p className="info">{props.title}</p>}
      <Selectric onChange={props.handleChange} {...props}>
        {props.all && <option value="">{props.all}</option>}
        {days.map(d => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </Selectric>
    </div>
  );
}
