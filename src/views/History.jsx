import React, {Component, Fragment} from 'react';
import {
  Grid,
  Table,
  Row, 
  Col
} from "react-bootstrap";
import Loader from 'react-loader-spinner'
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { STATUS } from 'api/const'
import {detail, adminLayout, detailCloc} from "../config";
import callApiScanTask, { getOverview, getRecentTasks, getDastReport, getDastTask, getLocCount } from "api"
import { tokenName } from "api/const";
import {Link} from "react-router-dom";
import SweetAlert from 'sweetalert-react';

class History extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showDASTAlert: false,
      showSASTAlert: false,
      showCLOCAlert: false,
      idAlert: '',
      overview: [],
      recentTasks: []
    };
  }

  // load data the first time
  componentDidMount() {
    const token = localStorage.getItem(tokenName);

    getOverview(token, 'GET', null).then(res => {
        this.timer = setTimeout(() => { this.setState({
            loading: false,
            overview: res.data
        })
        }, 1000);
    });

    getRecentTasks(token, 'GET', null).then(res => {
      this.timer = setTimeout(() => { this.setState({
          loading: false,
          recentTasks: res.data
      })
      }, 1000);
    });
  }

  // Update data response continuously
  componentDidUpdate() {
    const token = localStorage.getItem(tokenName);

    getOverview(token, 'GET', null).then(res => {
      setTimeout(() => {
          this.setState({
              loading: false,
              overview: res.data
          })
      }, 3000);
    });

    getRecentTasks(token, 'GET', null).then(res => {
        setTimeout(() => {
            this.setState({
                loading: false,
                recentTasks: res.data
            })
        }, 3000);
    });

    clearInterval(this.timer)
  }

  // Download Report from S3
  downloadDastReport (id) {
    const token = localStorage.getItem(tokenName);
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

  //Show alert when delete record
  ShowDASTAlert(record) {
    this.setState({
        showDASTAlert: true,
        idAlert: record.id
    });
  }
  ShowSASTAlert(record) {
    this.setState({
        showSASTAlert: true,
        idAlert: record.id
    });
  }
  ShowCLOCAlert(record) {
    this.setState({
        showCLOCAlert: true,
        idAlert: record.id
    });
  }

  //Delete SAST record
  deleteSASTRecord() {
    let {idAlert, recentTasks} = this.state;
    callApiScanTask(`/${idAlert}`, 'DELETE', null).then(res => {
        if (res.status === 204) {
            if (recentTasks.length > 0) {
                for (let i = 0; i < recentTasks.length; i++) {
                    if (recentTasks[i].id === idAlert) {
                        recentTasks.splice(i, 1);
                        break;
                    }
                }
            }
        }
        this.setState({
          showSASTAlert: false
        });
    });
  }

  //Delete DAST record
  deleteDASTRecord() {
    let {idAlert, recentTasks} = this.state;
    const token = localStorage.getItem(tokenName);
    getDastTask(token, 'DELETE', null, `/${idAlert}`).then(res => {
        if (res.status === 204) {
            if (recentTasks.length > 0) {
                for (let i = 0; i < recentTasks.length; i++) {
                    if (recentTasks[i].id === idAlert) {
                        recentTasks.splice(i, 1);
                        break;
                    }
                }
            }
        }
        this.setState({
          showDASTAlert: false
        });
    });
  }

  //Delete CLOC record
  deleteCLOCRecord() {
    let {idAlert, recentTasks} = this.state;
    const token = localStorage.getItem(tokenName);
    getLocCount(token,'DELETE',null,`/${idAlert}`).then(res => {
        if (res.status === 204) {
            if (recentTasks.length > 0) {
                for (let i = 0; i < recentTasks.length; i++) {
                    if (recentTasks[i].id === idAlert) {
                        recentTasks.splice(i, 1);
                        break;
                    }
                }
            }
        }
        this.setState({
          showCLOCAlert: false
        });
    });
  }

  render() {
    var { overview, recentTasks } = this.state;
    // const githubCount = (overview.repository !== undefined) ?  overview.repository.github : "";
    // const bitbucketCount = (overview.repository !== undefined) ?  overview.repository.bitbucket : "";
    // const gitlabCount = (overview.repository !== undefined) ?  overview.repository.gitlab : "";
    const repoSastCount = (overview.repository !== undefined) ?  overview.repository.sast_repo : "";
    const repoClocCount = (overview.repository !== undefined) ?  overview.repository.cloc_repo : "";
    const clocCount = (overview.cloc !== undefined) ?  overview.cloc.count : ""
    const sastCount = (overview.sast !== undefined) ?  overview.sast.count : ""
    const sastCriticalCount = (overview.sast !== undefined && overview.sast.critical !== undefined) ?  overview.sast.critical : ""
    const sastHightCount = (overview.sast !== undefined && overview.sast.high_risk !== undefined) ?  overview.sast.high_risk : ""
    const dastCount = (overview.dast !== undefined) ?  overview.dast.count : ""
    const dastCriticalCount = (overview.dast !== undefined && overview.dast.critical !== undefined) ?  overview.dast.critical : ""
    const dastHightCount = (overview.dast !== undefined && overview.dast.high_risk !== undefined) ?  overview.dast.high_risk : ""

    return (
      <div className="content">
        <Grid fluid>
        <Row>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-server text-warning" />}
                  statsText="Repositories"
                  statsValue= { (overview.repository !== undefined) ?  overview.repository.count : ""}
                  statsIcon={<i className="fa fa-clock-o" />}
                  statsIconText={"SAST: " + repoSastCount + ", CLOC: " + repoClocCount}
                />
              </Col>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-graph1 text-danger" />}
                  statsText="CLOC Count"
                  statsValue={clocCount}
                  statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Updated now"
                />
              </Col>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-wallet text-success" />}
                  statsText="SAST Scan"
                  statsValue={sastCount}
                  statsIcon={<i className="fa fa-bolt" />}
                  statsIconText={"Critical : " + sastCriticalCount + ", High Risk : " + sastHightCount}
                />
              </Col>
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className="pe-7s-lintern text-info" />}
                  statsText="DAST Scan"
                  statsValue={dastCount}
                  statsIcon={<i className="fa fa-bolt" />}
                  statsIconText={"Critical : " + dastCriticalCount + ", High Risk : " + dastHightCount}
                />
              </Col>
            </Row>
          <Card
            id="listTest"
            title="Recent Activities"
            content={
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Scan Type</th>
                    <th>Repository/Site URL</th>
                    <th>Branch</th>
                    <th>Start Time</th>
                    <th>Status</th>
                    <th>Detail</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {
                  recentTasks.map((task) => 
                    <tr key={task.id}>
                      <td>
                        <div>
                                {
                                    {
                                        'DAST': <div>
                                                    <span className="scan-type-dast">{task.scan_type}</span>
                                                </div>,
                                        'SAST': <div>
                                                    <span className="scan-type-sast">{task.scan_type}</span>
                                                </div>,
                                        'CLOC': <div>
                                                    <span className="scan-type-cloc">{task.scan_type}</span>
                                                </div>,
                                    } [task.scan_type]
                                }
                          </div>
                      </td>
                      <td>{task.url}</td>
                      <td>{task.branch}</td>
                      <td>{task.created_time}</td>
                      <td>
                        <div>
                              {
                                  {
                                      'PENDING': <div>
                                                      <i className="fa fa-stop-circle pending-status"></i>
                                                      <span className="pending-status">{task.status}</span>
                                                  </div>,
                                      'RUNNING': <div>
                                                      <i className="fa fa-hourglass-half running-status"></i>
                                                      <span className="running-status">{task.status}</span>
                                                  </div>,
                                      'COMPLETED': <div>
                                                      <i className="fa fa-check-circle complete-status"></i>
                                                      <span className="complete-status">{task.status}</span>
                                                  </div>,
                                      'ERROR': <div>
                                                  <i className="fa fa-exclamation-circle error-status"></i>
                                                  <span className="error-status">{task.status}</span>
                                              </div>,
                                  } [task.status]
                              }
                        </div>
                      </td>
                      <td>{
                        <div>
                            {
                              {
                                  'DAST': <div>
                                              {(task.status ==="COMPLETED" ) ? (
                                                  <div>
                                                      <button className="btn btn-fill btn btn-info btn-sm"
                                                              onClick={() => this.downloadDastReport(task.id)}
                                                      >
                                                      Download
                                                      </button>
                                                  </div>
                                                ) : ( task.status === STATUS.RUNNING &&
                                                  <Loader type="ThreeDots" color="#00C6E7" height={20} width={50}/>
                                                )
                                              }
                                          </div>,
                                  'SAST': <div>
                                              {(task.status ==="COMPLETED" ) ? (
                                                  <div>
                                                      <Link to={`${adminLayout+detail}/${task.id}`}>
                                                          <button className="btn btn-fill btn btn-info btn-sm"
                                                                  onClick={() => window.location.href= `${adminLayout+detail}/${task.id}` }
                                                              >
                                                              Show Detail
                                                          </button>
                                                      </Link>
                                                  </div>
                                                ) : ( task.status === STATUS.RUNNING &&
                                                  <Loader type="ThreeDots" color="#00C6E7" height={20} width={50}/>
                                                )
                                              }
                                          </div>,
                                  'CLOC': <div>
                                              {(task.status ==="COMPLETED" ) ? (
                                                  <div>
                                                      <Link to={`${adminLayout+detailCloc}/${task.id}`}>
                                                          <button className="btn btn-fill btn btn-info btn-sm"
                                                                  onClick={() => window.location.href= `${adminLayout+detailCloc}/${task.id}` }
                                                              >
                                                              Show Detail
                                                          </button>
                                                      </Link>
                                                  </div>
                                                ) : ( task.status === STATUS.RUNNING &&
                                                  <Loader type="ThreeDots" color="#00C6E7" height={20} width={50}/>
                                                )
                                              }
                                          </div>,
                              } [task.scan_type]
                          }
                        </div>
                      }
                      </td>
                      <td>{
                          <div>
                            {
                              {
                                  'DAST': <div>
                                              {<Fragment>
                                                  <button className="btn btn-danger btn-sm" onClick={() => this.ShowDASTAlert(task)}>
                                                      <i className="glyphicon glyphicon-trash fa fa-trash"></i>
                                                  </button>
                                                  <SweetAlert
                                                      show={this.state.showDASTAlert}
                                                      title="Delete DAST Record?"
                                                      text="You cannot undo this action"
                                                      showCancelButton
                                                      onOutsideClick={() => this.setState({showDASTAlert: false})}
                                                      onEscapeKey={() => this.setState({showDASTAlert: false})}
                                                      onCancel={() => this.setState({showDASTAlert: false})}
                                                      onConfirm={() => this.deleteDASTRecord()}
                                                  />
                                              </Fragment>}
                                          </div>,
                                  'SAST': <div>
                                              {<Fragment>
                                                  <button className="btn btn-danger btn-sm" onClick={() => this.ShowSASTAlert(task)}>
                                                      <i className="glyphicon glyphicon-trash fa fa-trash"></i>
                                                  </button>
                                                  <SweetAlert
                                                      show={this.state.showSASTAlert}
                                                      title="Delete SAST Record?"
                                                      text="You cannot undo this action"
                                                      showCancelButton
                                                      onOutsideClick={() => this.setState({showSASTAlert: false})}
                                                      onEscapeKey={() => this.setState({showSASTAlert: false})}
                                                      onCancel={() => this.setState({showSASTAlert: false})}
                                                      onConfirm={() => this.deleteSASTRecord()}
                                                  />
                                              </Fragment>}
                                          </div>,
                                  'CLOC': <div>
                                              {<Fragment>
                                                  <button className="btn btn-danger btn-sm" onClick={() => this.ShowCLOCAlert(task)}>
                                                      <i className="glyphicon glyphicon-trash fa fa-trash"></i>
                                                  </button>
                                                  <SweetAlert
                                                      show={this.state.showCLOCAlert}
                                                      title="Delete CLOC Record?"
                                                      text="You cannot undo this action"
                                                      showCancelButton
                                                      onOutsideClick={() => this.setState({showCLOCAlert: false})}
                                                      onEscapeKey={() => this.setState({showCLOCAlert: false})}
                                                      onCancel={() => this.setState({showCLOCAlert: false})}
                                                      onConfirm={() => this.deleteCLOCRecord()}
                                                  />

                                              </Fragment>}
                                          </div>,
                              } [task.scan_type]
                            }
                          </div>
                      }</td>
                    </tr>
                  )
                } 
                </tbody>
              </Table>
            }
          />
        </Grid>
      </div>
    )
  }
}

export default History;