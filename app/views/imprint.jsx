import React from 'react';
import { Parser } from 'html-to-react';
import Base from './../base';

export default class Imprint extends React.Component {
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
    Base.doRequest(
      'http://localhost/projects/albina-cms/web/de/api/pages/3d2bbb37-0a0d-423f-876c-1ea570da282b',
      response => {
        const responseParsed = JSON.parse(response);
        this.setState({
          title: responseParsed.data.attributes.title,
          content: responseParsed.data.attributes.body
        });
      }
    );
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
