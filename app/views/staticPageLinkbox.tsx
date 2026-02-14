import React from "react";
import { useIntl } from "../i18n/index.tsx";
import PageHeadline from "../components/organisms/page-headline.tsx";
import SmShare from "../components/organisms/sm-share.tsx";
import HTMLHeader from "../components/organisms/html-header.tsx";
import { setLanguage } from "../appStore.ts";
import { useStore } from "@nanostores/react";
import { $router } from "../components/router.ts";

const Education = () => {
  const intl = useIntl();
  const router = useStore($router);

  if (["de", "en"].includes(router?.search?.language || "")) {
    setLanguage(router?.search?.language);
  }

  const menu = config.menu.find(item => item.url === router?.path);
  const indexKey = menu.indexKey as "education:overview" | "more";

  return (
    <>
      <HTMLHeader
        title={intl.formatMessage({
          id: `${indexKey}:title`
        })}
      />
      <PageHeadline
        title={intl.formatMessage({
          id: `${indexKey}:headline`
        })}
      />
      <section className="section section-features">
        <ul className="list-plain features">
          {menu?.children?.map((item, index) => {
            if (!item.url || !item.img) return <></>;
            const key = item.indexKey
              ? item.indexKey
              : `${indexKey}:${item.url.replace(/.*[/]/g, "")}`;
            return (
              <li className="feature-item" key={item.url + index}>
                <a href={item.url} className="linkbox linkbox-feature">
                  <div className="content-image">
                    <img
                      src={item.img}
                      title={intl.formatMessage({
                        id: `${key}:headline`
                      })}
                      alt={intl.formatMessage({
                        id: `${key}:text`
                      })}
                      className=""
                    />
                  </div>
                  <div className="content-text">
                    <p className="h1 subheader">
                      {intl.formatMessage({
                        id: `${key}:headline`
                      })}
                    </p>
                    <p>
                      {intl.formatMessage({
                        id: `${key}:text`
                      })}
                    </p>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
      <SmShare />
    </>
  );
};

export default Education;
