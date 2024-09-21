import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import { getStudents } from '../../../connector.js';  

class StudentTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            columnDefs: [
                { headerName: "Class", field: "classCode", sortable: true, filter: true, width: 230 },
                { headerName: "Name", field: "name", sortable: true, filter: true, width: 130 },
                { headerName: "Email", field: "email", sortable: true, filter: true, width: 230 },
                { headerName: "Role", field: "role", sortable: true, filter: true, width: 120 },
            ],
            defaultColDef: {
                sortable: true,
                filter: true,
            }
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
            />
        );
    }
}

export default StudentTable;
