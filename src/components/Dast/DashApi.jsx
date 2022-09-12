import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {adminLayout, detailCloc, historyDastURL} from "../../config"
import Select from 'react-select';
import {Collapse, Button} from "react-bootstrap";

import { getDastTask } from "../../api";
import {tokenName} from "../../api/const";

class DashApi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web_url: '',
            token_header: '',
            fileClick : '',
            full_scan: false,    // false: quick scan, true: full scan
            succesSubmit: false,
            errFormatFile : false,
            authorType : '',
            checkauthorType : true
        };
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleFile = this.onHandleFile.bind(this);
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
        if (event.target.id === 'authorType') {
            if (event.target.value === 'none') {
                this.setState({
                    checkauthorType: false
                })
            } else {
                this.setState({
                    checkauthorType: true
                })
            }

        }
    }

    onHandleFile(event) {
        var target = event.target;
        var id = target.id;
        var value = target.value;
        this.setState({
            [id]: value,
            fileClick : event.target.files[0]
        });
    }

    handleScanTypeRadio(event) {
        this.setState({
            full_scan: event.target.id === 'fullScan' ? true : false
        })
    }

    getDate(authorType, token_header) {
        let getToken = '';
        if(authorType === 'none') {
            getToken = '';
        } else {
            switch (authorType) {
                case 'Basic':
                   getToken = `Basic ${token_header}`;
                break;
                case 'Bearer':
                    getToken = `Bearer ${token_header}`;
                    break;
                case 'JWT':
                    getToken = `JWT ${token_header}`;
                    break;
                case 'Key':
                    getToken = `Apikey ${token_header}`;
                    break;
            }
        }
        return getToken;
    }

    onHandleSubmit(event) {
        event.preventDefault();
        var {web_url, full_scan, time, file, token_header, fileClick, authorType} = this.state;
        const token = localStorage.getItem(tokenName);
        const extensionFile = file.substr((file.lastIndexOf('.') + 1));
        // check default authorType
        if(authorType === '') {
            authorType = 'Basic'
        }
        const getauthorType = this.getDate(authorType, token_header);
        if(extensionFile !== 'yml') {
            this.setState({
                errFormatFile: true
            })
        } else {
            let formData = new FormData();
            formData.append('target_url', web_url);
            formData.append('full_scan', full_scan);
            formData.append('filename', fileClick);
            formData.append('header_token', getauthorType);
            formData.append('run_type', "DAST");
            // Call API
            getDastTask(token, 'POST', formData).then(res => {
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
        }
    }

    render() {
        var {web_url, full_scan, token_header, file, authorType} = this.state;
        if (this.state.succesSubmit) {
            return <Redirect to={historyDastURL}/>
        }
        return (
            <div className="content">
                <form onSubmit={this.onHandleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <div className="fix-DashApi-width">
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
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <div className="fix-DashApi-width">
                                <label htmlFor="inputURL">Swagger File(.yml)</label>
                                <input type="file"
                                       id="file"
                                       placeholder="https://google.com/XXX/YYY"
                                       onChange={this.onHandleFile}
                                       value={file}
                                       required
                                />
                            </div>
                        </div>

                    </div>
                    {
                        this.state.errFormatFile ?
                            <div className="form-row">
                                <div className="form-group col-md-12 text-danger">
                                    <label htmlFor="inputURL">
                                        The submitted data was not a file .yml, Check the encoding type on the form.
                                    </label>
                                </div>
                            </div> : ''
                    }

                    <div className="form-group col-md-12">
                        <div className="fix-DashApi-width">
                            <label htmlFor="inputLanguage">Authorization Type</label>
                            <select id="authorType"
                                    className="form-control"
                                    onChange={this.onHandleChange}
                                    value={authorType}
                            >
                                <option value="Basic">Basic Authentication</option>
                                <option value="Bearer">Bearer Authentication</option>
                                <option value="JWT">JWT Authentication</option>
                                <option value="Key">API Key</option>
                                <option value="none">None Authorization</option>
                            </select>
                        </div>
                    </div>

                    {
                        this.state.checkauthorType ?
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <div className="fix-DashApi-width">
                                        <label htmlFor="inputURL">Token or Key</label>
                                        <input type="text"
                                               className="form-control"
                                               id="token_header"
                                               onChange={this.onHandleChange}
                                               value={token_header}
                                               required
                                        />
                                    </div>
                                </div>
                            </div> : ''
                    }


                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="inputURL">Scan Type</label>
                            <p>
                                {
                                    this.state.full_scan === false ?
                                        <input type="radio" id="quickScan" name="radio-group" onClick={this.handleScanTypeRadio} checked /> :
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

export default DashApi;