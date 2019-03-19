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
          data: "region",
					visible: false
        },
				{
          data: "name",
					visible: false
        },
				{
          data:	"name",
					width: "150px",
					render:	(data, type, full, meta) =>
						"<div class='meta'><strong>"
             + full.name
             + "</strong> <span class='region'>"
             + appStore.getRegionName(full.region)
             + "</span> <span class='date'>"
             + full.date
             + "</span></div>",
					orderable: false,
					bSortable: false,
					className: "meta"
        },
        {
          data:	"elev",
					width: "10px"
        },
				{
          data:	"snow",
          render: defaultRender
        },
				{
          data:	"snow24",
          render: defaultRender
        },
				{
          data:	"snow48",
          render: defaultRender
        },
				{
          data:	"snow72",
          render: defaultRender,
          className: "border-right"
        },
				{
          data: "temp",
          render: defaultRender
        },
				{
          data:	"temp_max",
          render: defaultRender
        },
				{
          data:	"temp_min",
          render: defaultRender,
          className: "border-right"
        },
				{
          data:	"wdir",
					render:	(data, type, full, meta) =>
            (full.wdir) ? full.wdir + " (" +full.x_wdir + ")" : "-"
        },
				{
          data:	"wspd",
          render: defaultRender
        },
				{
          data:	"wgus",
          render: defaultRender
        },
				{
          defaultContent:	"",
					orderable: false,
					bSortable: false,
					width: "auto"
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
      order: [[ 0, 'asc' ],[1,'asc']],
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
      <table ref="main" />
    );
  }
}
