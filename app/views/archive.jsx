import React from 'react'
import { observer, inject } from 'mobx-react'
import { reaction } from 'mobx'
import { injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Parser } from 'html-to-react'
import SmShare from '../components/organisms/sm-share.jsx'
import {
  parseDate,
  getSuccDate,
  dateToISODateString
} from '../util/date.js'
import ArchiveStore from '../stores/archiveStore.js'
import ArchiveItem from '../components/archive/archive-item.jsx'
import PageHeadline from '../components/organisms/page-headline.jsx'
import FilterBar from '../components/organisms/filter-bar.jsx'
import LanguageFilter from '../components/filters/language-filter.jsx'
import YearFilter from '../components/filters/year-filter.jsx'
import MonthFilter from '../components/filters/month-filter.jsx'
import DayFilter from '../components/filters/day-filter.jsx'
import { tooltip_init } from '../js/tooltip'

class Archive extends React.Component {
  constructor(props) {
    super(props)
    if (!window['archiveStore']) {
      window['archiveStore'] = new ArchiveStore()
    }
    this.store = window['archiveStore']

    if (!this.store.year) {
      const d = new Date()

      this.store.month = d.getMonth() + 1
      this.store.year = d.getFullYear()
    }

    this.state = {
      title: '',
      headerText: '',
      content: '',
      sharable: false
    }
  }

  componentDidMount() {
    window['staticPageStore'].loadPage('archive').then(response => {
      // parse content
      const responseParsed = JSON.parse(response)
      this.setState({
        title: responseParsed.data.attributes.title,
        headerText: responseParsed.data.attributes.header_text,
        content: responseParsed.data.attributes.body,
        sharable: responseParsed.data.attributes.sharable
      })
    })

    const up = () => {
      window.setTimeout(tooltip_init, 1000)
    }

    const onUpdateStatus = reaction(() => this.store.loading, up)
    const onUpdateMonth = reaction(() => this.store.month, up)
    const onUpdateYear = reaction(() => this.store.year, up)
    const onUpdateDay = reaction(() => this.store.day, up)
    up()
  }

  get dates() {
    if (!this.store.loading) {
      // TODO: take filter values from store
      /*
      2030
      const startDate = this.store.startDate
        ? this.store.startDate
        : ''
        */

      const startDate = new Date('Feb 14 2030 00:00:00 GMT+0100')
      const endDate = new Date('Feb 16 2030 00:00:00 GMT+0100') // 2030 this.store.endDate ? this.store.endDate : ''

      const test = date => {
        return this.store.getStatus(dateToISODateString(date)) == 'ok'
      }

      var d = startDate
      const dates = [startDate]
      while (d < endDate) {
        d = getSuccDate(d)
        dates.push(d)
      }

      return dates
        .filter(d => test(d))
        .slice(0, window['config'].get('archive.maxResults'))
    }
    return []
  }

  handleChangeYear = val => {
    this.store.year = val
  }

  handleChangeMonth = val => {
    this.store.month = val
  }

  handleChangeDay = val => {
    this.store.day = val
  }

  render() {
    return (
      <div>
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        <FilterBar search={false}>
          <YearFilter
            title={this.props.intl.formatMessage({
              id: 'archive:filter:year'
            })}
            minYear={
              //window['config'].get('archive.minYear')
              '2030'
            }
            handleChange={this.handleChangeYear}
            value={this.store.year}
          />
          {this.store.year && (
            <MonthFilter
              title={this.props.intl.formatMessage({
                id: 'archive:filter:month'
              })}
              handleChange={this.handleChangeMonth}
              value={2} // 2030 this.store.month}
            />
          )}
          {this.store.month && (
            <DayFilter
              title={this.props.intl.formatMessage({
                id: 'archive:filter:day'
              })}
              all={this.props.intl.formatMessage({
                id: 'filter:all'
              })}
              handleChange={this.handleChangeDay}
              year={this.store.year}
              month={this.store.month}
              value={this.store.day}
            />
          )}
          <LanguageFilter
            title={this.props.intl.formatMessage({
              id: 'archive:filter:language'
            })}
            all={this.props.intl.formatMessage({ id: 'filter:all' })}
          />
        </FilterBar>
        <section className="section-padding-height">
          <section className="section-centered">
            <div className="table-container">
              <table className="pure-table pure-table-striped pure-table-small table-archive">
                <thead>
                  <tr>
                    <th>
                      {this.props.intl.formatMessage({
                        id: 'archive:table-header:date'
                      })}
                    </th>
                    <th>
                      {this.props.intl.formatMessage({
                        id: 'archive:table-header:download'
                      })}
                    </th>
                    <th>
                      {this.props.intl.formatMessage({
                        id: 'archive:table-header:map'
                      })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.dates.map(d => (
                    <ArchiveItem
                      key={d.getTime()}
                      date={d}
                      lang={window['appStore'].language}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
        <div>{new Parser().parse(this.state.content)}</div>
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding" />
        )}
      </div>
    )
  }
}

export default inject('locale')(injectIntl(observer(Archive)))
