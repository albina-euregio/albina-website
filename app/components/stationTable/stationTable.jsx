import React from 'react';
import StationTableHeader from './stationTableHeader';

export default class StationTable extends React.Component {
  constructor(props) {
    super(props);

    if(!$.DataTable) {
      $.DataTable = require('datatables.net');
    }

    const defaultRender = (data, type, full, meta) =>
      (data !== false) ? data : '-';

    this.columns = [
				{
          data:	"name",
					width: "150px",
					render:	(data, type, full, meta) =>
						"<strong>"
             + full.name
             + '</strong> <span class="region region-st">'
             + appStore.getRegionName(full.region)
             + '</span> <span class="datetime">'
             + full.date
             + "</span>",
					orderable: false,
					bSortable: false,
					className: "mb-station m-name"
        },
        {
          data:	"elev",
					width: "10px",
          className: "mb-snow m-altitude-1"
        },
				{
          data:	"snow",
          render: defaultRender,
          className: "mb-snow m-snowheight"
        },
				{
          data:	"snow24",
          render: defaultRender,
          className: "mb-snow m-24"
        },
				{
          data:	"snow48",
          render: defaultRender,
          className: "mb-snow m-48"
        },
				{
          data:	"snow72",
          render: defaultRender,
          className: "mb-snow m-72"
        },
				{
          data: "temp",
          render: defaultRender,
          className: "mb-temp m-ltnow"
        },
				{
          data:	"temp_max",
          render: defaultRender,
          className: "mb-temp m-ltmax"
        },
				{
          data:	"temp_min",
          render: defaultRender,
          className: "mb-temp m-ltmin"
        },
				{
          data:	"wdir",
					render:	(data, type, full, meta) =>
            (full.wdir) ? full.wdir + " (" +full.x_wdir + ")" : "-",
          className: "mb-wind m-winddir"
        },
				{
          data:	"wspd",
          render: defaultRender,
          className: "mb-wind m-windspeed"
        },
				{
          data:	"wgus",
          render: defaultRender,
          className: "mb-wind m-windmax"
        }
			];

      this.columnGroups = {
        snow: {
          active: true,
          columnNumbers: [2,3,4,5]
        },
        temp: {
          active: true,
          columnNumbers: [6,7,8]
        },
        wind: {
          active: true,
          columnNumbers: [9,10,11]
        }
      };

      this.regionFilter = null;
      this.searchText = '';
      this.sortValue = '';
      this.sortDir = '';
  }

  componentDidMount() {
    $(this.refs.main).DataTable({
      dom: '<"data-table-wrapper"t>',
      scrollY: "25em",
      deferRender: true,
			lengthChange: false,
			paging: false,
			info: false,
			rowId: "id",
			fixedHeader:true,
			fixedColumns: {
				heightMatch:'none'
			},
      data: this.props.data,
      columns: this.columns,
      ordering: false
    });
  }

  componentDidUpdate() {
    const table =
      $('.data-table-wrapper')
        .find('table')
        .DataTable();

    if(table) {
      table.clear();
      table.rows.add(this._applyFiltersAndSorting(table, this.props.data));
      table.draw();
    }
  }

  componentWillUnmount() {
    $('.data-table-wrapper')
      .find('table')
      .DataTable()
      .destroy(true);
  }

  shouldComponentUpdate(nextProps) {
    const shouldRegionFilterUpdate =
      ((nextProps.activeRegion == 'all') && (this.regionFilter != null))
        || (nextProps.activeRegion != this.regionFilter);

    const shouldSearchFilterUpdate =
      (nextProps.searchText != this.searchText);

    const shouldSortingUpdate =
      (nextProps.sortDir != this.sortDir)
      || (nextProps.sortValue != this.sortValue);

    return this.props.data.length != nextProps.data.length
      || this._shoudColumnGroupsUpdate()
      || shouldRegionFilterUpdate
      || shouldSearchFilterUpdate
      || shouldSortingUpdate;
  }

  _shoudColumnGroupsUpdate() {
    return Object.keys(this.props.activeData)
        .map(id => this.props.activeData[id] != this.columnGroups[id].active)
        .reduce((acc, el) => acc || el, false);
  }

  _applyFiltersAndSorting(table, originalData) {
    const filters = [];

    // sorting
    if(this.props.sortValue) {
      filters.push((data) => data.sort((val1,val2) => {
        const order = (this.props.sortDir == 'asc') ? [-1, 1] : [1, -1];
        const a = val1[this.props.sortValue];
        const b = val2[this.props.sortValue];

        if(a == b) {
          return 0;
        }
        if(typeof(b) === 'undefined' || b === false || b === null) {
          return order[1];
        }
        if(typeof(a) === 'undefined' || a === false || a === null) {
          return order[0];
        }
        return (a < b) ? order[0] : order[1];
      }));

      this.sortDir = this.props.sortDir;
      this.sortValue = this.props.sortValue;
    }

    // hide filters
    if(this._shoudColumnGroupsUpdate()) {
      Object.keys(this.columnGroups).forEach((e) => {
        if(this.props.activeData[e] != this.columnGroups[e].active) {
          if(this.props.activeData[e]) {
            table.columns(this.columnGroups[e].columnNumbers).visible(true);
          } else {
            table.columns(this.columnGroups[e].columnNumbers).visible(false);
          }
          this.columnGroups[e].active = this.props.activeData[e];
        }
      });
    }

    // region filter
    if(Object.keys(window.appStore.regions).indexOf(this.props.activeRegion) >= 0) {
      filters.push((data) => data.filter(row => (row.region == this.props.activeRegion)));
      this.regionFilter = this.props.activeRegion;
    } else {
      this.regionFilter = null;
    }

    // searchText
    if(this.props.searchText != this.searchText) {
      // do not use filtering but datatables' search function - search filter
      // depends on the rendered content
      table.search(this.props.searchText);
      this.searchText = this.props.searchText;
    }


    if(filters.length > 0) {
      // compose filters into a single function [f(x), g(x)] => f(g(x))
      const composedFilter = filters.reduce((f,g) => (data => f(g(data))));
      return composedFilter(originalData);
    }
    return originalData;
  }

  render() {
    return (
      <table ref="main" className="pure-table pure-table-striped pure-table-small table-measurements">
        <StationTableHeader
          handleSort={this.props.handleSort}
          sortValue={this.props.sortValue}
          sortDir={this.props.sortDir} />
      </table>
    );
  }
}
