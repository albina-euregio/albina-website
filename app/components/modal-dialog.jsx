import React from "react";
import { withRouter } from "react-router-dom";
import ReactDOM from "react-dom";

const modalRoot = document.body;

class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
    this.el.id = props.id;
    this.el.className = "mfp-hide";
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  // closeDialog on locationChange
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      $(".mfp-close").trigger("click");
    }
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

export default withRouter(ModalDialog);
