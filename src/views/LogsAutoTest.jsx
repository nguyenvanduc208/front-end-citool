import React from 'react';
import { orderBy } from 'lodash';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { Tab, Tabs, AppBar} from "@material-ui/core";
import { Breadcrumbs, Link } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { getAutotestLog } from 'api'
import { historyAutoTest } from "../config";
import { tokenName } from "../api/const";
import { errorNoti } from "components/Notifi"
import LogsDetail from "../components/AutoTest/Logs/LogsDetail";
import { ImHome } from 'react-icons/im';
import { Grid } from "react-bootstrap";
import Card from "../components/Card/Card";
// import { Button } from "react-bootstrap";


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

function LogsAutoTest() {
    const theme = useTheme();
    const classes = useStyles();
    let idTaskDetail = document.URL.slice((document.URL.lastIndexOf("/")) + 1);
    const [value, setValue] = React.useState(0);
    const [dataRes, setData] = React.useState({});

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    React.useEffect(() => {
        const token = localStorage.getItem(tokenName);
        getAutotestLog(token, "GET", null, idTaskDetail)
        .then(res => {
            if (res.status === 200) {
                setData(res.data)
            }
        })
        .catch(e => {
            errorNoti("Not Found Detail");
            // setTimeout(function(){
            //     window.location.href = historyAutoTest;
            // }, 2000);
        })
    }, [])

    const pageChange = (pageData) => {
        console.log("OnPageChange", pageData);
    }

    const customSort = (column, records, sortOrder) => {
        return orderBy(records, [column], [sortOrder]);
    };

    console.log(dataRes);

    return (
        <div className="content">
            <div className="fix-breadcrumbs">
                <Breadcrumbs aria-label="breadcrumb" className="fixBreadcrumbs">
                    <Link color="inherit" href="/" className={`${classes.link} breadcrum-fontset`}>
                        <ImHome /> &nbsp;Home Page 
                    </Link>
                    <Link color="inherit" href={historyAutoTest} className={`${classes.link} breadcrum-fontset`}>
                        Automation Test Logs
                    </Link>
                    <Typography color="textPrimary" className={`${classes.link} breadcrum-fontset`}>Automation Test Logs</Typography>
                </Breadcrumbs>
            </div>
            <Grid fluid className="col-md-12">
                <Card
                    content={
                        <div className={classes.root}>
                            <div>
                                <p><b>Repository URL :</b> {dataRes.git_url}</p>
                                <p><b>Branch :</b> {dataRes.branch} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <p><b>Run Date :</b> {dataRes.timestamp}</p>
                            </div>
                            <AppBar position="static" color="default">
                                    {
                                        (Object.keys(dataRes).length !== 0)  && (dataRes.sub_tasks.length > 0) ?
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
                                            dataRes.sub_tasks.map((data , index) => (
                                                <Tab label={`${data.browser}`} {...a11yProps(index)} />
                                            ))
                                            : ""
                                        }
                                        </Tabs>
                                        ):""
                                    }
                                </AppBar>
                            {
                                (Object.keys(dataRes).length !== 0) ?
                                    dataRes.sub_tasks.map((item , index) => (
                                        <TabPanel key={index} value={value} index={index} dir={theme.direction}>
                                            <LogsDetail
                                                onPageChange={pageChange.bind(this)}
                                                onSort={customSort}
                                                // runType={dataRes.run_type}
                                                data={dataRes.sub_tasks[index]}
                                                lenghtSubtasks={dataRes.sub_tasks.length}
                                                dataSubtask={dataRes.sub_tasks[value]}
                                                // dataGit={dataRes.git_url}
                                                // dataBranch={dataRes.branch}
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
        </div>
    );
}

export default LogsAutoTest