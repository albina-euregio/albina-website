import React from "react";
import { useIntl } from "react-intl";

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
          <a
            role="button"
            tabIndex="0"
            onClick={props.handlePreviousPage}
            title={intl.formatMessage({
              id: "bulletin:header:dateflipper:back"
            })}
            className="tooltip"
          >
            <span className="icon-arrow-left"></span>
            {pageTranslation} {curPage}
          </a>
        </li>
      )}

      <li className="bulletin-flipper-separator">
        {curPage}/{maxPages}
      </li>
      {curPage < maxPages && (
        <li className="bulletin-flipper-forward">
          <a
            role="button"
            tabIndex="0"
            onClick={props.handleNextPage}
            title={intl.formatMessage({
              id: "bulletin:header:dateflipper:forward"
            })}
            className="tooltip"
          >
            {pageTranslation} {curPage + 1}{" "}
            <span className="icon-arrow-right" />
          </a>
        </li>
      )}
    </ul>
  );
};

export default BlogPageFlipper;
