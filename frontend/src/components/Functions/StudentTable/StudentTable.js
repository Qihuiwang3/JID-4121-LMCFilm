import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import { getStudents } from '../../../connector.js';  

class StudentTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            columnDefs: [
                { headerName: "Class", field: "classCode", flex: 1 },
                { headerName: "Name", field: "name", flex: 1 },
                { headerName: "Email", field: "email", flex: 1 },
                { headerName: "Role", field: "role", flex: 1 },
            ]
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const records = await getStudents();
            this.setState({ records });
        } catch (error) {
            console.error("Error loading records:", error);
        }
    };

    render() {
        return (
            <AgGridTable
                rowData={this.state.records}
                columnDefs={this.state.columnDefs}
                defaultColDef={this.state.defaultColDef}
                domLayout="autoHeight"
                suppressHorizontalScroll={true}
            />
        );
    }
}

export default StudentTable;
