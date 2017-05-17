import React from 'react';
import SubNavigation from './../components/subnavigation';
import Base from './../base';

export default class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this._fetchData(nextProps)
  }

  componentDidMount() {
    this._fetchData(this.props)
  }

  _fetchData(props) {
    Base.doRequest('http://212.47.231.185:8080/albina/api/news?from=1900-01-01T01%3A00%3A00%2B01%3A00&until=2020-01-01T01%3A00%3A00%2B01%3A00', (response) => {
      const responseParsed = JSON.parse(response);
      this.setState({
        news: responseParsed.sort((new1, new2) => {
          const new1Date = new Date(new1.date);
          const new2Date = new Date(new2.date);
          return new1Date.valueOf() < new2Date.valueOf();
        })
      })
    })
  }


  _sublinks() {
    return [
      {url: '2016', label: '2016'},
      {url: '2017', label: '2017'},
    ]
  }

  render() {
    console.log(this.state.news);
    return (
      <div>
        <SubNavigation sublinks={this._sublinks()} viewPath="/news/" />
        <h1 className="title">NEWS</h1>
        <div className="content">
        {
          this.state.news.map((newItem, ni) => {
            return (
              <article key={ni} className="message">
                <div className="message-header">
                  <p>{newItem.title.find(t => t.languageCode === 'en').text}</p>
                </div>
                <div className="message-body">
                  {newItem.content.find(t => t.languageCode === 'en').text}
                </div>
              </article>
            )
          })
        }
        </div>
      </div>
    );
  }
}
