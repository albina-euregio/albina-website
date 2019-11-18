import React from "react";
import Selectric from "../selectric";
import { dateToMonthString } from "../../util/date";

export default class MonthFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  get months() {
    const getMonthName = idx => {
      const now = new Date();
      const d = new Date(now.getFullYear(), idx - 1, 1); // get first of month,
      return dateToMonthString(d);
    };

    const months = [];
    for (var i = 1; i <= 12; i++) {
      months.push({ index: i, name: getMonthName(i) });
    }
    return months;
  }

  render() {
    return (
      <div>
        {this.props.title && <p className="info">{this.props.title}</p>}
        <Selectric onChange={this.props.handleChange} {...this.props}>
          {this.props.all && <option value="">{this.props.all}</option>}
          {this.months.map(m => (
            <option key={m.index} value={m.index}>
              {m.name}
            </option>
          ))}
        </Selectric>
      </div>
    );
  }
}
