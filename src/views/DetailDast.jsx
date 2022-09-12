import React from 'react'
import {adminLayout, style, historyDastURL} from "../config"
import {Tabs, Tab, AppBar} from "@material-ui/core";
import DetailHistoryDast from "../components/Style/Detail/DetailHistoryDast";
import {orderBy} from 'lodash';
import { makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import {Grid} from "react-bootstrap";
import Card from "../components/Card/Card";
import {tokenName} from "../api/const";
import {errorNoti} from "components/Notifi"
import {getTaskResult, getDastDetail } from 'api'
import {Statistics} from "../components/Style/Detail/Statistics";
import {Breadcrumbs,Link} from "@material-ui/core";
import { ImHome } from 'react-icons/im';
import moment from 'moment'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (

        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        key: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
        'name':'lang'
    };
}

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


/* eslint-disable */
// let responseData = [1,2,3];
function Detail() {
    const routes = [adminLayout + style, historyDastURL];
    let idDaskDetail = document.URL.slice((document.URL.lastIndexOf("/")) + 1)
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [dataRes, setData] = React.useState({});
    const [dataUrl, setUrl] = React.useState('');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    // React.useEffect(() => {
    //     const tokenUser = localStorage.getItem(tokenName);
    //     getTaskResult(tokenUser, 'f95ac9b3-ce3a-47be-b6e2-7ae16b26210c')
    //         .then(res => {
    //             if (res.status === 200) {
    //                 setData(res.data)
    //             }
    //         })
    //         .catch(e => {
    //             errorNoti("not found Detail")
    //             setTimeout(function(){
    //                 window.location.href = historyDastURL;
    //             }, 2000);
    //         })
    // }, [])

    React.useEffect(() => {
        const tokenUser = localStorage.getItem(tokenName);
        getDastDetail(tokenUser, 'GET',null, idDaskDetail)
            .then(res => {
                if (res.status === 200) {
                    setData(res.data)
                }
            })
            // .catch(e => {
            //     errorNoti("not found Detail")
            //     setTimeout(function(){
            //         window.location.href = historyDastURL;
            //     }, 2000);
            // })
    }, [])

    React.useEffect(() => {
        const tokenUser = localStorage.getItem(tokenName);
        getDastDetail(tokenUser, 'GET',null, idDaskDetail)
            .then(res => {
                if (res.status === 200) {
                    res.data.map((item) => {
                        if(item.url !== "")
                        {
                            setUrl(item.url.slice(0,item.url.indexOf(',')))
                        }
                    })

                }
            })
        // .catch(e => {
        //     errorNoti("not found Detail")
        //     setTimeout(function(){
        //         window.location.href = historyDastURL;
        //     }, 2000);
        // })
    }, [])


    const pageChange = (pageData) => {
        console.log("OnPageChange", pageData);
    }

    const customSort = (column, records, sortOrder) => {
        return orderBy(records, [column], [sortOrder]);
    };

    const callBack = () => {
        window.history.back();
    };

    function StatisticsList(props) {
        const { data} = props;
        let totalData = []
        data.map((item)=>{
            totalData.push(item)
        })

        let totalInfo = 0;
        let totalLow = 0;
        let totaHeight = 0;
        let totalMedium = 0;
        let totalCritical = 0;
        let to = [
            {
                "name": "Round 1",
                "values": [
                    {
                        "id": 5,
                        "label": "Info",
                        "value": 0,
                        "color": "black"
                    },
                    {
                        "id": 4,
                        "label": "Low",
                        "value": 0,
                        "color": "black"
                    },
                    {
                        "id": 3,
                        "label": "Medium",
                        "value": 0,
                        "color": ["green", "green"]
                    },
                    {
                        "id": 2,
                        "label": "High",
                        "value": 0,
                        "color": ["orange","orange"]
                    },
                    {
                        "id": 1,
                        "label": "Critical",
                        "value": 0,
                        "color": ["red","red"]
                    }
                ]
            },
            {
                "name": "Round 2",
                "values": [
                    {
                        "id": 5,
                        "label": "Info",
                        "value": 0,
                        "color": "black"
                    },
                    {
                        "id": 4,
                        "label": "Low",
                        "value": 0,
                        "color": "black"
                    },
                    {
                        "id": 3,
                        "label": "Medium",
                        "value": 0,
                        "color": ["green"]
                    },
                    {
                        "id": 2,
                        "label": "High",
                        "value": 0,
                        "color": ["orange"]
                    },
                    {
                        "id": 1,
                        "label": "Critical",
                        "value": 0,
                        "color": ["red","red"]
                    }
                ]
            },
            {
                "name": "Round 3",
                "values": [
                    {
                        "id": 5,
                        "label": "Info",
                        "value": 10,
                        "color": "black"
                    },
                    {
                        "id": 4,
                        "label": "Low",
                        "value": 654,
                        "color": "black"
                    },
                    {
                        "id": 3,
                        "label": "Medium",
                        "value": 1002,
                        "color": ["green"]
                    },
                    {
                        "id": 2,
                        "label": "High",
                        "value": 20,
                        "color": ["orange"]
                    },
                    {
                        "id": 1,
                        "label": "Critical",
                        "value": 0,
                        "color": ["red","red"]
                    }
                ]
            }
        ];
        totalData.map((item) => {
                if(item.severity === "Info") {
                    totalInfo += 1;
                }
                if(item.severity === "Low") {
                    totalLow += 1;
                }
                if(item.severity === "High") {
                    totaHeight += 1;
                }
                if(item.severity === "Medium") {
                    totalMedium += 1;
                }
                if(item.severity === "Critical") {
                    totalCritical += 1;
                }
            }
        );

        to[2].values.forEach((item)=>{
            if(item.label === "Info") {
                item.value = totalInfo
            }
            if(item.label === "Low") {
                item.value = totalLow
            }
            if(item.label === "High") {
                item.value = totaHeight
            }
            if(item.label === "Medium") {
                item.value = totalMedium
            }
            if(item.label === "Critical") {
                item.value = totalCritical
            }
        })

        const sortedCurrentValuesNew = ["1","2","3","4","5"];

        return (
            <div>
                <div>
                    <Statistics
                        data={to}
                        iterationTimeout={100}
                        sortkey={sortedCurrentValuesNew}
                        checkTotal={true}
                    />
                </div>
            </div>
        );
    }

    StatisticsList.propTypes = {
        data:  PropTypes.any.isRequired,
        // index: PropTypes.any.isRequired,
        // value: PropTypes.any.isRequired,
    };

    return (
        <div className="content">
            <div className="fix-breadcrumbs">
                <Breadcrumbs aria-label="breadcrumb" className="fixBreadcrumbs">
                    <Link color="inherit" href="/" onClick="" className={`${classes.link} breadcrum-fontset`}>
                        <ImHome /> &nbsp;Home Page
                    </Link>
                    <Link color="inherit" href={historyDastURL} onClick="" className={`${classes.link} breadcrum-fontset`}>
                        Dast History
                    </Link>
                    <Typography color="textPrimary" className={`${classes.link} breadcrum-fontset`}>Dast Detail</Typography>
                </Breadcrumbs>
            </div>
            <Grid fluid>
                <Grid fluid className="col-md-12">
                    <Card
                        // title="Result Scan Task"
                        content={
                            <div className={classes.root}>
                                <div>
                                    <p><b>Repository URL :</b> {dataUrl}</p>
                                    <p><b>Scan Date : </b>
                                    {
                                        (dataRes.length !== undefined) ? dataRes[0].start_time : ''
                                    }
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span><b>End Date : </b>
                                        {
                                            (dataRes.length !== undefined) ? dataRes[0].end_time : ''
                                        }
                                    </span>
                                    </p>
                                    {
                                        (Object.keys(dataRes).length !== 0) ?
                                            <StatisticsList data={dataRes} />
                                            : ""
                                    }
                                </div>
                                {
                                    (Object.keys(dataRes).length !== 0) ?
                                        <DetailHistoryDast
                                            onPageChange={pageChange.bind(this)}
                                            onSort={customSort}
                                            // runType={dataRes.run_type}
                                            data={dataRes}
                                            // lenghtSubtasks={dataRes.subtasks.length}
                                            // dataSubtask={dataRes.subtasks[value]}
                                            // dataGit={dataRes.git_url}
                                            // dataBranch={dataRes.branch}
                                        /> : ""
                                }
                            </div>
                        }
                    >
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default Detail




