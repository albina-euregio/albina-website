import React from 'react';
import SmShare from './sm-share.jsx';

export default class PageFooter extends React.Component {
  render() {
    return (
      <div id="page-footer" className="page-footer">
        <section className="section section-padding page-footer-navigation">
          <div className="grid">
            <div className="grid-item normal-6">
              <ul className="list-inline footer-navigation footer-navigation-more">
                <li><a href="#" className title>Archive</a></li>
                <li><a href="#" className title>API</a></li>
                <li><a href="./about" className title>About</a></li>
                <li><a href="./contact" className title>Contact</a></li>
                <li><a href="./imprint" className title>Imprint</a></li>
              </ul>
              <ul className="list-plain footer-navigation footer-navigation-main">
                <li><a href="./bulletin" className=" " title>Avalanche Bulletin <small>Home</small></a></li>
                <li><a href="./weather" className=" has-sub" title>Snow &amp; Weather</a></li>
                <li><a href="./education" className=" has-sub" title>Education &amp; Prevention</a></li>
                <li><a href="./blog" className title>Blog</a></li>
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
