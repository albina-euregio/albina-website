import React from "react";
import { injectIntl } from "react-intl";

class BulletinFooter extends React.Component {
  render() {
    return (
      <section className="section-centered section-context">
        <div className="panel">
          <h2 className="subheader">
            {this.props.intl.formatMessage({ id: "button:weather:headline" })}
          </h2>

          <ul className="list-inline list-buttongroup-dense">
            <li>
              <a
                className="secondary pure-button"
                href={this.props.intl.formatMessage({
                  id: "button:weather:AT-07:link"
                })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {this.props.intl.formatMessage({
                  id: "region:AT-07"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href={this.props.intl.formatMessage({
                  id: "button:weather:IT-32-BZ:link"
                })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {this.props.intl.formatMessage({
                  id: "region:IT-32-BZ"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href={this.props.intl.formatMessage({
                  id: "button:weather:IT-32-TN:link"
                })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {this.props.intl.formatMessage({
                  id: "region:IT-32-TN"
                })}
              </a>
            </li>
          </ul>

          <h2 className="subheader">
            {this.props.intl.formatMessage({ id: "button:blog:headline" })}
          </h2>

          <ul className="list-inline list-buttongroup-dense">
            <li>
              <a className="secondary pure-button" href={"/blog?region=AT-07"}>
                {this.props.intl.formatMessage({
                  id: "region:AT-07"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href={"/blog?region=IT-32-BZ"}
              >
                {this.props.intl.formatMessage({
                  id: "region:IT-32-BZ"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href={"/blog?region=IT-32-TN"}
              >
                {this.props.intl.formatMessage({
                  id: "region:IT-32-TN"
                })}
              </a>
            </li>
          </ul>

          <h2 className="subheader">
            {this.props.intl.formatMessage({ id: "button:snow:headline" })}
          </h2>

          <ul className="list-inline list-buttongroup-dense">
            <li>
              <a className="secondary pure-button" href="/weather/map/new-snow">
                {this.props.intl.formatMessage({ id: "button:snow:hn:text" })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href="/weather/map/snow-height"
              >
                {this.props.intl.formatMessage({ id: "button:snow:hs:text" })}
              </a>
            </li>
            <li>
              <a className="secondary pure-button" href="/weather/map/wind">
                {this.props.intl.formatMessage({ id: "button:snow:ff:text" })}
              </a>
            </li>
            <li>
              <a className="secondary pure-button" href="/weather/stations">
                {this.props.intl.formatMessage({
                  id: "button:snow:stations:text"
                })}
              </a>
            </li>
          </ul>

          <h2 className="subheader">
            {this.props.intl.formatMessage({
              id: "button:education:headline"
            })}
          </h2>

          <ul className="list-inline list-buttongroup-dense">
            <li>
              <a
                className="secondary pure-button"
                href="/education/danger-scale"
              >
                {this.props.intl.formatMessage({
                  id: "button:education:danger-scale:text"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href="/education/avalanche-problems"
              >
                {this.props.intl.formatMessage({
                  id: "button:education:avalanche-problems:text"
                })}
              </a>
            </li>
            <li>
              <a
                className="secondary pure-button"
                href="/education/danger-patterns"
              >
                {this.props.intl.formatMessage({
                  id: "button:education:danger-patterns:text"
                })}
              </a>
            </li>
            <li>
              <a className="secondary pure-button" href="/education/handbook">
                {this.props.intl.formatMessage({
                  id: "button:education:handbook:text"
                })}
              </a>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}

export default injectIntl(BulletinFooter);
