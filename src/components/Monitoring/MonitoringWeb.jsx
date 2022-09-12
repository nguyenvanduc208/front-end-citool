import React, {Component, Fragment} from "react";
import {Redirect} from "react-router-dom";
import {historyUrlMonitoring} from "../../config"
import {createMonitoringTask} from "../../api";
import {tokenName} from "../../api/const";

class MonitoringWeb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            monitoringName: '',
            monitoringUrl: '',
            succesSubmit: false,
        };
    }

    onHandleChange = e => {
        let target = e.target;
        let id = target.id;
        let value = target.value;
        this.setState({
            [id]: value
        });
    };

    // handleText = i => e => {
    //     let monitoringUrl = [...this.state.monitoringUrl]
    //     monitoringUrl[i] = e.target.value
    //
    //     this.setState({
    //         monitoringUrl
    //     })
    // };

    // handleDelete = i => e => {
    //     e.preventDefault();
    //     let monitoringUrl = [
    //         ...this.state.monitoringUrl.slice(0, i),
    //         ...this.state.monitoringUrl.slice(i + 1)
    //     ];
    //     this.setState({
    //         monitoringUrl
    //     })
    // };
    //
    // addQuestion = e => {
    //     e.preventDefault();
    //     let monitoringUrl = this.state.monitoringUrl.concat([''])
    //     this.setState({
    //         monitoringUrl
    //     })
    // };

    onHandleSubmit = e => {
        e.preventDefault();
        const token = localStorage.getItem(tokenName);
        createMonitoringTask(token, 'POST', {
            sitename: this.state.monitoringName,
            url: this.state.monitoringUrl,
        }).then(res => {
            this.setState({
                succesSubmit: true
            })
        }).catch(err => {
            if (err.response.status === 401) {
                window.location = '/login';
            } else {
                return Promise.reject(err);
            }
        });
    };

    render() {
        if (this.state.succesSubmit) {
            return <Redirect to={historyUrlMonitoring}/>
        }
        return (
            <div className="content">
                <form onSubmit={this.onHandleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-7">
                            <label htmlFor="inputURL">Monitoring Site Name</label>
                            <input type="text"
                                   className="form-control"
                                   id="monitoringName"
                                   placeholder="CI-Tool"
                                   onChange={this.onHandleChange}
                                   value={this.state.monitoringName}
                                   required
                            />
                        </div>
                    </div>
                    <Fragment>
                        <div className="form-row">
                            <div className="form-group col-md-7 ">
                                <label htmlFor="inputURL">Monitoring URLs</label>
                                {/*{this.state.monitoringUrl.map((url, index) => (*/}
                                {/*    <span key={index}>*/}
                                <input
                                    type="text"
                                    id="monitoringUrl"
                                    className="form-control"
                                    placeholder="Full Url"
                                    onChange={this.onHandleChange}
                                    value={this.state.monitoringUrl}
                                    required
                                />
                                {/*<button className="btn btn-danger" type="button"*/}
                                {/*        onClick={this.handleDelete(index)}>X</button>*/}
                                {/*</span>*/}
                                {/*))}*/}

                                {/*<button className="btn btn-outline-secondary" type="button"*/}
                                {/*        onClick={this.addQuestion}>+*/}
                                {/*</button>*/}
                            </div>
                        </div>
                    </Fragment>

                    <div className="form-row">
                        <div className="col-md-10">
                            <button type="submit" className="btn btn-primary">Start Monitoring</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default MonitoringWeb;