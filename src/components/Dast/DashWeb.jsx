import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {historyDastURL} from "../../config"
import Select from 'react-select';
import {Collapse, Button} from "react-bootstrap";

import { getDastTask } from "../../api";
import {tokenName} from "../../api/const";

class DashWeb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web_url: '',
            full_scan: false,    // false: quick scan, true: full scan
            succesSubmit: false,
            dast_path:'',
            customToggle:false,
        };
        this.handleRadio = this.handleRadio.bind(this);
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleSubmit = this.onHandleSubmit.bind(this);
        this.handleScanTypeRadio = this.handleScanTypeRadio.bind(this);
    }

    onHandleChange(event) {
        var target = event.target;
        var id = target.id;
        var value = target.value;
        this.setState({
            [id]: value
        });
    }

    handleScanTypeRadio(event) {
        this.setState({
            full_scan: event.target.id === 'fullScan' ? true : false
        })
    }

    handleRadio(event) {
        this.setState({
            customToggle: !this.state.customToggle
        })
    }
    onHandleSubmit(event) {
        event.preventDefault();
        var {web_url, full_scan, time, dast_path} = this.state;
        const token = localStorage.getItem(tokenName);
        if(this.state.customToggle === false) {
            dast_path = "";
        }
        getDastTask(token, 'POST', {
            target_url: web_url,
            full_scan: full_scan,
            run_type: "DAST",
            dast_path : dast_path
        }).then(res => {
            this.setState({
                succesSubmit: true
            })
        }).catch(err => {
            if (err.response.status === 401) {
                window.location = '/login';
            }else {
                return Promise.reject(err);
            }
        });
    }

    render() {
        var {web_url, full_scan, dast_path} = this.state;
        if (this.state.succesSubmit) {
            return <Redirect to={historyDastURL}/>
        }
        return (
            <div className="content">
                <form onSubmit={this.onHandleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputURL">Website URL</label>
                            <input type="text"
                                   className="form-control"
                                   id="web_url"
                                   placeholder="https://google.com/XXX/YYY"
                                   onChange={this.onHandleChange}
                                   value={web_url}
                                   required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="inputURL">Scan Path &nbsp;</label>
                            <label className="switch">
                                <input type="checkbox" onClick={this.handleRadio}/>
                                    <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="form-group col-md-12">
                            {
                                this.state.customToggle === true ?
                                    <textarea
                                        placeholder="/entry,&#13;&#10;/contact,&#13;&#10;/customer/account/create,&#13;&#10;/customer/login"
                                        className="fix-text-area"
                                        id="dast_path"
                                        value={dast_path}
                                        onChange={this.onHandleChange}
                                    /> : ""
                            }
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="inputURL">Scan Type</label>
                            <p>
                                {
                                    this.state.full_scan === false ?
                                        <input type="radio" id="quickScan" name="radio-group" onClick={this.handleScanTypeRadio} defaultChecked/> :
                                        <input type="radio" id="quickScan" name="radio-group" onClick={this.handleScanTypeRadio} />
                                }
                                    <label htmlFor="quickScan">Quick Scan</label>
                            </p>
                            <p>
                                <input type="radio" id="fullScan" name="radio-group" onClick={this.handleScanTypeRadio} />
                                    <label htmlFor="fullScan">Full Scan</label>
                            </p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-10">
                            <button type="submit" className="btn btn-primary">Run Scan</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default DashWeb;