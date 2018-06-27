import React from 'react';

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
        <p className="info">Month</p>
        <select className="dropdown">
          <option value="">All</option>
          {
            this.months.map((m) => <option key={m.index} value={m.index}>{m.name}</option>)
          }
        </select>
      </div>
    );
  }
}
