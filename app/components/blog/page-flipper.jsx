import React from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
const BlogPageFlipper = props => {
  const intl = useIntl();
  let { curPage, maxPages } = props;
  //console.log("PageFlipper", curPage, maxPages);

  const pageTranslation = intl.formatMessage({
    id: "blog:page-flipper:page"
  });
  return (
    <ul className="list-inline bulletin-flipper">
      {curPage != 1 && (
        <li className="bulletin-flipper-back">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:header:dateflipper:back"
            })}
          >
            <a role="button" tabIndex="0" onClick={props.handlePreviousPage}>
              <span className="icon-arrow-left"></span>
              {pageTranslation} {curPage}
            </a>
          </Tooltip>
        </li>
      )}

      <li className="bulletin-flipper-separator">
        {curPage}/{maxPages}
      </li>
      {curPage < maxPages && (
        <li className="bulletin-flipper-forward">
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:header:dateflipper:forward"
            })}
          >
            <a role="button" tabIndex="0" onClick={props.handleNextPage}>
              {pageTranslation} {curPage + 1}{" "}
              <span className="icon-arrow-right" />
            </a>
          </Tooltip>
        </li>
      )}
    </ul>
  );
};

export default BlogPageFlipper;
