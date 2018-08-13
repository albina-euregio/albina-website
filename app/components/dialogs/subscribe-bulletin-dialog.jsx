import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import ProvinceFilter from '../filters/province-filter';
import Base from '../../base';

class SubscribeBulletinDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      language: window['appStore'].language,
      regions: Object.keys(window['appStore'].regions).sort(),
      status: '',
      errorMessage: '',
    }
  }

  handleChangeEmail = (e) => {
    const target = e.target;
    if(!target.matches(':invalid')) {
      this.setState({email: target.value});
    } else if(this.state.email) {
      this.setState({email: ''});
    }
  };

  handleChangeLanguage = (e) => {
    this.setState({language: e.target.value});
  };

  handleChangeRegion = (newRegions) => {
    if(!newRegions) {
      newRegions = Object.keys(window['appStore'].regions);
    }
    if(Array.isArray(newRegions)) {
      newRegions.sort();
    } else {
      newRegions = [newRegions];
    }

    const equal = (newRegions.length == this.state.regions.length) &&
      newRegions.every((v,i) => (v === this.state.regions[i]));

    if(!equal) {
      window.setTimeout(() => {
        this.setState(
          {regions: newRegions}
        );
      }, 0);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = {
      language: this.state.language,
      regions: this.state.regions,
      email: this.state.email
    };

    this.setState({status: 'loading'});
    Base.doPost(config.get('apis.subscribe') + '/subscribe', data).then(
      () => {
        this.setState({status: 'submitted'});
      },
      (errorText, statusCode) => {
        this.setState({errorMessage: errorText});
      }
    );
  }

  validate() {
    return (this.state.email != '')
      && (this.state.language != '')
      && (Array.isArray(this.state.regions));
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
            <label htmlFor="province">
              <FormattedHTMLMessage id="dialog:subscribe-bulletin:region" />
            </label>
            <ul className="list-inline list-buttongroup">
              <li>
                <button
                  type="button"
                  className={'pure-button' + ((this.state.regions.length == 1) ? ' inverse' : '')}
                  onClick={() => {
                    this.handleChangeRegion(Object.keys(window['appStore'].regions))
                  }} >
                  {this.props.intl.formatMessage({id: 'dialog:subscribe-bulletin:region-all:button'})}
                </button>
              </li>
              <li>
                <span className="buttongroup-boolean">{this.props.intl.formatMessage({id: 'dialog:subscribe-bulletin:region:or'})}</span>
              </li>
              <li>
                <ProvinceFilter
                  className={(this.state.regions.length == 1) ? 'selectric-changed' : ''}
                  all={this.props.intl.formatMessage({id: 'dialog:subscribe-bulletin:region-select:button'})}
                  handleChange={(r) => this.handleChangeRegion(r)}
                  value={(this.state.regions.length == 1) ? this.state.regions[0] : ''} />
              </li>
            </ul>

            <hr />

            <p>
              <label htmlFor="email">
                <FormattedHTMLMessage id="dialog:subscribe-bulletin:email" />
                <span className="normal"></span>
              </label>
              <input id="email"
                name="email"
                type="email"
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

            <button type="submit"
              className="pure-button"
              disabled={this.validate() ? '' : 'disabled'}>
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
