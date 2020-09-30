import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  // closeDialog on locaionChange
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      $(".mfp-close").trigger("click");
    }
  }

  render() {
    return (
      <div id={this.props.id} className={"mfp-hide"}>
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(observer(ModalDialog));
