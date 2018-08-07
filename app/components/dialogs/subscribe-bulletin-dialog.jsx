import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class SubscribeBulletinDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      language: window['appStore'].language,
      status: '',
      errorMessage: '',
    }
  }

  handleChangeEmail = (e) => {
    this.setState({email: e.target.value});
  }

  handleChangeLanguage = (e) => {
    this.setState({language: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('TEST: ' + JSON.stringify(this.state));
    this.setState({status: 'loading'});
  }

  render() {
    return (
      <div className="modal-subscribe">
        <div className="modal-header">
          <h2 className="subheader"><FormattedHTMLMessage id="dialog:subscribe-bulletin:header" /></h2>
          <h2><FormattedHTMLMessage id="dialog:subscribe-bulletin:subheader" /></h2>
          <p className="tiny">
            <a href="#subscribeDialog" className="icon-link icon-arrow-left modal-trigger tooltip"
              title={this.props.intl.formatMessage({id: 'dialog:subscribe-bulletin:back-button:hover'})}>
              <FormattedHTMLMessage id="dialog:subscribe-bulletin:back-button" />
            </a>
          </p>
        </div>

        { !this.state.status &&
          <form className="pure-form pure-form-stacked"
            onSubmit={this.handleSubmit}>
            <p>
              <label htmlFor="email">
                <FormattedHTMLMessage id="dialog:subscribe-bulletin:email" />
                <span className="normal"></span>
              </label>
              <input id="email" name="email"
                className="full-width"
                onChange={this.handleChangeEmail}
                placeholder={this.props.intl.formatMessage({id: 'dialog:subscribe-bulletin:email'})} />
            </p>
            <label htmlFor="language">
              <FormattedHTMLMessage id="dialog:subscribe-bulletin:language" />
              <span className="normal"></span>
            </label>
            <ul className="list-inline list-subscribe-language">
              { window['appStore'].languages.map((l) =>
                <li key={l}>
                  <label className="pure-checkbox"
                    htmlFor={'subscribe-language-' + l}>
                    <input id={'subscribe-language-' + l}
                      name="language"
                      onChange={this.handleChangeLanguage}
                      value={l}
                      type="radio"
                      checked={(this.state.language == l) ? 'checked' : ''} />
                    &nbsp;
                    <span className="normal">{l.toUpperCase()}</span>
                  </label>
                </li>
              )}
            </ul>

            <hr />

            <button type="submit" className="pure-button">
              {this.props.intl.formatMessage({id: 'dialog:subscribe-bulletin:subscribe:button'})}
            </button>
          </form>
        }

        { (this.state.status || this.state.errorMessage) &&
          <div className="field-2 panel">
            {this.state.status &&
              <p className="status-message">
                <FormattedHTMLMessage id={'dialog:subscribe-bulletin:status:' + this.state.status} />
              </p>
            }
            {this.state.errorMessage &&
              <p className="status-message">
                <strong className="error">{this.props.intl.formatMessage({id: 'dialog:subscribe-bulletin:error'})}:</strong>
                &nbsp;{this.state.errorMessage}
              </p>
            }
          </div>
        }
      </div>
    );
  }
}
export default inject('locale')(injectIntl(SubscribeBulletinDialog));
