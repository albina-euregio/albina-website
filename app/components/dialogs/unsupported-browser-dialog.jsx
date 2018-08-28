import React from 'react'
import { inject } from 'mobx-react'
import { injectIntl, FormattedHTMLMessage } from 'react-intl'

class UnsupportedBrowserDialog extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>

        <div className='mfp-bg mfp-slide-animation mfp-ready' />
        <div
          className='modal mfp-content'
          style={{
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50%'
          }}
        >
          <div className='modal-container'>
            <div className='modal-header'>
              <h2 className='subheader'>
                <FormattedHTMLMessage id='dialog:unsupportedBrowser:heading' />
                {' - '}
                {browserVersion}
              </h2>
              <h2><FormattedHTMLMessage id='dialog:unsupportedBrowser:message' /></h2>
            </div>
            <a onClick={appStore.unsupportedBrowserModalOff.bind(appStore)}>
              <button className='inverse pure-button'>
                {this.props.intl.formatMessage({
                  id: 'dialog:unsupportedBrowser:accept'
                })}
              </button>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
export default inject('locale')(injectIntl(UnsupportedBrowserDialog))
