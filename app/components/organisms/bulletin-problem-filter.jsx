import React from 'react';
import { observer } from 'mobx-react';

@observer
class BulletinProblemFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p><strong>Hide regions</strong> with special <a href="#" className="tooltip" title="Learn more"><strong>Avalanche Situation</strong></a></p>
        <ul className="list-inline list-avalanche-problems-filter">
          <li>
            <a href="#" title="Show regions with New Snow" className="img js-deactivated tooltip">
              <img src="../../images/pro/avalanche-situations/new_snow.png" alt="New Snow" />
              <img src="../../images/pro/avalanche-situations/new_snow_grey.png" alt="New Snow" />
            </a>
          </li>
          <li>
            <a href="#" title="Hide regions with Drifting Snow" className="img tooltip">
              <img src="../../images/pro/avalanche-situations/drifting_snow.png" alt="Drifting Snow" />
              <img src="../../images/pro/avalanche-situations/drifting_snow_grey.png" alt="Drifting Snow" />
            </a>
          </li>
          <li>
            <a href="#" title="Hide regions with Old Snow" className="img tooltip">
              <img src="../../images/pro/avalanche-situations/old_snow.png" alt="Old Snow" />
              <img src="../../images/pro/avalanche-situations/old_snow_grey.png" alt="Old Snow" />
            </a>
          </li>
          <li>
            <a href="#" title="Hide regions with Wet Snow" className="img tooltip">
              <img src="../../images/pro/avalanche-situations/wet_snow.png" alt="Wet Snow" />
              <img src="../../images/pro/avalanche-situations/wet_snow_grey.png" alt="Wet Snow" />
            </a>
          </li>
          <li>
            <a href="#" title="Hide regions with Gliding Snow" className="img tooltip">
              <img src="../../images/pro/avalanche-situations/gliding_snow.png" alt="Gliding Snow" />
              <img src="../../images/pro/avalanche-situations/gliding_snow_grey.png" alt="Gliding Snow" />
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default BulletinProblemFilter;
