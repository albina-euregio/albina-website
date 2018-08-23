import React from 'react'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Parser } from 'html-to-react'
import queryString from 'query-string'
import PageHeadline from '../components/organisms/page-headline'
import Menu from '../components/menu'
import SmShare from '../components/organisms/sm-share'
import { dateToLongDateString, dateToTimeString } from '../util/date'
import WeatherMapStore from '../stores/weatherMapStore';
import ItemFlipper from '../components/weather/item-flipper';
import WeatherMapTitle from '../components/weather/weather-map-title';
import WeatherMapIframe from '../components/weather/weather-map-iframe';

class WeatherMap extends React.Component {
  constructor (props) {
    super(props)
    this.store = new WeatherMapStore(this.props.match.params.domain);
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
    console.log('CHANGE DOMAIN: ' + newDomain);
    if(newDomain != this.props.store.domain) {
      this.store.changeDomain(newDomain);
      this.props.history.replace('/weather/map/' + newDomain);
    }
    // change url
    // find default item
  }

  // TODO: method that sets new item
  handleChangeItem (newItemId) {
    console.log('CHANGE ITEM: ' + newItemId);
    this.store.changeItem(newItemId);
    // change search param
  }

  render () {
    // TODO: menu items should render with "handleChangeDomain"
    const menuItems = window['menuStore'].getMenu('weather-map')

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

    /* const url = Base.makeUrl(config.get('links.meteoViewer'),
      Object.assign(params, this.state.mapParams));
    */


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
                <ItemFlipper store={this.store} handleChange={this.handleChangeItem}/>
              </div>
            </div>

            <div className='section-centered'>
              <div className='section-padding-width flipper-header'>
                { this.store.activeItem &&
                  <WeatherMapTitle store={this.store} />
                }
              </div>
            </div>

          </div>
        </section>
        <section
          className={
            'section-map' + (config.get('map.useWindowWidth') ? '' : ' section-centered')
          }
        >
          { this.store.domain &&
            <WeatherMapIframe
              store={this.store} />
          }
        </section>
        <div>
          {new Parser().parse(this.state.content)}
        </div>
        {this.state.sharable ? <SmShare /> : <div className='section-padding' />}
      </div>
    )
  }
}
export default withRouter(observer(WeatherMap));
