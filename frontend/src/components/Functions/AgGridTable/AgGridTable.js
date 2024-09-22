import React from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './AgGridTable.css';

const AgGridTable = ({ rowData, columnDefs, defaultColDef, domLayout, suppressHorizontalScroll }) => (
    <div className="ag-body">
        <div className="page-container ag-theme-alpine">
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                domLayout={domLayout}
                suppressHorizontalScroll={suppressHorizontalScroll}
            />
        </div>
    </div>
);

export default AgGridTable;
