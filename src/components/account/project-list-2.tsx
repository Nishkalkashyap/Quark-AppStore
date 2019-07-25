import { Component } from "react";
import { basePropType } from "../login/editProfile";
import { getProjectsCollectionPath } from "../../data/paths";
import React from 'react';
import { TablePagination } from "@material-ui/core";
import { ProjectData } from "../../interfaces";


interface QueryConfig {
    path: string;
    limit: number;
}

export class ProjectsList extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);
        this.lastQuery = this.props.firebase.firestore
            .collection(this.query.path)
            .limit(this.query.limit)
    }

    state = {
        page: 0,
        dense: false,
        rowsPerPage: 5,
        selected: [] as string[],
        rows: [] as ProjectData[]
    }

    handleSelectAllClick(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) {
            const newSelecteds = this.state.rows.map(n => n.projectName);
            // setSelected(newSelecteds);
            this.setState({ selected: newSelecteds });
            return;
        }
        // setSelected([]);
        this.setState({ selected: [] })
    }

    handleClick(event: React.MouseEvent<unknown>, name: string) {
        const selectedIndex = this.state.selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.state.selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.state.selected.slice(1));
        } else if (selectedIndex === this.state.selected.length - 1) {
            newSelected = newSelected.concat(this.state.selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                this.state.selected.slice(0, selectedIndex),
                this.state.selected.slice(selectedIndex + 1),
            );
        }

        // setSelected(newSelected);
        this.setState({ selected: newSelected });
    }

    handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
        // setRowsPerPage(+ event.target.value);
        // setPage(0);
        this.setState({ page: 0, rowsPerPage: + event.target.value });
    }

    handleChangeDense(event: React.ChangeEvent<HTMLInputElement>) {
        // setDense(event.target.checked);
        this.setState({ dense: event.target.checked });
    }

    handleChangePage(event: unknown, newPage: number) {
        // setPage(newPage);
        this.setState({ page: newPage });
    }



    lastQuery: firebase.firestore.Query;

    query: QueryConfig = {
        path: getProjectsCollectionPath(this.props.firebase.auth.currentUser!.uid),
        limit: 10
    }

    render() {
        return (
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={this.state.rows.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                    'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
        );
    }
}