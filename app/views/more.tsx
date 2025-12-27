import React from "react";
import { useIntl } from "../i18n";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { Tooltip } from "../components/tooltips/tooltip";
import { setLanguage } from "../appStore";
import { useStore } from "@nanostores/react";
import { $router } from "../components/router";

const More = () => {
  const intl = useIntl();
  const router = useStore($router);

  if (["de", "en"].includes(router?.search?.language || "")) {
    setLanguage(router?.search?.language as "de" | "en");
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
              <a href="/more/archive" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_archive.webp"
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
              </a>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:about:headline"
              })}
            >
              <a href="/more/about" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_about.webp"
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
              </a>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:contact:headline"
              })}
            >
              <a href="/more/contact" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_contact.webp"
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
              </a>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:imprint:headline"
              })}
            >
              <a href="/more/imprint" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_imprint.webp"
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
              </a>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:privacy:headline"
              })}
            >
              <a href="/more/privacy" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_privacy.webp"
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
              </a>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:accessibility:headline"
              })}
            >
              <a
                href="/more/accessibility"
                className="linkbox linkbox-feature "
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_accessibility.webp"
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
              </a>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:open-data:headline"
              })}
            >
              <a href="/more/open-data" className="linkbox linkbox-feature ">
                <div className="content-image">
                  <img
                    src="/content_files/feature_open_data.webp"
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
              </a>
            </Tooltip>
          </li>
          <li className="feature-item">
            <Tooltip
              label={intl.formatMessage({
                id: "more:season-reports:headline"
              })}
            >
              <a
                href="/more/season-reports"
                className="linkbox linkbox-feature "
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_season_reports.webp"
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
              </a>
            </Tooltip>
          </li>
        </ul>
      </section>
      <SmShare />
    </>
  );
};

export default More;
