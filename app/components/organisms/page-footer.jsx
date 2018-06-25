import React from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { injectIntl, FormattedMessage} from 'react-intl';
import SmShare from './sm-share.jsx';

class PageFooter extends React.Component {
  render() {
    return (
      <div id="page-footer" className="page-footer">
        <section className="section section-padding page-footer-navigation">
          <div className="grid">
            <div className="grid-item normal-6">
              <ul className="list-inline footer-navigation footer-navigation-more">
                <li><Link to="/archive">Archive</Link></li>
                <li><a href="#" className title>API</a></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/imprint">Imprint</Link></li>
              </ul>
              <ul className="list-plain footer-navigation footer-navigation-main">
                <li><Link to="/bulletin">Avalanche Bulletin <small><FormattedMessage id="home" /></small></Link></li>
                <li><Link to="/weather">Snow &amp; Weather</Link></li>
                <li><Link to="/education">Education &amp; Prevention</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><a href="#" className=" has-sub" title>More</a></li>
              </ul>
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
            </div>
          </div>
        </section>
        <SmShare />
      </div>
    );
  }
}
export default inject('locale')(injectIntl(PageFooter));
