import React from 'react';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import Menu from '../menu';
import SmShare from './sm-share.jsx';

@observer
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
                <a href="../../patterns/10-global-modals-modal-ajax-content/10-global-modals-modal-ajax-content.markup-only.html" title="Subscribe to Daily Bulletin, Social Media, Newsletter, Apps" className="modal-trigger mfp-ajax pure-button tooltip">Subscribe </a>
              </p>
              <p className="page-footer-text">Bush tomato gumbo potato garbanzo ricebean burdock daikon coriander kale quandong. Bok choy celery leek <a href>avocado shallot</a> horseradish aubergine parsley. Bok choy bell pepper kale celery desert raisin kakadu plum bok choy bunya nuts.</p>
              <p className="page-footer-interreg">
                <a href="#" className="logo-interreg tooltip" title="Interreg"><span>Interreg</span></a>
              </p>
            </div>
            <div className="grid-item all-12">
              <p className="page-footer-top">
                <a href="#page-main" className="icon-arrow-up tooltip" title="Top"><span>Top</span></a>
              </p>
              { config.get('developmentMode') &&
                <p className="page-footer-dev-version">
                  <span>Draft version - for internal use: v{config.get('version')}</span>
                </p>
              }
            </div>
          </div>
        </section>
        <SmShare />
      </div>
    );
  }
}
export default inject('locale')(injectIntl(PageFooter));
