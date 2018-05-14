import React from 'react';

export default class BulletinButtonbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="section-bulletin-buttonbar" className="section-padding section-bulletin-buttonbar">
        <div className="section-centered">
          <div className="grid">
            <div className="normal-4 grid-item">
              <a href="#page-main" title="Top" className="icon-link icon-arrow-up" data-scroll>Back to Map</a>
            </div>
            <div className="normal-8 grid-item">
              <ul className="list-inline bulletin-buttonbar">
                <li><a href="xy.pdf" title="Download Bulletin as PDF" className="pure-button tooltip">PDF</a>
                </li>
                <li><a href="../../patterns/10-global-modals-modal-ajax-content/10-global-modals-modal-ajax-content.markup-only.html" title="Subscribe to Daily Bulletin, Social Media, Newsletter, Apps" className="modal-trigger mfp-ajax pure-button tooltip">Subscribe </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
