import React from 'react';
import { Parser } from 'html-to-react';
import Base from './../base';
import PageHeadline from '../components/organisms/page-headline.jsx';

/*
 * Compontent to be used for pages with content delivered by CMS API.
 */
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
    const path = props.location.pathname.split('/');
    const site = (path.length > 0) ? path[path.length - 1] : '';

    // TODO: use subqueries to eleiminate the need of an additional API roundtrip: https://www.drupal.org/project/subrequests
    if(site) {
      window['staticPageStore'].loadPage(site).then((response) => {
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
        <PageHeadline title={this.state.title} />
        <section className="section-centered">
          {
            (new Parser()).parse(this.state.content)
          }
        </section>
        <section className="section-padding">
        </section>
      </div>
    );
  }
}
