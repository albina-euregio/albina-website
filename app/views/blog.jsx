import React from 'react';
import Base from './../base';
import PageHeadline from '../components/organisms/page-headline.jsx';
import { parseDate, dateToDateTimeString } from '../util/date.js';

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this._fetchData();
  }

  componentDidMount() {
    this._fetchData();
  }

  _makeAbstract(html) {
    // TODO: cut of at end of first paragraph
    const text = html.replace(/<\/?[^>]+(>|$)/g, '');

    if(text.length > 100) {
      return text.substr(0, 400) + ' ...';
    }
    return text;
  }

  _fetchData() {
    const blogs = config.get('blogs');
    const blog = blogs[0];
    const url = 'https://www.googleapis.com/blogger/v3/blogs/' + blog.params.id + '/posts?key=' + config.get('apiKeys.google');

    Base.doRequest(url).then(
      response => {
        const responseParsed = JSON.parse(response);
        this.setState({
          posts: responseParsed.items
        });
      }
    );
  }

  getImageFromContent(html) {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(html, 'text/html');
    const img = parsedHtml.querySelector('img');
    return img ? img.src : '';
  }

  render() {
    return (
      <div>
        <PageHeadline title="Blog posts" subtitle="Blog" marginal="" />
        <section className="section-padding-height section-blog-posts">
          <div className="section-centered">
            {this.state.posts.map((item, i) => {
              const img = this.getImageFromContent(item.content);
              return (
                <a key={i} className="linkbox linkbox-blog-feature" href={item.url} >
                  <div className="content-image">
                    {
                      img && <img src={img} />
                    }
                  </div>
                  <div className="content-text">
                    <ul className="list-inline blog-feature-meta">
                      <li className="blog-author">{item.author.displayName}</li>
                      <li className="blog-date">{dateToDateTimeString(parseDate(item.published))}</li>
                      <li className="blog-province">Tirol</li>
                      <li className="blog-language">DE</li>
                    </ul>
                    <h1 className="subheader blog-feature-title">{item.title}</h1>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    );
  }
}
