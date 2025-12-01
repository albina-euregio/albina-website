import React from "react";
import { useIntl } from "../../i18n";
import { useStore } from "@nanostores/react";
import { $province } from "../../appStore";

function BulletinFooter() {
  const intl = useIntl();
  const province = useStore($province);
  const weatherRegions = province
    ? [province]
    : (config.regionCodes as (typeof province)[]);

  return (
    <section className="section-centered section-context">
      <div className="panel">
        <h2 className="subheader">
          {intl.formatMessage({ id: "button:weather:headline" })}
        </h2>

        <ul className="list-inline list-buttongroup-dense">
          {weatherRegions.map(region => (
            <li>
              <a
                key={region}
                className="secondary pure-button"
                href={intl.formatMessage({
                  id: `button:weather:${region}:link`
                })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage({
                  id: `region:${region}`
                })}
              </a>
            </li>
          ))}
        </ul>

        <h2 className="subheader">
          {intl.formatMessage({ id: "button:blog:headline" })}
        </h2>

        <ul className="list-inline list-buttongroup-dense">
          <li>
            <a className="secondary pure-button" href={"/blog?region=AT-07"}>
              {intl.formatMessage({
                id: "region:AT-07"
              })}
            </a>
          </li>
          <li>
            <a className="secondary pure-button" href={"/blog?region=IT-32-BZ"}>
              {intl.formatMessage({
                id: "region:IT-32-BZ"
              })}
            </a>
          </li>
          <li>
            <a className="secondary pure-button" href={"/blog?region=IT-32-TN"}>
              {intl.formatMessage({
                id: "region:IT-32-TN"
              })}
            </a>
          </li>
        </ul>

        <h2 className="subheader">
          {intl.formatMessage({ id: "button:snow:headline" })}
        </h2>

        <ul className="list-inline list-buttongroup-dense">
          <li>
            <a className="secondary pure-button" href="/weather/map/new-snow">
              {intl.formatMessage({ id: "button:snow:hn:text" })}
            </a>
          </li>
          <li>
            <a
              className="secondary pure-button"
              href="/weather/map/snow-height"
            >
              {intl.formatMessage({ id: "button:snow:hs:text" })}
            </a>
          </li>
          <li>
            <a className="secondary pure-button" href="/weather/map/wind">
              {intl.formatMessage({ id: "button:snow:ff:text" })}
            </a>
          </li>
          <li>
            <a className="secondary pure-button" href="/weather/stations">
              {intl.formatMessage({
                id: "button:stations:stations:text"
              })}
            </a>
          </li>
        </ul>

        <h2 className="subheader">
          {intl.formatMessage({
            id: "button:education:headline"
          })}
        </h2>

        <ul className="list-inline list-buttongroup-dense">
          <li>
            <a className="secondary pure-button" href="/education/danger-scale">
              {intl.formatMessage({
                id: "button:education:danger-scale:text"
              })}
            </a>
          </li>
          <li>
            <a
              className="secondary pure-button"
              href="/education/avalanche-problems"
            >
              {intl.formatMessage({
                id: "button:education:avalanche-problems:text"
              })}
            </a>
          </li>
          <li>
            <a className="secondary pure-button" href="/education/matrix">
              {intl.formatMessage({
                id: "button:education:eaws-matrix:text"
              })}
            </a>
          </li>
          <li>
            <a
              className="secondary pure-button"
              href="/education/avalanche-problems"
            >
              {intl.formatMessage({
                id: "button:education:avalanche-sizes:text"
              })}
            </a>
          </li>
          <li>
            <a
              className="secondary pure-button"
              href="/education/danger-patterns"
            >
              {intl.formatMessage({
                id: "button:education:danger-patterns:text"
              })}
            </a>
          </li>
          <li>
            <a className="secondary pure-button" href="/education/handbook">
              {intl.formatMessage({
                id: "button:education:handbook:text"
              })}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default BulletinFooter;
