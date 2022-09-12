import React from 'react'
import {historyStyleURL, adminLayout, style} from "../config"
import {Tabs, Tab, AppBar} from "@material-ui/core";
import DetailHistory from "../components/Style/Detail/DetailHistory";
import {orderBy} from 'lodash';
import { makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import {Grid} from "react-bootstrap";
import Card from "../components/Card/Card";
import {tokenName} from "../api/const";
import {errorNoti} from "components/Notifi"
import {getTaskResult } from 'api'
import {Statistics} from "../components/Style/Detail/Statistics";
import {Breadcrumbs,Link} from "@material-ui/core";
import { ImHome } from 'react-icons/im';
// import moment from 'moment'

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
    const routes = [adminLayout + style, historyStyleURL];
    let idTaskDetail = document.URL.slice((document.URL.lastIndexOf("/")) + 1)
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [dataRes, setData] = React.useState({});
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    React.useEffect(() => {
        const tokenUser = localStorage.getItem(tokenName);
        getTaskResult(tokenUser, idTaskDetail)
        .then(res => {
            if (res.status === 200) {
                setData(res.data)
            }
        })
        .catch(e => {
            errorNoti("Not Found Detail");
            setTimeout(function(){
                window.location.href = historyStyleURL;
            }, 2000);
        })
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
            item.results.map((data)=>{
                totalData.push(data)
            })
        })


        let totalLow = 0;
        let totaHeight = 0;
        let totalMedium = 0;
        let totalCritical = 0;
        let to = [
            {
                "name": "Round 1",
                "values": [
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
                if(item.severity === "Low" || item.severity === "Unknown" || item.severity === "Everything else") {
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

        const sortedCurrentValuesNew = ["1","2","3","4"];
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
                    <Link color="inherit" href="/"  className={`${classes.link} breadcrum-fontset`}>
                        <ImHome /> &nbsp;Home Page 
                    </Link>
                    <Link color="inherit" href={historyStyleURL}  className={`${classes.link} breadcrum-fontset`}>
                        Scan History
                    </Link>
                    <Typography color="textPrimary" className={`${classes.link} breadcrum-fontset`}>Scan Detail</Typography>
                </Breadcrumbs>
            </div>
            <Grid fluid>
                <Grid fluid className="col-md-12">
                    <Card
                        // title="Result Scan Task"
                        content={
                            <div className={classes.root}>
                                <div>
                                    <p><b>Repository URL :</b> {dataRes.git_url}</p>
                                    <p><b>Branch :</b> {dataRes.branch}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span><b>Scan Date:</b> {dataRes.timestamp}</span></p>
                                    {
                                        (Object.keys(dataRes).length !== 0) ?
                                            <StatisticsList data={dataRes.subtasks} />
                                            : ""
                                    }
                                </div>
                                <AppBar position="static" color="default">
                                    {
                                        (Object.keys(dataRes).length !== 0)  && (dataRes.subtasks.length > 1) ?
                                        (<Tabs
                                        value={value}
                                        onChange={handleChange}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        variant="fullWidth"
                                        aria-label="full width tabs example"
                                        >
                                        {
                                            (Object.keys(dataRes).length !== 0) ?
                                            dataRes.subtasks.map((data , index) => (
                                            <Tab label={`${data.language}`} {...a11yProps(index)} />
                                            ))
                                            : ""
                                        }
                                        </Tabs>
                                        ):""
                                    }
                                </AppBar>
                                {
                                    (Object.keys(dataRes).length !== 0) ?
                                        dataRes.subtasks.map((item , index) => (
                                            <TabPanel key={index} value={value} index={index} dir={theme.direction}>
                                                <DetailHistory
                                                    onPageChange={pageChange.bind(this)}
                                                    onSort={customSort}
                                                    runType={dataRes.run_type}
                                                    data={dataRes.subtasks[index]}
                                                    lenghtSubtasks={dataRes.subtasks.length}
                                                    dataSubtask={dataRes.subtasks[value]}
                                                    dataGit={dataRes.git_url}
                                                    dataBranch={dataRes.branch}
                                                />
                                            </TabPanel>
                                        ))
                                        : ""
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




