import React, { Component } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './AgGridTable.css';

class AgGridTable extends Component {
    render() {
        const { rowData, columnDefs, defaultColDef } = this.props;

        return (
            <div className="body">
                <div className="page-container ag-theme-alpine" style={{ width: '50%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                    />
                </div>
            </div>
        );
    }
}

export default AgGridTable;
