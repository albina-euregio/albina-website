import React from 'react'
import Base from '../../base'
import { observer } from 'mobx-react'

@observer
export default class WeatherMapIframe extends React.Component {
  constructor (props) {
    super(props)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.props.store.domainId !== this.domainId ||
      this.props.store.itemId !== this.itemId
    )
  }

  render () {
    this.domainId = this.props.store.domainId
    this.itemId = this.props.store.itemId

    const params = {
      domain: this.domainId,
      lang: window['appStore'].language,
      config: 'albina'
    }

    if (this.props.zoom) {
      params.zoom = this.props.zoom
    }

    if (this.props.center['lat']) {
      const ll = this.props.center['lat'] + ',' + this.props.center['lng']

      params.center = ll
    }

    if (this.props.store.itemId) {
      params['item'] = this.props.store.itemId
    }

    const url = Base.makeUrl(config.get('links.meteoViewer'), params)

    return (
      <iframe id='meteoMap' src={decodeURIComponent(url)}>
        <p>Your browser does not support iframes.</p>
      </iframe>
    )
  }
}
