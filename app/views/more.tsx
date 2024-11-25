import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useIntl } from "../i18n";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { Tooltip } from "../components/tooltips/tooltip";
import { useSearchParams } from "react-router-dom";

const More = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();

  if (["de", "en"].includes(searchParams.get("language") || "")) {
    setLanguage(searchParams.get("language"));
  }

  return (
    <>
      <HTMLHeader title={intl.formatMessage({ id: "more:title" })} />
      <PageHeadline title={intl.formatMessage({ id: "more:headline" })} />
      <section className="section section-features">
        <ul className="list-plain features">
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:archive:headline"
              })}
            >
              <Link to="/more/archive" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_archive.jpg"
                    title={intl.formatMessage({
                      id: "more:archive:image:title"
                    })}
                    alt={intl.formatMessage({
                      id: "more:archive:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {intl.formatMessage({
                      id: "more:archive:headline"
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      id: "more:archive:text"
                    })}
                  </p>
                </div>
              </Link>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:about:headline"
              })}
            >
              <Link to="/more/about" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_about.jpg"
                    alt={intl.formatMessage({
                      id: "more:about:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {intl.formatMessage({
                      id: "more:about:headline"
                    })}
                  </p>
                  <p>{intl.formatMessage({ id: "more:about:text" })}</p>
                </div>
              </Link>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:contact:headline"
              })}
            >
              <Link to="/more/contact" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_contact.jpg"
                    title={intl.formatMessage({
                      id: "more:contact:image:title"
                    })}
                    alt={intl.formatMessage({
                      id: "more:contact:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {intl.formatMessage({
                      id: "more:contact:headline"
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      id: "more:contact:text"
                    })}
                  </p>
                </div>
              </Link>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:imprint:headline"
              })}
            >
              <Link to="/more/imprint" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_imprint.jpg"
                    title={intl.formatMessage({
                      id: "more:imprint:image:title"
                    })}
                    alt={intl.formatMessage({
                      id: "more:imprint:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {intl.formatMessage({
                      id: "more:imprint:headline"
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      id: "more:imprint:text"
                    })}
                  </p>
                </div>
              </Link>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:privacy:headline"
              })}
            >
              <Link to="/more/privacy" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_privacy.jpg"
                    title={intl.formatMessage({
                      id: "more:privacy:image:title"
                    })}
                    alt={intl.formatMessage({
                      id: "more:privacy:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {intl.formatMessage({
                      id: "more:privacy:headline"
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      id: "more:privacy:text"
                    })}
                  </p>
                </div>
              </Link>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:accessibility:headline"
              })}
            >
              <Link
                to="/more/accessibility"
                className="linkbox linkbox-feature "
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_accessibility.jpg"
                    title={intl.formatMessage({
                      id: "more:accessibility:image:title"
                    })}
                    alt={intl.formatMessage({
                      id: "more:accessibility:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {intl.formatMessage({
                      id: "more:accessibility:headline"
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      id: "more:accessibility:text"
                    })}
                  </p>
                </div>
              </Link>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:open-data:headline"
              })}
            >
              <Link to="/more/open-data" className="linkbox linkbox-feature ">
                <div className="content-image">
                  <img
                    src="/content_files/feature_open_data.jpg"
                    title={intl.formatMessage({
                      id: "more:open-data:image:title"
                    })}
                    alt={intl.formatMessage({
                      id: "more:open-data:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {intl.formatMessage({
                      id: "more:open-data:headline"
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      id: "more:open-data:text"
                    })}
                  </p>
                </div>
              </Link>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:season-reports:headline"
              })}
            >
              <Link
                to="/more/season-reports"
                className="linkbox linkbox-feature "
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_season_reports.jpg"
                    title={intl.formatMessage({
                      id: "more:season-reports:image:title"
                    })}
                    alt={intl.formatMessage({
                      id: "more:season-reports:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {intl.formatMessage({
                      id: "more:season-reports:headline"
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      id: "more:season-reports:text"
                    })}
                  </p>
                </div>
              </Link>
            </Tooltip>
          </li>
        </ul>
      </section>
      <SmShare />
    </>
  );
};

export default More;
