import React from 'react'
import { Link } from 'react-router-dom'
import Iframe from 'react-iframe'
import { inject } from 'mobx-react'
import { injectIntl, FormattedHTMLMessage } from 'react-intl'

import ProvinceFilter from '../filters/province-filter'

class SubscribeSocialMediaDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      region: window['appStore'].getRegions()[0]
    }
  }

  componentDidMount () {
    console.log(Object.keys(window.appStore.regions)[0])
    const defaultRegion = Object.keys(window.appStore.regions)[0]
    console.log('defaultregion', defaultRegion)
    this.setState({ region: defaultRegion })
  }

  handleChangeRegion (region) {
    this.setState({ region: region })
  }

  render () {
    const socialMedia = config.get('subscribe.socialMedia')
    const socialMediaNames = {}
    socialMedia.forEach(s => {
      socialMediaNames[s.id] = s.name
    })

    const subscriptions = {}
    Object.keys(window['appStore'].regions).forEach(r => {
      subscriptions[r] = socialMedia
        .map(s => {
          return { id: s.id, url: s.url[r] ? s.url[r] : null }
        })
        .filter(e => e.url)
    })

    const iframeUrls = config.get('subscribe.messengerpeople')
    const iframeUrl = this.state.region
      ? iframeUrls[this.state.region][window['appStore'].language]
      : ''

    return (
      <div className='modal-follow'>
        <div className='modal-header'>
          <h2 className='subheader'>
            <FormattedHTMLMessage id='dialog:subscribe-social-media:header' />
          </h2>
          <h2>
            <FormattedHTMLMessage id='dialog:subscribe-social-media:subheader' />
          </h2>
          <p className='tiny'>
            <a
              href='#subscribeDialog'
              className='icon-link icon-arrow-left modal-trigger tooltip'
              title={this.props.intl.formatMessage({
                id: 'dialog:subscribe-social-media:back-button:hover'
              })}>
              <FormattedHTMLMessage id='dialog:subscribe-social-media:back-button' />
            </a>
          </p>
        </div>

        <div>
          <ul className='list-inline list-buttongroup'>
            <li>
              <ProvinceFilter
                className='selectric-changed'
                handleChange={r => this.handleChangeRegion(r)}
                value={this.state.region}
              />
            </li>
          </ul>
        </div>

        <Iframe
          width='390px'
          height='370px'
          className='messengerpeople'
          url={iframeUrl}
        />

        <p>
          <Link
            to='/contact'
            title={this.props.intl.formatMessage({
              id: 'dialog:subscribe-social-media:contact-button:hover'
            })}
            className='secondary pure-button'>
            {this.props.intl.formatMessage({
              id: 'dialog:subscribe-social-media:contact-button'
            })}
          </Link>
        </p>
      </div>
    )
  }
}
export default inject('locale')(injectIntl(SubscribeSocialMediaDialog))
