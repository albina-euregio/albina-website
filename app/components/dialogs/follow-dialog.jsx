import React from 'react'
import { Link } from 'react-router-dom'
import { inject } from 'mobx-react'
import { injectIntl, FormattedHTMLMessage } from 'react-intl'

class FollowDialog extends React.Component {
  constructor (props) {
    super(props)
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

    return (
      <div className='modal-follow'>
        <div className='modal-header'>
          <h2 className='subheader'>
            <FormattedHTMLMessage id='dialog:follow:header' />
          </h2>
        </div>

        {Object.keys(subscriptions).map(r => (
          <div key={r} className='followRegion'>
            <h2 className='subheader'>
              {this.props.intl.formatMessage({ id: 'region:' + r })}
            </h2>
            <ul className='list-inline sm-buttons'>
              {subscriptions[r].map(e => (
                <li key={e.id}>
                  <a
                    className={'sm-button icon-sm-' + e.id + ' tooltip'}
                    href={e.url}
                    target='_blank'
                    title={this.props.intl.formatMessage(
                      { id: 'footer:follow-us:hover' },
                      { on: socialMediaNames[e.id] }
                    )}>
                    <span>{socialMediaNames[e.id]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }
}
export default inject('locale')(injectIntl(FollowDialog))
