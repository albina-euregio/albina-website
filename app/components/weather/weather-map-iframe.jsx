import React from 'react'
import Base from '../../base'
import { observer } from 'mobx-react'

@observer
export default class WeatherMapIframe extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const params = {
      domain: this.props.store.domainId,
      lang: window['appStore'].language,
      config: 'albina'
    }

    if (this.props.store.itemId) {
      params['item'] = this.props.store.itemId
    }

    const url = Base.makeUrl(config.get('links.meteoViewer'), params)
    console.log('weather iframe', url)

    return (
      <iframe id='meteoMap' src={url}>
        <p>Your browser does not support iframes.</p>
      </iframe>
    )
  }
}
