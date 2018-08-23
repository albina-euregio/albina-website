import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { inject } from 'mobx-react'
import { injectIntl } from 'react-intl'
import { Parser } from 'html-to-react'
import queryString from 'query-string'
import Base from '../base'
import PageHeadline from '../components/organisms/page-headline'
import Menu from '../components/menu'
import SmShare from '../components/organisms/sm-share'
import { dateToLongDateString, dateToTimeString } from '../util/date'
import domains from '../data/domains.json'

class WeatherMap extends React.Component {
  constructor (props) {
    super(props)
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
      if (e.data) {
        try {
          const data = JSON.parse(e.data)
          if (data.changes && data.changes.domain) {
            this.props.history.replace('/weather/map/' + data.changes.domain)
          } else {
            this.setState({ mapParam: data.newState })
          }
        } catch (e) {
          console.log('JSON parse error: ' + e.data)
        }
      }
    })
  }

  // TODO: method that sets the url and finds a default item to use
  handleChangeDomain (newDomain) {
    // change url
    // find default item
  }

  // TODO: method that sets new item
  handleChangeItem (newItemId) {
    // change search param
  }

  render () {
    // TODO: menu items should render with "handleChangeDomain"
    const menuItems = window['menuStore'].getMenu('weather-map')

    // use the last path parameter as "domain" and add optional parameters from
    // query string
    const params = {
      item: this.state.mapParams.item,
      domain: this.props.match.params.domain,
      lang: window['appStore'].language
    }

    // building url
    let url =
      config.get('links.meteoViewer') +
      '?config=albina' +
      '&language=' +
      window['appStore'].language

    if (params.domain) {
      url += '&domain=' + params.domain
    }
    if (params.item) {
      url += '&item=' + params.item
    }

    // TODO: selected domain and possible items
    console.log(this.state.mapParams)
    const domain = domains[params.domain]
    if (domain) {
      const domainItems = domain.items

      const items = domainItems.map(item => {
        return {
          id: item.id,
          time: item.timeSpan,
          text: item.description[params.lang]
        }
      })
    }

    /* const url = Base.makeUrl(config.get('links.meteoViewer'),
      Object.assign(params, this.state.mapParams));
    */

    // TODO: list of item links with the item id and onChange prop "handleChangeItem"
    const forwardLink = {
      text: '+12h',
      url: Base.makeUrl(
        '/weather/map/' + params.domain,
        Object.assign({}, this.state.mapParams, { time: '+12' })
      )
    }
    const backwardLink = {
      text: '-12h',
      url: Base.makeUrl(
        '/weather/map/' + params.domain,
        Object.assign({}, this.state.mapParams, { time: '-12' })
      )
    }

    const mapDate = new Date()

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
                  onActiveMenuItem={e => {
                    if (e.title != this.state.mapTitle) {
                      window.setTimeout(() => this.setState({ mapTitle: e.title }), 100)
                    }
                  }}
                />

                <div className='grid flipper-left-right'>
                  <div className='all-6 grid-item'>
                    {backwardLink &&
                      <Link
                        to={backwardLink.url}
                        className='icon-link tooltip flipper-left'
                        title={this.props.intl.formatMessage({
                          id: 'weathermap:header:dateflipper:back'
                        })}
                      >
                        <span className='icon-arrow-left' />
                        &nbsp;{backwardLink.text}
                      </Link>}
                  </div>
                  <div className='all-6 grid-item'>
                    {forwardLink &&
                      <Link
                        to={forwardLink.url}
                        className='icon-link tooltip flipper-left'
                        title={this.props.intl.formatMessage({
                          id: 'weathermap:header:dateflipper:forward'
                        })}
                      >
                        {forwardLink.text}&nbsp;
                        <span className='icon-arrow-right' />
                      </Link>}
                  </div>

                </div>
              </div>
            </div>

            <div className='section-centered'>
              <div className='section-padding-width flipper-header'>
                <h2 className='subheader'>
                  {dateToLongDateString(mapDate)} {dateToTimeString(mapDate)}
                </h2>
                <h2>{this.state.mapTitle}</h2>
              </div>
            </div>

          </div>
        </section>
        <section
          className={
            'section-map' + (config.get('map.useWindowWidth') ? '' : ' section-centered')
          }
        >
          <iframe id='meteoMap' src={url}>
            <p>Your browser does not support iframes.</p>
          </iframe>
        </section>
        <div>
          {new Parser().parse(this.state.content)}
        </div>
        {this.state.sharable ? <SmShare /> : <div className='section-padding' />}
      </div>
    )
  }
}
export default inject('locale')(injectIntl(withRouter(WeatherMap)))
