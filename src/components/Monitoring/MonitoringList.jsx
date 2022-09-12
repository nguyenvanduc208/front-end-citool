import React, {Component, Fragment} from 'react';
import History from '../Style/History/History';
import {orderBy} from 'lodash';
import SweetAlert from 'sweetalert-react';
import '../../assets/css/sweetalert.css';
import {getMonitoringList, getMonitoringTask, getMonitoringResult} from "../../api";
import {STATUS} from '../../api/const'
import {tokenName} from "../../api/const";
import {errorNoti} from "../Notifi";
import {detailUrlMonitoring, adminLayout} from "../../config";
import {Link} from "react-router-dom";

class MonitoringList extends Component {
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
                key: "sitename",
                text: "Site Name",
                className: "sitename",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "url",
                text: "URL",
                className: "url",
                align: "left",
                sortable: true,
                width: 300,
            },
            {
                key: "timestamp",
                text: "Start Time",
                className: "timestamp",
                sortable: true,
                width: 150
            },
            {
                key: "status",
                text: "Status In 24h",
                className: "status",
                width: 100,
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <div>
                            {
                                {
                                    'OK': <div>
                                                    <i className="fa fa-check-circle complete-status"></i>
                                                    <span className="complete-status">{record.status}</span>
                                                </div>,
                                    'NG': <div>
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
                width: 100,
                align: "left",
                cell: record => {
                    return (
                        <div>
                            <Link to={`${adminLayout + detailUrlMonitoring}/${record.id}`}>
                                <button className="btn btn-fill btn btn-info btn-sm"
                                        onClick={() => window.location.href = `${adminLayout + detailUrlMonitoring}/${record.id}`}
                                >
                                    Show Detail
                                </button>
                            </Link>
                        </div>
                        // <div>
                        //     {(record.status ==="COMPLETED" ) ? (
                        //         <div>
                        //             <Link to={`${adminLayout+detailUrlMonitoring}/${record.id}`}>
                        //                 <button className="btn btn-fill btn btn-info btn-sm"
                        //                          onClick={() => window.location.href= `${adminLayout+detailUrlMonitoring}/${record.id}` }
                        //                      >
                        //                     Show Detail
                        //                 </button>
                        //             </Link>
                        //         </div>
                        //         ) : ( record.status === STATUS.RUNNING &&
                        //             <Loader type="ThreeDots" color="#00C6E7" height={20} width={50}/>
                        //         )
                        //     }
                        // </div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 50,
                align: "left",
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
        getMonitoringList(token).then(resList => {
            this.timer = setTimeout(() => {
                resList.data.map((item,key) => {
                    getMonitoringResult(token, item.id, 'GET', null).then(res => {
                        if (res.status === 200) {
                            resList.data[key].status = res.data.success_percent == '100.0%' ? 'OK' : 'NG';
                        }
                    });
                });
                this.setState({
                    loading: false,
                    items: resList.data
                })
            }, 1000);
        });
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
        const token = localStorage.getItem(tokenName);
        let {idAlert, items} = this.state;
        getMonitoringTask(token, `/${idAlert}`, 'DELETE', null)
            .then(res => {
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

    // Close Popup Detail
    closeModal() {
        this.setState({
            statusPopup: false
        });
    }

    render() {
        let {items} = this.state;
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

export default MonitoringList;