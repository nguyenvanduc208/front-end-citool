import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { historyClocURL } from "../../config"
import { tokenName } from "../../api/const";
import { getLocCount } from "../../api";

class FormCloc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            git_url: '',
            branch: '',
            git_user: '',
            git_pass: '',
            language: '',
            exclude_path: '',
            compared_branch1: '',
            compared_branch2: '',
            commit_id1: '',
            commit_id2: '',
            compareType: '',
            branchCheck: false,
            commitCheck: false,
            succesSubmit: false,
            checkdaily : false

        };
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleSubmit = this.onHandleSubmit.bind(this);
        this.handleBranchRadio = this.handleBranchRadio.bind(this);
        this.handleCommitRadio = this.handleCommitRadio.bind(this);
        this.handleCompareType = this.handleCompareType.bind(this);
    }

    handleBranchRadio(event) {
        if (event.target.checked) {
            this.setState({
                compareType: 'branch',
                branchCheck: true,
                commitCheck: false
            });
        } else {
            this.setState({
                compareType: 'none',
                branchCheck: false
            });
        }
    }

    handleCommitRadio(event) {
        if (event.target.checked) {
            this.setState({
                compareType: 'commit',
                commitCheck: true,
                branchCheck: false
            });
        } else {
            this.setState({
                compareType: 'none',
                commitCheck: false
            });
        }
    }

    handleCompareType(event) {
        this.setState({
            compareType: event
        });
    }

    onHandleChange(event) {
        var target = event.target;
        var id = target.id;
        var value = target.value;
        this.setState({
            [id]: value
        });
    }

    onHandleSubmit(event) {
        event.preventDefault();
        var {
            git_url, branch, git_user, git_pass, exclude_path, language,
            compared_branch1, compared_branch2, commit_id1, commit_id2
        } = this.state;
        const token = localStorage.getItem(tokenName);
        
        let data = {
            git_url: git_url,
            branch: branch,
            git_user: git_user,
            git_pass: git_pass
        }

        if (!!language) {
            data['include_lang'] = language;
        }

        if (!!exclude_path) {
            data['exclude_dir'] = exclude_path;
        }

        if (this.state.branchCheck && !!compared_branch1 && !!compared_branch2) {
            data['compared_branch1'] = "remotes/origin/" + compared_branch1;
            data['compared_branch2'] = "remotes/origin/" + compared_branch2;
        }

        if (this.state.commitCheck && !!commit_id1 && !!commit_id2) {
            data['commit_id1'] = commit_id1;
            data['commit_id2'] = commit_id2;
        }

        getLocCount(token, 'POST', data).then(res => {
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
        var {
            git_url, branch, git_user, git_pass, exclude_path, language,
            compared_branch1, compared_branch2, commit_id1, commit_id2
        } = this.state;

        if (this.state.succesSubmit) {
            return <Redirect to={historyClocURL}/>
        }

        return (
            <div className="content">
                <form onSubmit={this.onHandleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputURL">Repository URL</label>
                            <input type="text"
                                   className="form-control"
                                   id="git_url"
                                   placeholder="https://gitlab002.co-well.jp/XXX/YYY"
                                   onChange={this.onHandleChange}
                                   value={git_url}
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
                                   id="git_user"
                                   placeholder="Input Username"
                                   onChange={this.onHandleChange}
                                   value={git_user}
                                   required
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="inputPassword">Git Password</label>
                            <input type="password"
                                   className="form-control"
                                   id="git_pass"
                                   value={git_pass}
                                   placeholder="Input Password"
                                   onChange={this.onHandleChange}
                                   required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputExcludePaths">Exclude Paths</label>
                            <input type="text"
                                   className="form-control"
                                   id="exclude_path"
                                   value={exclude_path}
                                   placeholder="Comma-separated list of patterns. Patterns can be globs, or file or folder paths"
                                   onChange={this.onHandleChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputLanguage">Language</label>
                            <input type="text"
                                   className="form-control"
                                   id="language"
                                   value={language}
                                   placeholder="Language..."
                                   onChange={this.onHandleChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="inputURL">Compare two branch &nbsp;&nbsp;</label>
                            <label className="switch">
                                <input type="checkbox" checked={this.state.branchCheck} onClick={this.handleBranchRadio}/>
                                    <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            {
                                this.state.compareType === "branch" ?
                                    <><label htmlFor="inputCompareBranch1">Branch 1</label>
                                    <input type="text"
                                           placeholder="master"
                                           className="form-control"
                                           id="compared_branch1"
                                           value={compared_branch1}
                                           onChange={this.onHandleChange}
                                    /></> : ""
                            }
                        </div>
                        <div className="form-group col-md-6">
                            {
                                this.state.compareType === "branch" ?
                                    <><label htmlFor="inputCompareBranch1">Branch 2</label>
                                    <input type="text"
                                           placeholder="develop"
                                           className="form-control"
                                           id="compared_branch2"
                                           value={compared_branch2}
                                           onChange={this.onHandleChange}
                                    /></> : ""
                            }
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="inputURL">Compare two commit &nbsp;</label>
                            <label className="switch">
                                <input type="checkbox" checked={this.state.commitCheck} onClick={this.handleCommitRadio}/>
                                    <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            {
                                this.state.compareType === "commit" ?
                                    <><label htmlFor="inputCommitID1">Commit ID 1</label>
                                    <input type="text"
                                           placeholder="8a44eec639d3b60a6d..."
                                           className="form-control"
                                           id="commit_id1"
                                           value={commit_id1}
                                           onChange={this.onHandleChange}
                                    /></> : ""
                            }
                        </div>
                        <div className="form-group col-md-6">
                            {
                                this.state.compareType === "commit" ?
                                    <><label htmlFor="inputCommitID2">Commit ID 2</label>
                                    <input type="text"
                                           placeholder="a0f39ba24dafd79d6..."
                                           className="form-control"
                                           id="commit_id2"
                                           value={commit_id2}
                                           onChange={this.onHandleChange}
                                    /></> : ""
                            }
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-10">
                            <button type="submit" className="btn btn-primary">Count Run</button>
                        </div>
                    </div>
                </form>
            </div>

        );
    }
}

export default FormCloc;