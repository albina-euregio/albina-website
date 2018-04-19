import React from 'react';
import Base from './../base';

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this._fetchData(nextProps);
  }

  componentDidMount() {
    this._fetchData(this.props);
  }
  
  _makeAbstract(html) {
  	// TODO: cut of at end of first paragraph
    const text = html.replace(/<\/?[^>]+(>|$)/g, "");
     
  	if(text.length > 100) {
  		return text.substr(0, 400) + ' ...';
  	}
  	return text;
  }

  _fetchData(props) {
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

  render() {
    return (
      <div>
        <div className="content-wrapper">
          <h1 className="title">Blog</h1>
          <div className="content">
            {this.state.posts.map((newItem, ni) => {
              return (
                <article key={ni} className="message">
                  <div className="message-header">
                    <p>
                      {newItem.title}
                    </p>
                  </div>
                  <div className="message-body">
                    { this._makeAbstract(newItem.content) }
                    <br />
                    <span className="continue">
                    	<a href={newItem.url} target="_blank">Continue Reading &raquo;</a>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
