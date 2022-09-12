import React, { Component, Fragment } from 'react';
import History from "../Style/History/History";
import { orderBy } from 'lodash';
import SweetAlert from 'sweetalert-react';
import '../../assets/css/sweetalert.css';
import { getTaskResult, getLocCount } from "../../api";
import { STATUS } from '../../api/const';
import { tokenName } from "../../api/const";
import { errorNoti } from "../Notifi";
import { adminLayout, detailCloc } from "../../config";
import { Link } from "react-router-dom";
import Loader from 'react-loader-spinner';

class HistoryCloc extends Component {
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
                width: 280,
            },
            {
                key: "branch",
                text: "Branch",
                className: "branch",
                align: "center",
                sortable: true,
                width: 120,
            },
            {
                key: "comparison",
                text: "Comparison",
                className: "comparison",
                align: "center",
                sortable: true,
                width: 50,
                cell: record => {
                    return (
                        <span>
                            {this.getComparison(
                                record.compared_branch1,
                                record.compared_branch2,
                                record.commit_id1,
                                record.commit_id2)
                            }
                        </span>
                    )
                }
            },
            {
                key: "timestamp",
                text: "Start Time",
                className: "timestamp",
                align: "center",
                sortable: true,
                width: 150,
                cell: record => {
                    return (
                        <span>
                          {record.created_at}
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
                key: "report",
                text: "Report",
                className: "report",
                sortable: true,
                align: "center",
                width: 100,
                cell: record => {
                    return (
                        <div>
                            {(record.status === STATUS.COMPLETED ) ? (
                                <div>
                                    <Link to={`${adminLayout+detailCloc}/${record.id}`}>
                                        <button className="btn btn-fill btn btn-info btn-sm"
                                                // onClick={<Redirect to={`${adminLayout+detail}/${record.id}`}/>}
                                                 onClick={() => window.location.href= `${adminLayout+detailCloc}/${record.id}` }
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

    // Comparison
    getComparison(branch1, branch2, commit1, commit2) {
        if (!!branch1 && !!branch2) {
            return "Two branch";
        } else if (!!commit1 && !!commit2) {
            return "Two commit";
        } else {
            return "None";
        }
    }

    // Load data the first time
    componentDidMount() {
        const token = localStorage.getItem(tokenName);
        getLocCount(token, 'GET', null).then(res => {
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
        getLocCount(token, 'GET', null).then(res => {
            setTimeout(() => {
                this.setState({
                    loading: false,
                    items: res.data
                })
            }, 3000);
        });
        clearInterval(this.timer)
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
        getLocCount(token,'DELETE',null,`/${idAlert}`).then(res => {
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

    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }

    customSort(column, records, sortOrder) {
        return orderBy(records, [column], [sortOrder]);
    }

    // Open Popup Detail
    showDetail(record) {
        // call ajax load Detail task result
        const tokenUser = localStorage.getItem(tokenName);
        getTaskResult(tokenUser,record.id)
        .then(res => {
            if(res.status === 200) {
                this.setState({
                    statusPopup: true,
                    responseDetail: res.data
                })
            }
        })
        .catch(e => {
          errorNoti("invalid Detail")
        })
    }


    render() {
        var {items} = this.state;
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
    }
}

export default HistoryCloc;