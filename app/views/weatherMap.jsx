import React from 'react'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Parser } from 'html-to-react'
import queryString from 'query-string'
import PageHeadline from '../components/organisms/page-headline'
import SmShare from '../components/organisms/sm-share'

import Base from '../base'
import { dateToLongDateString, dateToTimeString } from '../util/date'
import Menu from '../components/menu'
import WeatherMapStore from '../stores/weatherMapStore'

import ItemFlipper from '../components/weather/item-flipper'
import WeatherMapTitle from '../components/weather/weather-map-title'
import WeatherMapIframe from '../components/weather/weather-map-iframe'

@observer class WeatherMap extends React.Component {
  constructor (props) {
    super(props)
    this.store = new WeatherMapStore(this.props.match.params.domain)

    this.state = {
      title: '',
      headerText: '',
      content: '',
      mapParams: {},
      mapTitle: '',
      sharable: false
    }
  }

  componentDidMount () {
    console.log('mounting weather map')
    this.setState({ mapParams: queryString.parse(this.props.location.search) })

    window['staticPageStore'].loadPage('weather/map').then(response => {
      // parse content
      const responseParsed = JSON.parse(response)
      this.setState({
        title: responseParsed.data.attributes.title,
        headerText: responseParsed.data.attributes.header_text,
        content: responseParsed.data.attributes.body,
        sharable: responseParsed.data.attributes.sharable
      })
    })

    window.addEventListener('message', e => {
      /*
      if (e.data) {
        console.log('*** getting message ', e.data)
        try {
          const data = JSON.parse(e.data)
          if (data.changes) {
            const url = Base.makeUrl('', data.newState)
            this.props.history.replace('/weather/map/' + url)
            this.setState({ mapParam: data.newState })
          }
        } catch (e) {
          console.log('JSON parse error: ' + e.data)
        }
      }
      */
    })
  }

  // TODO: method that sets the url and finds a default item to use
  handleChangeDomain (menuItem) {
    const newDomainId = menuItem.domainId

    console.log('CHANGING DOMAIN: ', newDomainId)
    if (newDomainId !== this.store.domainId) {
      this.store.changeDomain(newDomainId)
    }
  }

  // TODO: method that sets new item
  handleChangeItem (newItemId) {
    console.log('CHANGING ITEM: ', newItemId)
    this.store.changeItem(newItemId)
  }

  render () {
    console.log(' *** weather map is rendering')
    console.log('domain', this.store.domain)
    console.log('item', this.store.item)
    console.log(' *** ')
    // this.props.history.replace('/weather/map/' + this.store.domainId)

    const menuItems = window['menuStore'].getMenu('weather-map')
      ? window['menuStore'].getMenu('weather-map').map(domainM => {
          // getting the id of the menu and resetting the url - TODO: put the id in the CMS, this is a retarded solution
        console.log(domainM)
        if (!domainM.processedUrl) {
          domainM.domainId = domainM.url.split('/')[3].split('?')[0]
          domainM.processedUrl = true
        }

        domainM.url = '#' + domainM.domainId
        return domainM
      })
      : []

    // // TODO: selected domain and possible items
    // console.log(this.state.mapParams)
    // if (this.store.activeConfig) {
    //   const domainItems = this.store.activeConfig.items;
    //
    //   const items = domainItems.map(item => {
    //     return {
    //       id: item.id,
    //       time: item.timeSpan,
    //       text: item.description[params.lang]
    //     }
    //   })
    // }

    return (
      <div>
        <PageHeadline title={this.state.title} marginal={this.state.headerText} />
        <section className='section-flipper'>
          <div id='flipper'>
            <div className='section-padding-width flipper-controls'>
              <div className='section-centered'>
                <Menu
                  className='list-inline flipper-buttongroup'
                  entries={menuItems}
                  childClassName='list-plain subnavigation'
                  menuItemClassName='secondary pure-button'
                  activeClassName='js-active'
                  onSelect={this.handleChangeDomain.bind(this)}
                  onActiveMenuItem={e => {
                    if (e.title != this.state.mapTitle) {
                      window.setTimeout(() => this.setState({ mapTitle: e.title }), 100)
                    }
                  }}
                />
                <ItemFlipper store={this.store} handleChange={this.handleChangeItem} />
              </div>
            </div>

            <div className='section-centered'>
              <div className='section-padding-width flipper-header'>
                {this.store.item && <WeatherMapTitle store={this.store} />}
              </div>
            </div>

          </div>
        </section>
        <section
          className={
            'section-map' + (config.get('map.useWindowWidth') ? '' : ' section-centered')
          }
        >
          {this.store.domain && <WeatherMapIframe store={this.store} />}
        </section>
        <div>
          {new Parser().parse(this.state.content)}
        </div>
        {this.state.sharable ? <SmShare /> : <div className='section-padding' />}
      </div>
    )
  }
}
export default withRouter(observer(WeatherMap))
