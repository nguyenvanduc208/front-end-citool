import React, {Component, Fragment} from 'react';
import History from './History/History';
import {orderBy} from 'lodash';
import SweetAlert from 'sweetalert-react';
import '../../assets/css/sweetalert.css';
import {getDastTask, getDastReport} from "../../api"
import {tokenName} from "../../api/const";
import { STATUS } from '../../api/const'
import {errorNoti} from "../Notifi";
import {detail, adminLayout, detailDast} from "../../config";
import {Link} from "react-router-dom";
import Loader from 'react-loader-spinner'

class DashHistory extends Component {
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
        this.downloadDastReport = this.downloadDastReport.bind(this);
        this.columns = [
            {
                key: "target_url",
                text: "Website URL",
                className: "target_url",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "target_type",
                text: "Scan Target",
                className: "scan_target",
                align: "left",
                sortable: true,
                width: 100,
            },
            {
                key: "scan_type",
                text: "Scan Type",
                className: "scan_type",
                align: "left",
                sortable: true,
                width: 150,
            },
            {
                key: "created_at",
                text: "Start Time",
                className: "created_at",
                sortable: true,
                width: 150
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
                                                    <i class="fa fa-stop-circle pending-status"></i>
                                                    <span class="pending-status">{record.status}</span>
                                                </div>,
                                    'RUNNING': <div>
                                                    <i class="fa fa-hourglass-half running-status"></i>
                                                    <span class="running-status">{record.status}</span>
                                                </div>,
                                    'COMPLETED': <div>
                                                    <i class="fa fa-check-circle complete-status"></i>
                                                    <span class="complete-status">{record.status}</span>
                                                </div>,
                                    'ERROR': <div>
                                                <i class="fa fa-exclamation-circle error-status"></i>
                                                <span class="error-status">{record.status}</span>
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
                            {(record.status ==="COMPLETED" ) ? (
                                <div>
                                    <Link to={`${adminLayout+detailDast}/${record.id}`}>
                                        <button className="btn btn-fill btn btn-info btn-sm"
                                                onClick={() => window.location.href= `${adminLayout+detailDast}/${record.id}` }
                                        >
                                            Show Detail
                                        </button>
                                    </Link>
                                </div>
                                ) : ( record.status === STATUS.RUNNING &&
                                    <Loader type="ThreeDots" color="#00C6E7" height={20} width={50}/>
                                )
                            }
                        </div>
                    )
                }
            },
            {
                key: "report",
                text: "HTML report",
                className: "report",
                sortable: true,
                width: 100,
                align: "center",
                cell: record => {
                    return (
                        <div>
                            {(record.status ==="COMPLETED" ) ? (
                                <div>
                                    <button className="btn btn-fill btn btn-info btn-sm"
                                            onClick={() => this.downloadDastReport(record.id)}
                                    >
                                    Download
                                    </button>
                                </div>
                                ) : ( record.status === STATUS.RUNNING &&
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
                title: "Export TEst",
                children: [
                    <span>
                    <i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
                  </span>
                ],
            },
            {
                className: "btn btn-primary buttons-pdf",
                title: "Export TEst",
                children: [
                    <span>
                    <i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
                  </span>
                ],
            },
        ]
    }

    // load data the first time
    componentDidMount() {
        const token = localStorage.getItem(tokenName);
        getDastTask(token, 'GET', null).then(res => {
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
        getDastTask(token, 'GET', null).then(res => {
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
        getDastTask(token, 'DELETE', null, `/${idAlert}`).then(res => {
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


    // Download Report from S3
    // const downloadDastReport  = () => {
    downloadDastReport (id) {
        const token = localStorage.getItem(tokenName);
        console.log ('downloadDastReport');
        console.log (id); 
        getDastReport(token, 'GET', null, id).then(res => {
            if (res.status === 200) {
                let exportedFilename = 'detail' + '.csv' || 'export.csv';
                let downloadLink = document.createElement("a");
                // Create a link to the file
                downloadLink.setAttribute('href', res.data.download_link);
                // Setting the file name
                downloadLink.download = exportedFilename;
                //triggering the function
                downloadLink.click();
                downloadLink.remove();
            }
        }).catch(err => {
            if (err.response.status === 401) {
                window.location = '/login';
            }else {
                return Promise.reject(err);
            }
        })
    }

    // getDownloadDashFileLink (id) {
    //     const token = localStorage.getItem(tokenName);
    //     console.log ('getDownloadDashFileLink');
    //     console.log (id);
    //     getDastReport(token, 'GET', null, id).then(res => {
    //         if (res.status === 200) {
    //             let exportedFilename = 'detail' + '.csv' || 'export.csv';
    //             let downloadLink = document.createElement("a");
    //             // Create a link to the file
    //             downloadLink.setAttribute('href', res.data.download_link);
    //             downloadLink.setAttribute('target', "_blank");
    //             // Setting the file name
    //             //downloadLink.download = exportedFilename;
    //             //triggering the function
    //             console.log (downloadLink);
    //             downloadLink.click();
    //             downloadLink.remove();
    //         }
    //     }).catch(err => {
    //         if (err.response.status === 401) {
    //             window.location = '/login';
    //         }else {
    //             return Promise.reject(err);
    //         }
    //     })
    // }

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

export default DashHistory;