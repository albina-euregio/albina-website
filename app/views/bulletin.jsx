import React from 'react'
import { withRouter } from 'react-router-dom'
import { Parser } from 'html-to-react'
import { reaction } from 'mobx'
import { BulletinStore } from '../stores/bulletinStore'
import BulletinHeader from '../components/bulletin/bulletin-header'
import BulletinMap from '../components/bulletin/bulletin-map'
import BulletinLegend from '../components/bulletin/bulletin-legend'
import BulletinButtonbar from '../components/bulletin/bulletin-buttonbar'
import BulletinReport from '../components/bulletin/bulletin-report'
import SmShare from '../components/organisms/sm-share'
import { parseDate, dateToISODateString } from '../util/date.js'
import Base from './../base'
import { tooltip_init } from '../js/tooltip'

class Bulletin extends React.Component {
  constructor(props) {
    super(props)
    if (typeof window.bulletinStore === 'undefined') {
      window.bulletinStore = new BulletinStore()
    }
    this.store = window.bulletinStore
    this.state = {
      title: '',
      content: '',
      sharable: false,
      highlightedRegion: null
    }
  }

  get highlightedBulletin() {
    return this.store.activeBulletin
  }

  componentDidMount() {
    window['staticPageStore'].loadPage('bulletin').then(response => {
      // parse content
      const responseParsed = JSON.parse(response)
      this.setState({
        title: responseParsed.data.attributes.title,
        content: responseParsed.data.attributes.body,
        sharable: responseParsed.data.attributes.sharable,
        highlightedRegion: null
      })
    })

    const onUpdateStatus = reaction(
      () => this.store.settings.status,
      status => {
        window.setTimeout(tooltip_init, 100)
      }
    )
    const onUpdateRegion = reaction(
      () => this.store.settings.region,
      region => {
        if (region) {
          window.setTimeout(tooltip_init, 100)
        }
      }
    )
    return this._fetchData(this.props)
    this.checkRegion()
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const newDate = this.props.match.params.date
      if (newDate && newDate != this.store.settings.date) {
        this._fetchData(this.props)
      }
    }
    this.checkRegion()
  }

  _fetchData(props) {
    let startDate =
      props.match.params.date && parseDate(props.match.params.date)
        ? props.match.params.date
        : dateToISODateString(new Date())

    if (startDate != this.props.match.params.date) {
      // update URL if necessary
      props.history.push('/bulletin/' + startDate)
    }

    return this.store.load(startDate)
  }

  checkRegion() {
    const urlRegion = Base.getQueryVariable('region')
    const storeRegion = this.store.settings.region

    if (urlRegion !== storeRegion) {
      this.store.setRegion(urlRegion)
    }
  }

  handleHighlightRegion = id => {
    if (id) {
      this.setState({ highlightedRegion: id })
    } else if (this.state.highlightedRegion) {
      console.log(
        'Dehighlight region ' + this.state.highlightedRegion
      )
      this.setState({
        highlightedRegion: ''
      })
    }
  }

  handleSelectRegion = id => {
    if (id) {
      const oldRegion = Base.getQueryVariable('region')

      if (oldRegion !== id) {
        this.props.history.push({ hash: '#region=' + id })
        this.store.setRegion(id)
        this.handleHighlightRegion(id) // also do highlighting
      }
    } else if (this.store.settings.region) {
      if (Base.getQueryVariable('region')) {
        this.props.history.push({ search: '' })
      }

      this.store.setRegion('')
      this.handleHighlightRegion(null)
    }
  }

  handleMapViewportChanged(mapState) {
    this.store.setMapViewport(mapState)
  }

  render() {
    console.log('rendering bulletin view')
    return (
      <div>
        <BulletinHeader store={this.store} title={this.state.title} />
        <BulletinMap
          handleMapViewportChanged={this.handleMapViewportChanged.bind(
            this
          )}
          handleHighlightRegion={this.handleHighlightRegion.bind(
            this
          )}
          handleSelectRegion={this.handleSelectRegion.bind(this)}
          date={this.props.match.params.date}
          history={this.props.history}
          store={this.store}
        />
        <BulletinLegend problems={this.store.problems} />
        <BulletinButtonbar store={this.store} />
        <BulletinReport store={this.store} />
        {this.state.sharable && <SmShare />}
        <div className="section-padding section-centered">
          {new Parser().parse(this.state.content)}
        </div>
      </div>
    )
  }
}
export default withRouter(Bulletin)
