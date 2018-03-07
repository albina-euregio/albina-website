import React from 'react';
import { Parser } from 'html-to-react';
import Base from './../base';

export default class StaticPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: ''
    }
  }
  
  componentWillReceiveProps(nextProps) {
    this._fetchData(nextProps);
  }

  componentDidMount() {
    this._fetchData(this.props);
  }

  _fetchData(props) {
    const path = props.route.path.split('/');
    const site = (path.length > 0) ? path[path.length - 1] : '';
    const lang = 'de'; // TODO: fix hardcoded lang

    // TODO: use subqueries to eleiminate the need of an additional API roundtrip: https://www.drupal.org/project/subrequests    
    if(site) {
      Base.doRequest(config.get('apis.content') + 'router/translate-path?_format=json&path=/' + site).then(response => {
        // query id by url-alias
        const responseParsed = JSON.parse(response);
        return responseParsed.entity.uuid;
      }).then(id => {
        // query page content by id
        const langParam = (!lang || (lang == 'en')) ? '' : (lang + '/');
        const url = config.get('apis.content') + langParam + 'api/pages/' + id;
        return Base.doRequest(url);
      }).then(response => {
        // parse content
        const responseParsed = JSON.parse(response);
        this.setState({
          title: responseParsed.data.attributes.title,
          content: responseParsed.data.attributes.body
        });
      });
    }
  }
  
  render() {
    return (
      <div>
        <div className="content-wrapper">
          <h1 className="title">{this.state.title}</h1>
          <div className="content">
            { 
              (new Parser()).parse(this.state.content) 
            }
          </div>
        </div>
      </div>
    );
  }
}
