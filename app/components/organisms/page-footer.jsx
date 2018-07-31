import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import Menu from '../menu';
import SmFollow from './sm-follow.jsx';

class PageFooter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const footerMenuMore = this.props.menuStore.getMenu('footer');
    const footerMenuMain = this.props.menuStore.getMenu('footer-main');

    return (
      <div id="page-footer" className="page-footer">
        <section className="section section-padding page-footer-navigation">
          <div className="grid">
            <div className="grid-item normal-6">
              <Menu
                className="list-inline footer-navigation footer-navigation-more"
                entries={footerMenuMore} />
              <Menu
                className="list-plain footer-navigation footer-navigation-main"
                entries={footerMenuMain} />
            </div>
            <div className="grid-item normal-6">
              <p className="page-footer-subscribe">
                <a
                  href="#"
                  title={this.props.intl.formatMessage({id: 'footer:subscribe:hover'})}
                  className="modal-trigger mfp-ajax pure-button tooltip">
                  {this.props.intl.formatMessage({id: 'footer:subscribe'})}
                </a>
              </p>
              <p className="page-footer-text">Bush tomato gumbo potato garbanzo ricebean burdock daikon coriander kale quandong. Bok choy celery leek <a href>avocado shallot</a> horseradish aubergine parsley. Bok choy bell pepper kale celery desert raisin kakadu plum bok choy bunya nuts.</p>
              <p className="page-footer-interreg">
                <a href="#" className="logo-interreg tooltip" title={this.props.intl.formatMessage({id: 'footer:interreg:hover'})}><span>Interreg</span></a>
              </p>
            </div>
            <div className="grid-item all-12">
              <p className="page-footer-top">
                <a href="#page-main"
                  className="icon-arrow-up tooltip"
                  title={this.props.intl.formatMessage({id: 'footer:top:hover'})}>
                  <span>Top</span>
                </a>
              </p>
              { config.get('developmentMode') &&
                <p className="page-footer-dev-version">
                  <span>Draft version - for internal use: v{config.get('version')}</span>
                </p>
              }
            </div>
          </div>
        </section>
        <SmFollow />
      </div>
    );
  }
}
export default inject('locale')(injectIntl(observer(PageFooter)));
