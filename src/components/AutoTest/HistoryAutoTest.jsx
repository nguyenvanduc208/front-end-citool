import React, { Component, Fragment } from "react";
import History from "../Style/History/History";
import { orderBy } from 'lodash';
import { adminLayout, logsAutoTest } from "../../config"
import { getAutotestTask } from "../../api";
import { tokenName } from "../../api/const";
import { STATUS } from '../../api/const';
import { Link } from "react-router-dom";
import Loader from 'react-loader-spinner';
import SweetAlert from 'sweetalert-react';


class AutoTestList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
            showAlert: false,
            statusPopup: false,
            idAlert: '',
            users: [],
            responseDetail: [],
        };
        
        this.deleteRecord = this.deleteRecord.bind(this);

        this.columns = [
            {
                key: "git_url",
                text: "Repository URL",
                className: "git_url",
                align: "center",
                sortable: true,
                width: 300,
            },
            {
                key: "branch",
                text: "Branch",
                className: "branch",
                align: "center",
                sortable: true,
                width: 150,
            },
            {
                key: "timestamp",
                text: "Start Time",
                className: "timestamp",
                align: "center",
                sortable: true,
                width: 120,
                cell: record => {
                    return (
                        <span>
                          {record.timestamp}
                        </span>
                    )
                }
            },
            {
                key: "status",
                text: "Status",
                className: "status",
                width: 100,
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        <div>
                            {
                                {
                                    'PENDING': <div>
                                                    <i className="fa fa-stop-circle pending-status"></i>
                                                    <span className="pending-status">{record.status}</span>
                                                </div>,
                                    'RUNNING': <div>
                                                    <i className="fa fa-hourglass-half running-status"></i>
                                                    <span className="running-status">{record.status}</span>
                                                </div>,
                                    'COMPLETED': <div>
                                                    <i className="fa fa-check-circle complete-status"></i>
                                                    <span className="complete-status">{record.status}</span>
                                                </div>,
                                    'ERROR': <div>
                                                <i className="fa fa-exclamation-circle error-status"></i>
                                                <span className="error-status">{record.status}</span>
                                            </div>,
                                } [record.status]
                            }
                        </div>
                    )
                }
            },
            {
                key: "log",
                text: "Log",
                className: "log",
                sortable: true,
                align: "center",
                width: 80,
                cell: record => {
                    return (
                        <div>
                            {(record.status === STATUS.COMPLETED ) ? (
                                <div>
                                    <Link to={`${adminLayout + logsAutoTest}/${record.id}`}>
                                        <button className="btn btn-fill btn btn-info btn-sm"
                                                 onClick={() => window.location.href= `${adminLayout + logsAutoTest}/${record.id}` }
                                             >
                                            Show Detail
                                        </button>
                                    </Link>
                                </div>
                                ) : ((record.status === STATUS.RUNNING || record.status === STATUS.PENDING) &&
                                       <Loader type="ThreeDots" color="#00C6E7" height={20} width={50}/>
                                )
                            }
                        </div>
                    )
                }
            },
            {
                key: "report",
                text: "Report",
                className: "report",
                sortable: true,
                align: "center",
                width: 80,
                cell: record => {
                    return (
                        <div>
                            {(record.status === STATUS.COMPLETED ) ? (
                                <div style={{display: "inline-flex"}}>
                                    {record.sub_tasks.map((subTask, key) => {
                                        return (
                                            <Link to={`${subTask.link}`} style={{paddingRight: "5px"}} target="_blank">
                                                <button className="btn btn-fill btn btn-success btn-sm">
                                                    {subTask.browser}
                                                </button>
                                            </Link>
                                        )
                                    })}
                                </div>
                                ) : ((record.status === STATUS.RUNNING || record.status === STATUS.PENDING) &&
                                       <Loader type="ThreeDots" color="#00C6E7" height={20} width={50}/>
                                )
                            }
                        </div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 50,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <Fragment>
                            <button className="btn btn-danger btn-sm" onClick={() => this.ShowAlert(record)}>
                                <i className="glyphicon glyphicon-trash fa fa-trash"></i>
                            </button>
                            <SweetAlert
                                show={this.state.showAlert}
                                title="Delete Record?"
                                text="You cannot undo this action"
                                showCancelButton
                                onOutsideClick={() => this.setState({showAlert: false})}
                                onEscapeKey={() => this.setState({showAlert: false})}
                                onCancel={() => this.setState({showAlert: false})}
                                onConfirm={() => this.deleteRecord()}
                            />

                        </Fragment>
                    );
                }
            }
        ];

        this.config = {
            key_column: 'id',
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Records",
            no_data_text: 'No data available!',
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: {
                    first: "First",
                    previous: <span>&#9668;</span>,
                    next: <span>&#9658;</span>,
                    last: "Last"
                }
            },
            pagination: "basic", //advance
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.extraButtons = [
            {
                className: "btn btn-primary buttons-pdf",
                title: "Export Test",
                children: [
                    <span>
                    <i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
                  </span>
                ],
            },
            {
                className: "btn btn-primary buttons-pdf",
                title: "Export Test",
                children: [
                    <span>
                    <i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
                  </span>
                ],
            },
        ];
    }

    //Show alert when delete record
    ShowAlert(record) {
        this.setState({
            showAlert: true,
            idAlert: record.id
        });
    }

    //Delete record
    deleteRecord() {
        let {idAlert, items} = this.state;
        const token = localStorage.getItem(tokenName);
        getAutotestTask(token, 'DELETE', null, `/${idAlert}`).then(res => {
            if (res.status === 204) {
                if (items.length > 0) {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].id === idAlert) {
                            items.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            this.setState({
                showAlert: false
            });
        });

    }

    // Load data the first time
    componentDidMount() {
        const token = localStorage.getItem(tokenName);
        getAutotestTask(token, 'GET', null).then(res => {
            this.timer = setTimeout(() => { this.setState({
                loading: false,
                items: res.data
            })
            }, 1000);

        });
    }

   // Update data response continuously
    componentDidUpdate() {
        const token = localStorage.getItem(tokenName);
        getAutotestTask(token, 'GET', null).then(res => {
            setTimeout(() => {
                this.setState({
                    loading: false,
                    items: res.data
                })
            }, 3000);
        });
        clearInterval(this.timer)
    }

    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }

    customSort(column, records, sortOrder) {
        return orderBy(records, [column], [sortOrder]);
    }

    render() {
        var { items } = this.state;
        return (
            <div>
                <History
                    className="table table-bordered table-striped custom-class"
                    config={this.config}
                    records={items}
                    columns={this.columns}
                    onPageChange={this.pageChange.bind(this)}
                    extraButtons={this.extraButtons}
                    loading={this.state.loading}
                    onSort={this.customSort}
                />
            </div>
        )
    };
}

export default AutoTestList;
