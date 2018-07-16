import React from 'react';
import PageHeadline from '../components/organisms/page-headline';
import FilterBar from '../components/organisms/filter-bar';
import ProvinceFilter from '../components/filters/province-filter';
import LabelListFilter from '../components/filters/label-list-filter';

export default class StationMeasurements extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <PageHeadline title="Station Measurements" subtitle="Snow &amp; Weather" />
        <FilterBar search={true} searchTitle="Search for station">
          <ProvinceFilter />
          <LabelListFilter title="Hide" labels={{
            'snow_height': 'Schneehöhe',
            'temperature': 'Temperatur',
            'wind': 'Wind'
          }} />
        </FilterBar>
        <section className="section">
          <div className="table-container">

          </div>
        </section>
      </div>
    );
  }
}
