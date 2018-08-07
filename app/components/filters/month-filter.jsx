import React from 'react';
import Selectric from '../selectric';

export default class MonthFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  get months() {
    const getMonthName = (idx) => {
      var d = new Date();
      d.setMonth(idx - 1);
      return Intl.DateTimeFormat(window.appStore.language, {month: 'long'}).format(d);
    };

    const months = [];
    for(var i = 1; i <= 12; i++) {
      months.push({index: i, name: getMonthName(i)});
    }
    return months;
  }

  render() {
    return (
      <div>
        {
          this.props.title &&
          <p className="info">{this.props.title}</p>
        }
        <Selectric onChange={this.props.handleChange} value={this.props.value}>
          { this.props.all &&
            <option value="">{this.props.all}</option>
          }
          {
            this.months.map((m) => <option key={m.index} value={m.index}>{m.name}</option>)
          }
        </Selectric>
      </div>
    );
  }
}
