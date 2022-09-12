import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {historyStyleURL,scheduleStyleURL} from "../../config"
import Select from 'react-select';
import {Collapse,Button} from "react-bootstrap";
import DatePicker from "react-datepicker";
import callApiScanTask, {getSchedule} from "../../api";
import {tokenName} from "../../api/const";
import "react-datepicker/dist/react-datepicker.css";
class FormStyle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            git_url: '',
            branch: '',
            git_user: '',
            git_pass: '',
            language: [],
            git_engine: '',
            exclude_path: '',
            succesSubmit: false,
            succesSchedule: false,
            frequency: '',
            dayOfWeek:[],
            time:'',
            date:'',
            customToggle:false,
            checkdaily : false,
            checkRepeat : false,
            startDate: new Date()

        };
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleSubmit = this.onHandleSubmit.bind(this);
        this.submitSchedule = this.submitSchedule.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
        this.handleRepeat = this.handleRepeat.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.handleMultiChange = this.handleMultiChange.bind(this);
        this.handleMultiDayChange = this.handleMultiDayChange.bind(this);
        this.options = [
            { value: 'java', label: 'Java' },
            { value: 'php', label: 'PHP' },
            { value: 'python', label: 'Python' },
            { value: '.net', label: '.Net' },
            { value: 'eslint', label: 'Javascript (Eslint)' },
            { value: 'semgrep', label: 'Javascript (Semgrep)' }
            ];
        this.optionsDaily = [
            { value: 'ALL', label: 'Daily' },
            { value: 'TOD', label: 'Today' },
            { value: 'MON', label: 'Monday' },
            { value: 'TUE', label: 'Tuesday' },
            { value: 'WED', label: 'Wednesday' },
            { value: 'THU', label: 'Thursday' },
            { value: 'FRI', label: 'Friday' },
            { value: 'SAT', label: 'Saturday' },
            { value: 'SUN', label: 'Sunday' },
        ];
        this.optionsEngine = [
            { value: 'github', label: 'github' },
            { value: 'gitlab', label: 'gitlab' },
            { value: 'bitbucket', label: 'bitbucket' }
        ];
    }

    onHandleChange(event) {
        var target = event.target;
        var id = target.id;
        var value = target.value;
        this.setState({
            [id]: value
        });

        if(target.id ==="frequency") {
            if(value==="Daily") {
                this.setState( {
                    checkdaily: true
                });
            }
            if(value==="Weekly") {
                this.setState( {
                    checkdaily: false,
                    dayOfWeek: []
                });
            }
        }

    }

    handleMultiChange(option) {
        this.setState( {
            language: option,
        });
    }

    setStartDate(date) {
        this.setState({
            startDate: new Date(date)
        })
    }

    handleMultiDayChange(option) {
        const today = new Date()
        const weekday = [
            "SUN","MON","TUE","WED","THU","FRI","SAT"
        ]
        const getToday = weekday[today.getDay()];
        if(option.length === 0) {
            this.optionsDaily = [
                { value: 'ALL', label: 'Daily' },
                { value: 'TOD', label: 'Today' },
                { value: 'MON', label: 'Monday' },
                { value: 'TUE', label: 'Tuesday' },
                { value: 'WED', label: 'Wednesday' },
                { value: 'THU', label: 'Thursday' },
                { value: 'FRI', label: 'Friday' },
                { value: 'SAT', label: 'Saturday' },
                { value: 'SUN', label: 'Sunday' },
            ];
        } else {
            // get all Day
            if(option[0].value === "ALL")
            {
                this.optionsDaily = [
                    { value: 'ALL', label: 'ALL' }
                ];
            }

            option.map((item)=>{
                //get multi day
                if(item.value !== "All" && item.value !== "TOD") {
                    this.optionsDaily.map((day, key)=>{
                        if(day.value === "ALL") {
                            this.optionsDaily.splice(key, 1)
                        }
                    })
                    this.optionsDaily.map((day, key)=>{
                        if(day.value === "TOD") {
                            this.optionsDaily.splice(key, 1)
                        }
                    })
                }
                //get today
                if(item.value === "TOD") {
                    this.optionsDaily.map((item, key)=>{
                        if(item.value === getToday) {
                            this.optionsDaily.splice(key, 1)
                        }
                        if(item.value === 'ALL') {
                            this.optionsDaily.splice(key, 1)
                        }
                    })
                }
            })

        }

        this.setState( {
            dayOfWeek: option
        });
    }

    handleRadio(event) {
        this.setState({
            customToggle: event.target.id === 'test2' ? true : false
        })
    }

    handleRepeat() {
        this.setState({
            checkRepeat: !this.state.checkRepeat
        })
    }

    // Handle Day String
    getDate(arrDate) {
        const today = new Date()
        const weekday = [
            "SUN","MON","TUE","WED","THU","FRI","SAT"
        ]
        const getToday = weekday[today.getDay()];
        let dayString = '';
        if(arrDate.length === 0) {
            dayString = "*";
        }else {
            arrDate.map((item,key)=>{
                if(item === "TOD") {
                    arrDate[key] = getToday
                }
            })
            dayString = arrDate.toString()
            if(dayString === "ALL") {
                dayString = "*"
            }
            if(dayString === "TOD") {
                dayString = getToday
            }
        }
        if(this.state.checkRepeat===false) {
            dayString = "*"
        }
        return dayString;
    }

    onHandleSubmit(event) {
        event.preventDefault();
        var {git_url, branch, git_user, git_pass, exclude_path, git_engine, time, date} = this.state;
        let arr = [];
        this.state.language.forEach((item , key) => {
            arr.push(item.value)
        });
        let arrDate = []
        this.state.dayOfWeek.forEach((item , key) => {
            arrDate.push(item.value)
        });
        if(git_engine === "") {
            git_engine = "gitlab"
        }
        const dayString = this.getDate(arrDate);
        const token = localStorage.getItem(tokenName);
        let dateString = '';
        if(this.state.checkRepeat===false) {
            dateString = this.state.startDate.toISOString().split('T')[0]
        }
        if(this.state.customToggle) {
            if(this.state.checkRepeat===false) {
                dateString = this.state.startDate.toISOString().split('T')[0]
                getSchedule(token, 'POST', {
                    git_url: git_url,
                    branch: branch,
                    git_user: git_user,
                    git_pass: git_pass,
                    git_engine: git_engine,
                    language: arr.toString(),
                    exclude_path: exclude_path,
                    run_type: "SAST",
                    day_of_week: dayString,
                    date: dateString,
                    time: time
                }).then(res => {
                    this.setState({
                        succesSchedule: true
                    })
                });
            } else {
                getSchedule(token, 'POST', {
                    git_url: git_url,
                    branch: branch,
                    git_user: git_user,
                    git_pass: git_pass,
                    git_engine: git_engine,
                    language: arr.toString(),
                    exclude_path: exclude_path,
                    run_type: "SAST",
                    day_of_week: dayString,
                    time: time
                }).then(res => {
                    this.setState({
                        succesSchedule: true
                    })
                });
            }
        } else {
            callApiScanTask('', 'POST', {
                git_url: git_url,
                branch: branch,
                git_user: git_user,
                git_pass: git_pass,
                git_engine: git_engine,
                language: arr.toString(),
                exclude_path: exclude_path,
                run_type: "SAST",
            }).then(res => {
                this.setState({
                    succesSubmit: true
                })
            });
        }
    }

    submitSchedule(event){
        event.preventDefault();
        var {git_url, branch, git_user, git_pass, exclude_path, git_engine, time} = this.state;
        let arr = [];
        this.state.language.forEach((item , key) => {
            arr.push(item.value)
        });
        let arrDate = []
        this.state.dayOfWeek.forEach((item , key) => {
            arrDate.push(item.value)
        });
        if(git_engine === "") {
            git_engine = "gitlab"
        }
        const token = localStorage.getItem(tokenName);
        getSchedule(token, 'POST', {
            git_url: git_url,
            branch: branch,
            git_user: git_user,
            git_pass: git_pass,
            git_engine: git_engine,
            language: arr.toString(),
            exclude_path: exclude_path,
            run_type: "SAST",
            day_of_week: arrDate.length === 0 ? "*": arrDate.toString(),
            time: time
        }).then(res => {
            this.setState({
                succesSchedule: true
            })
        });
    }

    render() {
        var {branch, git_user, git_pass, git_url, exclude_path, language, git_engine, dayOfWeek, time, date} = this.state;
        if (this.state.succesSubmit) {
            return <Redirect to={historyStyleURL}/>
        }
        if (this.state.succesSchedule) {
            return <Redirect to={scheduleStyleURL}/>
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
                            <label htmlFor="inputPassword">Exclude Paths</label>
                            <input type="text"
                                   className="form-control"
                                   id="exclude_path"
                                   value={exclude_path}
                                   placeholder="Comma-separated list of patterns. Patterns can be globs, or file or folder paths"
                                   onChange={this.onHandleChange}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputLanguage">Git Engine</label>
                            <select id="git_engine"
                                    className="form-control"
                                    onChange={this.onHandleChange}
                                    value={git_engine}
                            >
                                <option value="gitlab">Gitlab</option>
                                <option value="github">Github</option>
                                <option value="bitbucket">Bitbucket</option>
                            </select>

                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputLanguage">Language</label>
                            <Select
                                id="language"
                                options={this.options}
                                isMulti
                                className="basic-multi-select"
                                value={language}
                                onChange={this.handleMultiChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <p>
                                {
                                    this.state.customToggle === false ?
                                        <input type="radio" id="test1" name="radio-group" onClick={this.handleRadio} defaultChecked /> :
                                        <input type="radio" id="test1" name="radio-group" onClick={this.handleRadio} />
                                }
                                    <label htmlFor="test1">Run Scan Immediately</label>
                            </p>
                            <p>
                                <input type="radio" id="test2" name="radio-group" onClick={this.handleRadio} />
                                    <label htmlFor="test2">Run Scan by Schedule</label>
                            </p>
                        </div>

                    </div>
                    <div className="form-row">
                        {/*<div className="fix-card-top">2</div>*/}
                        <div className="form-group col-md-12  fix-card">
                            {/*<div className="card-header fix-header" >Expand Schedule</div>*/}
                            {/*<Button color="primary" onClick={this.handleToggle} style={{ marginBottom: '1rem' }}>Expand</Button>*/}

                            <Collapse in={this.state.customToggle}>
                                {/*<Card>*/}
                                {/*    <CardBody>*/}
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputURL">Repeat&nbsp;</label>
                                        <label className="switch">
                                            <input type="checkbox" onClick={this.handleRepeat}/>
                                            <span className="slider round"></span>
                                        </label>
                                        <br/>
                                        <br/>
                                        {
                                            this.state.checkRepeat === true ? (
                                                <div className="fix-show-date">
                                                    <label htmlFor="inputLanguage" className="fix-text-card">Day Of Week</label>
                                                    <Select
                                                        name="somename" required
                                                        id="language"
                                                        options={this.optionsDaily}
                                                        isMulti
                                                        className="basic-multi-select"
                                                        value={dayOfWeek}
                                                        onChange={this.handleMultiDayChange}
                                                    />
                                                </div>

                                            ) : (
                                                <div className="fix-show-date">
                                                    <label htmlFor="inputLanguage" className="fix-text-date">Date</label>
                                                    <br/>
                                                    <DatePicker
                                                        className="fix-date-picker"
                                                        selected={this.state.startDate}
                                                        onChange={(date)=>this.setStartDate(date)}

                                                    />
                                                </div>

                                            )
                                        }

                                    </div>

                                    <div className="form-group col-md-6">
                                        <br/>
                                        <br/>
                                        <label htmlFor="inputUsername" className="fix-text-card">Time (GMT time)</label>
                                        {
                                            this.state.customToggle === true ?
                                                <input type="time"
                                                       className="form-control"
                                                       id="time"
                                                       placeholder="ITime"
                                                       onChange={this.onHandleChange}
                                                       value={time}
                                                       required
                                                />:
                                                <input type="time"
                                                       className="form-control"
                                                       id="time"
                                                       placeholder="ITime"
                                                       onChange={this.onHandleChange}
                                                       value={time}
                                                />
                                        }
                                    </div>
                                </div>
                            </Collapse>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-10">
                            <button type="submit" className="btn btn-primary">Create Scan</button>
                        </div>
                    </div>
                </form>
            </div>

        );
    }
}

export default FormStyle;