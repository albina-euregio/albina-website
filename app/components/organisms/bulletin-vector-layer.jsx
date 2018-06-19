import React from 'react';
import { observer } from 'mobx-react';
import { GeoJSON } from 'react-leaflet';

@observer
export default class BulletinVectorLayer extends React.Component {
  componentDidMount(props) {
    this.layer = this.refs.feature.leafletElement;
  }

  get uniqueKey() {
    const problemKeys = Object.keys(bulletinStore.problems).sort();
    const problemHash = problemKeys.reduce((acc, p) => {
      return acc * 2 + (bulletinStore.problems[p].active ? 1 : 0);
    }, 0);
    return bulletinStore.settings.date + problemHash;
  }

  render() {
    return (
      <GeoJSON
        ref="feature"
        key={this.uniqueKey}
        data={this.props.data}
        onClick={(e) => { this.props.handleSelectFeature(e) }}
        onMouseOver={(e) => { this.props.handleHighlightFeature(e) }}
        onMouseOut={() => {this.props.handleHighlightFeature(null)}}  />
    );
  }
}
