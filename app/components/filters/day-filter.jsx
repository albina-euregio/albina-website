import React from 'react';
import Selectric from '../selectric';
import { getDaysOfMonth } from '../../util/date';

export default class DayFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  get days() {
    const days = [];
    const maxDay = getDaysOfMonth(this.props.year, this.props.month);
    for(let i = 1; i <= maxDay; i++) {
      days.push(i);
    }

    return days;
  }

  render() {
    return (
      <div>
        { this.props.title &&
          <p className="info">{this.props.title}</p>
        }
        <Selectric onChange={this.props.handleChange} {...this.props}>
          { this.props.all &&
            <option value="">{this.props.all}</option>
          }
          {
            this.days.map((d) => <option key={d} value={d}>{d}</option>)
          }
        </Selectric>
      </div>
    );
  }
}
