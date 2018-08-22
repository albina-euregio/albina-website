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

  render () {
    const menuItems = window['menuStore'].getMenu('weather-map')

    // use the last path parameter as "domain" and add optional parameters from
    // query string
    const params = {
      domain: this.props.match.params.domain,
      lang: window['appStore'].language
    }

    const url =
      config.get('links.meteoViewer') +
      '?config=albina' +
      '&language=' +
      window['appStore'].language +
      '&domain=' +
      params.domain

    /* const url = Base.makeUrl(config.get('links.meteoViewer'),
      Object.assign(params, this.state.mapParams));
*/
    const forwardLink = {
      text: '+12h',
      url: Base.makeUrl(
        '/weather/map/' + this.props.match.params.domain,
        Object.assign({}, this.state.mapParams, { time: '+12' })
      )
    }
    const backwardLink = {
      text: '-12h',
      url: Base.makeUrl(
        '/weather/map/' + this.props.match.params.domain,
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
