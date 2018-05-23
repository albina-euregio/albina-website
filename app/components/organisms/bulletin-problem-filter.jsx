import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

@observer
class BulletinProblemFilter extends React.Component {
  imgRoot;
  problems;

  constructor(props) {
    super(props);

    // FIXME: should go to config.ini
    imgRoot = '../../images/pro/avalanche-situations/';

    // FIXME: should be imported by config.ini or CMS
    problems = {
      "new_snow": {
        text: {en: "New Snow"},
        img: {color: "new_snow.png", grey: "new_snow_grey.png"}
      },
      "wind_drifted_snow": {
        text: {en: "Drifting Snow"},
        img: {color: "drifting_snow.png", grey: "drifting_snow_grey.png"}
      },
      "old_snow": {
        text: {en: "Old snow"},
        img: {color: "old_snow.png", grey: "old_snow_grey.png"}
      },
      "wet_snow": {
        text: {en: "Wet snow"},
        img: {color: "wet_snow.png", grey: "wet_snow_grey.png"}
      },
      "gliding_snow": {
        text: {en: "Gliding snow"},
        img: {color: "gliding_snow", grey: "gliding_snow_grey.png"}
      } /* ,
      "favourable_situation": {} */
    }
  }

  @computed
  renderItem(problemId) {
    const set = true;
    const problemText = this.problems[problemId].text;
    const title = (set ? 'Hide' : 'Show') + ' regions with ' + problemText;
    const classes = 'img tooltip' + (set ? '' : ' js-deactivated');
    const imgColor = this.imgRoot + this.problems[problemId].img.color;
    const imgGrey = this.imgRoot + this.problems[problemId].img.grey;

    return (
      <li>
        <a href="#" title={title} className={classes}>
          <img src={imgColor} alt={problemText} />
          <img src={imgGrey} alt={problemText} />
        </a>
      </li>
    );
  }

  render() {
    return (
      <div>
        <p><strong>Hide regions</strong> with special <a href="#" className="tooltip" title="Learn more"><strong>Avalanche Situation</strong></a></p>
        <ul className="list-inline list-avalanche-problems-filter">
          {
            this.problems.
          }
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
