import React from 'react'
import { withRouter } from 'react-router'
import PageLoadingScreen from './organisms/page-loading-screen.jsx'
import Jumpnav from './organisms/jumpnav.jsx'
import PageHeader from './organisms/page-header.jsx'
import PageFooter from './organisms/page-footer.jsx'
import MenuStore from '../stores/menuStore'
import { observer } from 'mobx-react'

import Base from './../base'
import ModalDialog from './modal-dialog'
import FollowDialog from './dialogs/follow-dialog'
import SubscribeDialog from './dialogs/subscribe-dialog'
import SubscribeSocialMediaDialog from './dialogs/subscribe-social-media-dialog'
import SubscribeAppDialog from './dialogs/subscribe-app-dialog'
import SubscribeEmailDialog from './dialogs/subscribe-email-dialog'
import SubscribeBlogDialog from './dialogs/subscribe-blog-dialog'
import UnsupportedBrowserDialog
  from './../components/dialogs/unsupported-browser-dialog'
import CookieConsent from './dialogs/cookie-consent'

import { renderRoutes } from 'react-router-config'
import { modal_init } from '../js/modal'
import { tooltip_init } from '../js/tooltip'
import { navigation_init } from '../js/navigation'
import { video_init } from '../js/video'

@observer class Page extends React.Component {
  constructor (props) {
    super(props)
    this.menuStore = new MenuStore()
    window['menuStore'] = this.menuStore
  }

  _setLanguage () {
    // url lang param

    console.log('setting language')
    if (!appStore.setLanguage(Base.searchGet('lang'))) {
      // browser setting

      console.log(window.localStorage.getItem('locale'))
      if (!appStore.setLanguage(window.localStorage.getItem('locale'))) {
        // config language
        if (!appStore.setLanguage(config.get('defaults.language'))) {
          // browser setting
          let browserLangSettings = window.navigator.language
            ? window.navigator.language
            : ''
          browserLangSettings = window.navigator.browserLanguage
            ? window.navigator.browserLanguage
            : ''

          browserLangSettings = browserLangSettings.substr(0, 2).toLowerCase()

          if (!appStore.setLanguage(browserLangSettings)) {
            // fallback to en
            appStore.setLanguage('en')
          }
        }
      }
    }

    // set the url if needed
    Base.searchChange(this.props.history, 'lang', appStore.language, true)
  }

  componentDidUpdate () {
    this._didUpdate()
  }

  componentDidMount () {
    this._didUpdate()
  }

  componentWillReceiveProps (nextProps) {
    if (
      nextProps.location !== this.props.location &&
      nextProps.history.action === 'PUSH' &&
      !nextProps.location.hash
    ) {
      // scroll to top on forward page change (if no hash is set)
      // see https://github.com/ReactTraining/react-router/issues/2019
      window.scrollTo(0, 0)
    }
  }

  _didUpdate () {
    if (
      this.props.location.pathname === '' ||
      this.props.location.pathname === '/'
    ) {
      this.props.history.push('bulletin')
    }
    this._setLanguage()
    modal_init()
    tooltip_init()
    navigation_init()
    video_init()
  }

  render () {
    return (
      <div>
        <PageLoadingScreen />
        <Jumpnav />
        <div id='page-all' className='page-all'>
          <PageHeader menuStore={this.menuStore} />
          <main id='page-main' className='page-main'>
            <div id='global-grid'>
              {renderRoutes(this.props.route.routes)}
            </div>
          </main>
          <PageFooter menuStore={this.menuStore} />
        </div>
        {appStore.unsupportedBrowserModal && <UnsupportedBrowserDialog />}
        <ModalDialog id='subscribeDialog'>
          <SubscribeDialog />
        </ModalDialog>
        <ModalDialog id='followDialog'>
          <FollowDialog />
        </ModalDialog>
        <ModalDialog id='subscribeEmailDialog'>
          <SubscribeEmailDialog />
        </ModalDialog>
        <ModalDialog id='subscribeBlogDialog'>
          <SubscribeBlogDialog />
        </ModalDialog>
        <ModalDialog id='subscribeSocialMediaDialog'>
          <SubscribeSocialMediaDialog />
        </ModalDialog>
        <ModalDialog id='subscribeAppDialog'>
          <SubscribeAppDialog />
        </ModalDialog>
        <CookieConsent />
      </div>
    )
  }
}

export default withRouter(Page)
