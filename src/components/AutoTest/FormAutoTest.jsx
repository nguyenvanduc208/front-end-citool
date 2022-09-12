import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Select from 'react-select';
import { historyAutoTest}  from "../../config"
import { tokenName } from "../../api/const";
import { getAutotestTask } from "../../api";

class AutoTestWeb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gitUrl: '',
            branch: '',
            gitUser: '',
            gitPass: '',
            runType: 'SELENIUM',
            browser: [],
            succesSubmit: false,
        };

        this.options = [
            { value: 'chrome', label: 'Chrome' },
            { value: 'firefox', label: 'Firefox' },
            { value: 'edge-chromium', label: 'Edge Chromium' },
            { value: 'phantomjs', label: 'PhantomJS' },
            { value: 'opera', label: 'Opera' }
        ];

        this.handleMultiChange = this.handleMultiChange.bind(this);
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleSubmit = this.onHandleSubmit.bind(this);
    };

    onHandleChange(event) {
        var target = event.target;
        var id = target.id;
        var value = target.value;
        this.setState({
            [id]: value
        });
    }

    handleMultiChange(option) {
        this.setState( {
            browser: option,
        });
    }

    onHandleSubmit(event) {
        event.preventDefault();
        var { gitUrl, branch, gitUser, gitPass, runType, browser} = this.state;
        const token = localStorage.getItem(tokenName);

        let arrBrowsers = [];
        this.state.browser.forEach((item , key) => {
            arrBrowsers.push(item.value)
        });

        // Call create task api
        getAutotestTask(token, 'POST', {
            "git_url": gitUrl,
            "branch": branch,
            "git_user": gitUser,
            "git_pass": gitPass,
            "browser": arrBrowsers.toString(),
            "run_type": runType
        }).then(res => {
            this.setState({
                succesSubmit: true
            })
        }).catch(err => {
            console.log(err);
            if (err.response.status === 401) {
                window.location = '/login';
            }else {
                return Promise.reject(err);
            }
        });
    }

    render() {
        var {gitUrl, branch, gitUser, gitPass, browser} = this.state;

        if (this.state.succesSubmit) {
            return <Redirect to={historyAutoTest}/>
        }
        return (
            <div className="content">
                <form onSubmit={this.onHandleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputURL">Repository URL</label>
                            <input type="text"
                                   className="form-control"
                                   id="gitUrl"
                                   placeholder="https://gitlab002.co-well.jp/sample.git"
                                   onChange={this.onHandleChange}
                                   value={gitUrl}
                                   required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputBranch">Git Branch</label>
                            <input type="text"
                                   className="form-control"
                                   id="branch"
                                   placeholder="master"
                                   onChange={this.onHandleChange}
                                   value={branch}
                                   required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label htmlFor="inputUsername">Git Username</label>
                            <input type="text"
                                   className="form-control"
                                   id="gitUser"
                                   placeholder="Input Username"
                                   onChange={this.onHandleChange}
                                   value={gitUser}
                                   required
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="inputPassword">Git Password</label>
                            <input type="password"
                                   className="form-control"
                                   id="gitPass"
                                   value={gitPass}
                                   placeholder="Input Password"
                                   onChange={this.onHandleChange}
                                   required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputTestType">Automation Test Type</label>
                            <input type="text"
                                   className="form-control"
                                   id="RunType"
                                   placeholder="Selenium"
                                   value="SELENIUM"
                                   required
                                   readOnly
                                   disabled
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputLanguage">Web Browser Driver</label>
                            <Select
                                id="browser"
                                options={this.options}
                                isMulti
                                className="basic-multi-select"
                                value={browser}
                                onChange={this.handleMultiChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-10">
                            <button type="submit" className="btn btn-primary">Run Test</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default AutoTestWeb;
