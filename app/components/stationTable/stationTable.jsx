import React from 'react';

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
  }

  componentDidMount() {
    $(this.refs.main).DataTable({
      dom: '<"data-table-wrapper"t>',
      scrollY: "25em",
			scrollX: true,
			scrollCollapse: true,
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
      ordering: true
    });
  }

  componentDidUpdate() {
    const table =
      $('.data-table-wrapper')
        .find('table')
        .DataTable();

    table.clear();
    table.rows.add(this.props.data);
    table.draw();
  }

  componentWillUnmount() {
    $('.data-table-wrapper')
      .find('table')
      .DataTable()
      .destroy(true);
  }

  render() {
    return (
      <table ref="main" className="pure-table pure-table-striped pure-table-small table-measurements">
        {this.props.header}
      </table>
    );
  }
}
