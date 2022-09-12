import React from 'react'
import {historyUrlMonitoring} from "../../../config"
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Grid} from "react-bootstrap";
import Card from "../../Card/Card";
import {tokenName} from "../../../api/const";
import {getMonitoringResponse, getMonitoringResult} from '../../../api'
import {Breadcrumbs, Link} from "@material-ui/core";
import {ImHome} from 'react-icons/im';
import "./MonitoringDetail.css"
import MonitoringStatusDetail from "./MonitoringStatusDetail"
import MonitoringChart from "./MonitoringChart";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        flexGrow: 1
    },
    link: {
        display: 'flex',
        fontSize: 22
    }
}));

function MonitoringDetail() {
    let idTaskDetail = document.URL.slice((document.URL.lastIndexOf("/")) + 1);
    const classes = useStyles();
    const [value, setValue] = React.useState([]);
    const [dataRes, setData] = React.useState({});
    const [avg, setAvg] = React.useState(0);
    const [resNow, setResNow] = React.useState(0);


    React.useEffect(() => {
        const tokenUser = localStorage.getItem(tokenName);
        getMonitoringResult(tokenUser, idTaskDetail, 'GET')
            .then(res => {
                if (res.status === 200) {
                    setData(res.data)
                }
            })
            // .catch(e => {
            //     errorNoti("not found Detail");
            //     setTimeout(function () {
            //         window.location.href = historyUrlMonitoring;
            //     }, 2000);
            // })
    }, []);

    React.useEffect(() => {
        const tokenUser = localStorage.getItem(tokenName);
        getMonitoringResponse(tokenUser,idTaskDetail)
            .then(res => {
                if (res.status === 200) {
                    let total = 0;
                    let avg = 0;
                    let response_time_now = 0;
                    res.data.map((item,key) => {
                        res.data[key].response_time_ms = parseInt(item.response_time*1000);
                        res.data[key].start_time_hm = item.start_time.substr(11,5);
                        res.data[key].start_time_full = item.start_time.substr(0,10) + ' ' + item.start_time.substr(11,5);
                        if (res.data.length !== 0) {
                            total += (res.data[key].response_time*1000);
                            avg = Math.round(total / res.data.length);
                        }
                        response_time_now =  res.data[res.data.length -1].response_time_ms ;
                    });
                    setValue(res.data);
                    setAvg(avg);
                    setResNow(response_time_now);
                }
            })
            // .catch(e => {
            //     errorNoti("not found Detail");
            //     setTimeout(function () {
            //         window.location.href = historyUrlMonitoring;
            //     }, 2000);
            // })
    }, []);

    return (
        <div className="content">
            <div className="fix-breadcrumbs">
                <Breadcrumbs aria-label="breadcrumb" className="fixBreadcrumbs">
                    <Link color="inherit" href="/" className={`${classes.link} breadcrum-fontset`}>
                        <ImHome/> &nbsp;Home Page
                    </Link>
                    <Link color="inherit" href={historyUrlMonitoring} className={`${classes.link} breadcrum-fontset`}>
                        Monitoring List
                    </Link>
                    <Typography color="textPrimary" className={`${classes.link} breadcrum-fontset`}>URL Monitoring
                        Detail</Typography>
                </Breadcrumbs>
            </div>
            <Grid fluid>
                <Grid fluid className="col-md-12">
                    <Card
                        // title="Result Scan Task"
                        content={
                            <div className={classes.root}>
                                <div>
                                    <p><b>Site Name : {dataRes.sitename}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Start
                                        Date : {dataRes.timestamp}</b></p>
                                </div>
                                <MonitoringStatusDetail dataRes={dataRes}/>
                                <MonitoringChart value={value} avg={avg} resNow={resNow}/>
                            </div>
                        }
                    >
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default MonitoringDetail




