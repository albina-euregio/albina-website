import React from "react";
import { useIntl } from "../../i18n";
import { DATE_TIME_FORMAT } from "../../util/date";

const FeatureInfo = ({ feature }) => {
  const intl = useIntl();
  return (
    <div className="feature-info weather-map-details">
      <div className="box-content">
        <div className="weather-map-details-text">
          {feature.name && <p className="feature-name">{feature.name}</p>}
          {feature.operator && (
            <p className="operator-name">{feature.operator}</p>
          )}
          {feature.detail && (
            <p className="feature-details">{feature.detail}</p>
          )}
          {feature.date && (
            <p className="feature-date">
              {intl.formatDate(feature.date, DATE_TIME_FORMAT)}
            </p>
          )}
        </div>
        {feature.plot && (
          <a
            role="button"
            tabIndex="0"
            className="pure-button weather-map-details-button"
          >
            {intl.formatMessage({
              id: "weathermap:map:feature-info:more"
            })}
          </a>
        )}
      </div>
    </div>
  );
};

export default FeatureInfo;
