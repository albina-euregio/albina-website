import React from "react";
import { useIntl } from "../i18n";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { Link } from "wouter";

const Education = () => {
  const intl = useIntl();
  return (
    <>
      <HTMLHeader
        title={intl.formatMessage({
          id: "education:overview:title"
        })}
      />
      <PageHeadline
        title={intl.formatMessage({
          id: "education:overview:headline"
        })}
      />
      <section className="section section-features">
        <ul className="list-plain features">
          <li className="feature-item">
            <Link
              to="/education/danger-scale"
              className="linkbox linkbox-feature"
            >
              <div className="content-image">
                <img
                  src="/content_files/feature_danger-scale.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:danger-scale:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:danger-scale:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:danger-scale:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:danger-scale:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link
              to="/education/avalanche-problems"
              className="linkbox linkbox-feature"
            >
              <div className="content-image">
                <img
                  src="/content_files/feature_avalanche-problem.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:avalanche-problems:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:avalanche-problems:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:avalanche-problems:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:avalanche-problems:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link to="/education/workflow" className="linkbox linkbox-feature">
              <div className="content-image">
                <img
                  src="/content_files/feature_workflow.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:workflow:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:workflow:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:workflow:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:workflow:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link to="/education/matrix" className="linkbox linkbox-feature">
              <div className="content-image">
                <img
                  src="/content_files/feature_matrix.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:eaws-matrix:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:eaws-matrix:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:eaws-matrix:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:eaws-matrix:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link
              to="/education/snowpack-stability"
              className="linkbox linkbox-feature"
            >
              <div className="content-image">
                <img
                  src="/content_files/feature_snowpack-stability.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:snowpack-stability:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:snowpack-stability:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:snowpack-stability:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:snowpack-stability:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link to="/education/frequency" className="linkbox linkbox-feature">
              <div className="content-image">
                <img
                  src="/content_files/feature_frequency.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:frequency:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:frequency:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:frequency:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:frequency:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link
              to="/education/avalanche-sizes"
              className="linkbox linkbox-feature"
            >
              <div className="content-image">
                <img
                  src="/content_files/feature_avalanche-size.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:avalanche-sizes:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:avalanche-sizes:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:avalanche-sizes:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:avalanche-sizes:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link
              to="/education/spatio-temporal-scale"
              className="linkbox linkbox-feature"
            >
              <div className="content-image">
                <img
                  src="/content_files/feature_spatio-temporal-scale.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:spatio-temporal-scale:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:spatio-temporal-scale:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:spatio-temporal-scale:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:spatio-temporal-scale:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link
              to="/education/danger-patterns"
              className="linkbox linkbox-feature"
            >
              <div className="content-image">
                <img
                  src="/content_files/feature_danger-pattern.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:danger-patterns:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:danger-patterns:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:danger-patterns:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:danger-patterns:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link to="/education/community" className="linkbox linkbox-feature">
              <div className="content-image">
                <img
                  src="/content_files/feature_community.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:community:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:community:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:community:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:community:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            {/* glossary is an external link to www.avalanches.org/glossary/ */}
            <a
              href={intl.formatMessage({
                id: "education:overview:glossary:link"
              })}
              rel="noopener noreferrer"
              target="_blank"
              className="linkbox linkbox-feature"
            >
              <div className="content-image">
                <img
                  src="/content_files/feature_glossary.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:glossary:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:glossary:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:glossary:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:glossary:text"
                  })}
                </p>
              </div>
            </a>
          </li>

          <li className="feature-item">
            <Link
              to="/education/handbook"
              title="Handbook"
              className="linkbox linkbox-feature"
            >
              <div className="content-image">
                <img
                  src="/content_files/feature_handbook.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:handbook:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:handbook:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:handbook:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:handbook:text"
                  })}
                </p>
              </div>
            </Link>
          </li>

          <li className="feature-item">
            <Link
              to="/education/virtual-reality-project"
              title="Virtual Reality Project"
              className="linkbox linkbox-feature"
            >
              <div className="content-image">
                <img
                  src="/content_files/feature_vr.jpg"
                  title={intl.formatMessage({
                    id: "education:overview:virtual-reality-project:image:title"
                  })}
                  alt={intl.formatMessage({
                    id: "education:overview:virtual-reality-project:image:alt"
                  })}
                  className=""
                />
              </div>
              <div className="content-text">
                <p className="h1 subheader">
                  {intl.formatMessage({
                    id: "education:overview:virtual-reality-project:headline"
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "education:overview:virtual-reality-project:text"
                  })}
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </section>
      <SmShare />
    </>
  );
};

export default Education;
