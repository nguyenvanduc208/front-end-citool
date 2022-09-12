import React from 'react';
import { adminLayout, historyClocURL, cloc } from "../config";
// import {Tabs, Tab, AppBar} from "@material-ui/core";
// import DetailHistory from "../components/Style/Detail/DetailHistory";
import { orderBy } from 'lodash';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import { Grid, Table } from "react-bootstrap";
import Card from "../components/Card/Card";
import { tokenName } from "../api/const";
import { errorNoti } from "components/Notifi"
import { getLocCount, getLocResult, getLocReport } from 'api'
// import {Statistics} from "../components/Style/Detail/Statistics";
import { Breadcrumbs, Link } from "@material-ui/core";
import { ImHome } from 'react-icons/im';
import { Button } from "react-bootstrap";


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
function DetailCloc() {
    const routes = [adminLayout + cloc, historyClocURL];
    let idTaskDetail = document.URL.slice((document.URL.lastIndexOf("/")) + 1)
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [dataRes, setData] = React.useState({});
    const [dataRepo, setRepo] = React.useState({});

    React.useEffect(() => {
        const tokenUser = localStorage.getItem(tokenName);
        getLocResult(tokenUser, 'GET', null, idTaskDetail).then(res => {
            if (res.status === 200) {
                res.data.sort((a,b)=> (a.name > b.name ? 1 : -1))
                setData(res)
            }
        })
        .catch(e => {
            errorNoti("not found Detail")
            setTimeout(function(){
                window.location.href = historyClocURL;
            }, 2000);
        })
    }, [])

    React.useEffect(() => {
        const tokenUser = localStorage.getItem(tokenName);
        getLocCount(tokenUser, 'GET', null)
            .then(res => {
                if (res.status === 200) {
                    res.data.map((item,key) =>{
                        if(item.id === idTaskDetail) {
                            setRepo(res.data[key])
                        }
                    })
                }
            })
    }, [])

    const convertToCSV = (objArray) => {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        for (let i = 0; i < array.length; i++) {
            let line = '';
            if (!array[i]) continue;
            for (let index in array[i]) {
                if (line !== '') line += ',';
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

    // Download csv from local
    const downloadSummary = () => {
        let urlRepo = {};
        urlRepo['language'] =`Repository URL : ${dataRepo.git_url}`;
        urlRepo['files'] ='';
        urlRepo['blank'] ='';
        urlRepo['comment'] ='';
        urlRepo['code'] ='';

        let branchRepo = {}
        branchRepo['language'] = `Branch : ${dataRepo.branch}`;
        branchRepo['files'] = `ScanDate: ${dataRepo.updated_at}`;
        branchRepo['blank'] ='';
        branchRepo['comment'] ='';
        branchRepo['code'] ='';

        let header = {}
        header['language'] = "Language";
        header['files'] = "Files";
        header['blank'] = "Blank";
        header['comment'] = "Comment";
        header['code'] = "Code";

        let totalData = {}
        totalData['language'] = "SUM";
        totalData['files'] = totalFiles;
        totalData['blank'] = totalBlank;
        totalData['comment'] = totalComment;
        totalData['code'] = totalCode;

        let arrData = [];
        let index = 0;
        let deleteIndex = 0;
        dataRes.data.map((item,key) => {
            if (item.name === "SUM") {
                deleteIndex = index;
            }
            arrData[key] = {
                language: item.name || item.language,
                files: item.files,
                blank: item.blank,
                comment: item.comment,
                code: item.code
            };
            index = index + 1;
        })

        //remove old sum item
        arrData.splice(deleteIndex, 1);

        if (urlRepo && branchRepo && header) {
            arrData.unshift(urlRepo,branchRepo,header);
        }
        if (totalData) {
            arrData.push(totalData)
        }

        // Convert Object to JSON
        let jsonObject = JSON.stringify(arrData);
        let csv = convertToCSV(jsonObject);
        let exportedFilename = 'cloc_summary' + '.csv' || 'export.csv';
        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilename);
        } else {
            let link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }
    }

    // Download comarison summary CSV from local
    const downloadComparisonSummary = () => {
        let urlRepo = {};
        urlRepo['language'] =`Repository URL : ${dataRepo.git_url}`;
        urlRepo['files'] ='';
        urlRepo['blank'] ='';
        urlRepo['comment'] ='';
        urlRepo['code'] ='';

        let branchRepo = {};
        branchRepo['language'] = `Branch : ${dataRepo.branch}`;
        branchRepo['files'] = `ScanDate: ${dataRepo.updated_at}`;
        branchRepo['blank'] ='';
        branchRepo['comment'] ='';
        branchRepo['code'] ='';

        let header = {}
        header['language'] = "Language";
        header['files'] = "Files";
        header['blank'] = "Blank"; 
        header['comment'] = "Comment";
        header['code'] = "Code";

        // Added section
        let added = {};
        added['language'] = 'Added';
        added['files'] = '';
        added['blank'] ='';
        added['comment'] ='';
        added['code'] ='';

        let addedSumFiles = 0;
        let addedSumBlank = 0;
        let addedSumComment = 0;
        let addedSumCode = 0;

        if (dataRes.data !== undefined && Object.keys(dataRes).length!== 0) {
            dataRes.data.map((item, key) => {
                if (item.tittle === "SUM" && item.action === "added") {
                    addedSumFiles = item.files;
                    addedSumBlank = item.blank;
                    addedSumComment = item.comment;
                    addedSumCode = item.code;
                }
            });
        }

        // Added Sum Data
        let addedSumData = {}
        addedSumData['language'] = "SUM";
        addedSumData['files'] = addedSumFiles;
        addedSumData['blank'] = addedSumBlank;
        addedSumData['comment'] = addedSumComment;
        addedSumData['code'] = addedSumCode;

        // Modified section
        let modified = {};
        modified['language'] = 'Modified';
        modified['files'] = '';
        modified['blank'] ='';
        modified['comment'] ='';
        modified['code'] ='';

        let modifiedSumFiles = 0;
        let modifiedSumBlank = 0;
        let modifiedSumComment = 0;
        let modifiedSumCode = 0;

        if (dataRes.data !== undefined && Object.keys(dataRes).length!== 0) {
            dataRes.data.map((item, key) => {
                if (item.tittle === "SUM" && item.action === "modified") {
                    modifiedSumFiles = item.files;
                    modifiedSumBlank = item.blank;
                    modifiedSumComment = item.comment;
                    modifiedSumCode = item.code;
                }
            });
        }

        // Modified Sum Data
        let modifiedSumData = {}
        modifiedSumData['language'] = "SUM";
        modifiedSumData['files'] = modifiedSumFiles;
        modifiedSumData['blank'] = modifiedSumBlank;
        modifiedSumData['comment'] = modifiedSumComment;
        modifiedSumData['code'] = modifiedSumCode;

        // Removed section
        let removed = {};
        removed['language'] = 'Modified';
        removed['files'] = '';
        removed['blank'] ='';
        removed['comment'] ='';
        removed['code'] ='';

        let removedSumFiles = 0;
        let removedSumBlank = 0;
        let removedSumComment = 0;
        let removedSumCode = 0;

        if (dataRes.data !== undefined && Object.keys(dataRes).length!== 0) {
            dataRes.data.map((item, key) => {
                if (item.tittle === "SUM" && item.action === "removed") {
                    removedSumFiles = item.files;
                    removedSumBlank = item.blank;
                    removedSumComment = item.comment;
                    removedSumCode = item.code;
                }
            });
        }

        // Removed Sum Data
        let removedSumData = {}
        removedSumData['language'] = "SUM";
        removedSumData['files'] = removedSumFiles;
        removedSumData['blank'] = removedSumBlank;
        removedSumData['comment'] = removedSumComment;
        removedSumData['code'] = removedSumCode;

        let arrAddedData = [];
        let arrModifiedData = [];
        let arrRemovedData = [];
        dataRes.data.map((item,key) => {
            if (item.tittle !== "SUM" && item.action === "added") {
                arrAddedData[key] = {
                    language: item.language,
                    files: item.files,
                    blank: item.blank,
                    comment: item.comment,
                    code: item.code
                };
            }

            if (item.tittle !== "SUM" && item.action === "modified") {
                arrModifiedData[key] = {
                    language: item.language,
                    files: item.files,
                    blank: item.blank,
                    comment: item.comment,
                    code: item.code
                };
            }

            if (item.tittle !== "SUM" && item.action === "removed") {
                arrRemovedData[key] = {
                    language: item.language,
                    files: item.files,
                    blank: item.blank,
                    comment: item.comment,
                    code: item.code
                };
            }
        });

        if (urlRepo && branchRepo && header) {
            arrAddedData.unshift(urlRepo, branchRepo, added, header);
            arrModifiedData.unshift(modified, header);
            arrRemovedData.unshift(removed, header);
        }

        if (addedSumData) {
            arrAddedData.push(addedSumData);
        }

        if (modifiedSumData) {
            arrModifiedData.push(modifiedSumData);
        }

        if (removedSumData) {
            arrRemovedData.push(removedSumData)
        }

        // Merge added, modified, removed data
        let arrData = arrAddedData.concat(arrModifiedData, arrRemovedData);

        // Convert Object to JSON
        let jsonObject = JSON.stringify(arrData );
        let csv = convertToCSV(jsonObject);
        let exportedFilename = 'cloc_summary.csv';
        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        // IE 10+
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, exportedFilename);
        } else {
            let link = document.createElement("a");
            // feature detection
            if (link.download !== undefined) {
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }
    }

    // download Detail from S3
    const downloadDetail = () => {
        const token = localStorage.getItem(tokenName);
        getLocReport(token, 'GET', null, idTaskDetail).then(res => {
            if (res.status === 200) {
                let exportedFilename = 'detail' + '.csv' || 'export.csv';
                let downloadLink = document.createElement("a");
                // Create a link to the file
                downloadLink.setAttribute('href', res.data.download_link);
                // Setting the file name
                downloadLink.download = exportedFilename;
                //triggering the function
                downloadLink.click();
                downloadLink.remove();
            }
        }).catch(err => {
            if (err.response.status === 401) {
                window.location = '/login';
            }else {
                return Promise.reject(err);
            }
        })
    }

    // Click Download CSV
    const downloadCSV = () => {
        if (dataRes.data === undefined || Object.keys(dataRes.data).length === 0) {
            errorNoti("No data to download");
            return;
        }

        if (!!dataRepo.compared_branch1 || !!dataRepo.commit_id1) {
            downloadComparisonSummary();
        } else {
            downloadSummary();
        }
        downloadDetail();
    }

    const pageChange = (pageData) => {
        console.log("OnPageChange", pageData);
    }

    const customSort = (column, records, sortOrder) => {
        return orderBy(records, [column], [sortOrder]);
    };

    const callBack = () => {
        window.history.back();
    };

    let totalFiles = 0;
    let totalBlank = 0;
    let totalComment = 0;
    let totalCode = 0;
    return (
        <div className="content">
            <div className="fix-breadcrumbs">
                <Breadcrumbs aria-label="breadcrumb" className="fixBreadcrumbs">
                    <Link color="inherit" href="/" className={`${classes.link} breadcrum-fontset`}>
                        <ImHome /> &nbsp;Home Page 
                    </Link>
                    <Link color="inherit" href={historyClocURL} className={`${classes.link} breadcrum-fontset`}>
                        LOC Count History
                    </Link>
                    <Typography color="textPrimary" className={`${classes.link} breadcrum-fontset`}>LOC Count Detail</Typography>
                </Breadcrumbs>
            </div>
            <Grid fluid>
                <Grid fluid className="col-md-12">
                    <Card
                        content={
                            <div className={classes.root}>
                                <div>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="btn btn-primary btn-sm pull-right"
                                        onClick={() => downloadCSV(dataRepo, dataRes)}
                                        // onClick={event => this.changeMemo(event,record)}
                                    >
                                        Download CSV
                                    </Button>
                                    <p><b>Repository URL :</b> {dataRepo.git_url}</p>
                                    <p><b>Branch :</b> {dataRepo.branch} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <b>{(!!dataRepo.compared_branch1) ? ("Compare between two branch :") : (!!dataRepo.commit_id1 && "Compare between two commit :")}</b>
                                    &nbsp;{(!!dataRepo.compared_branch1) ? (
                                        dataRepo.compared_branch1 + " <> " + dataRepo.compared_branch2
                                        ) : (!!dataRepo.commit_id1 &&
                                            dataRepo.commit_id1 + " <> " + dataRepo.commit_id2
                                        )}</p>
                                    <p><b>LOC Count Date :</b> {dataRepo.updated_at}</p>
                                </div>
                                {(!!dataRepo.compared_branch1 || !!dataRepo.commit_id1) ? (
                                    <><Grid fluid>
                                        <Card
                                            id="AddedTable"
                                            title="Added"
                                            content={
                                                <Table hover bordered>
                                                    <thead>
                                                        <tr>
                                                            <th className="fix-content-td-table">Language</th>
                                                            <th scope="col" className="fix-content-td-table">Files Number</th>
                                                            <th scope="col" className="fix-content-td-table">Blank</th>
                                                            <th scope="col" className="fix-content-td-table">Comment</th>
                                                            <th scope="col" className="fix-content-td-table">Code</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {(dataRes.data !== undefined && Object.keys(dataRes).length!== 0)?
                                                        dataRes.data.map((item, key)=> {
                                                            if (item.tittle !== "SUM" && item.action === "added") {
                                                                return (
                                                                    <tr>
                                                                        <td className="fix-content-td-table">{item.language}</td>
                                                                        <td className="fix-content-td-table">{item.files}</td>
                                                                        <td className="fix-content-td-table">{item.blank}</td>
                                                                        <td className="fix-content-td-table">{item.comment}</td>
                                                                        <td className="fix-content-td-table">{item.code}</td>
                                                                    </tr>
                                                                );
                                                            }
                                                        }) : ""
                                                    }
                                                    <tr>
                                                    {(dataRes.data !== undefined && Object.keys(dataRes).length!== 0)?
                                                        dataRes.data.map((item, key)=> {
                                                            if (item.tittle === "SUM" && item.action === "added") {
                                                                return (
                                                                    <><td className="fix-content-td-table sum-row">SUM</td>
                                                                    <td className="fix-content-td-table sum-row">{item.files}</td>
                                                                    <td className="fix-content-td-table sum-row">{item.blank    }</td>
                                                                    <td className="fix-content-td-table sum-row">{item.comment}</td>
                                                                    <td className="fix-content-td-table sum-row">{item.code}</td></>
                                                                );
                                                            }
                                                        }) : ""
                                                    }
                                                    </tr>
                                                    </tbody>
                                                </Table>}
                                            />
                                    </Grid>
                                    <Grid fluid>
                                        <Card
                                            id="ModifiedTable"
                                            title="Modified"
                                            content={
                                                <Table hover bordered>
                                                    <thead>
                                                        <tr>
                                                            <th className="fix-content-td-table">Language</th>
                                                            <th scope="col" className="fix-content-td-table">Files Number</th>
                                                            <th scope="col" className="fix-content-td-table">Blank</th>
                                                            <th scope="col" className="fix-content-td-table">Comment</th>
                                                            <th scope="col" className="fix-content-td-table">Code</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {(dataRes.data !== undefined && Object.keys(dataRes).length!== 0)?
                                                        dataRes.data.map((item, key)=> {
                                                            if (item.tittle !== "SUM" && item.action === "modified") {
                                                                return (
                                                                    <tr>
                                                                        <td className="fix-content-td-table">{item.language}</td>
                                                                        <td className="fix-content-td-table">{item.files}</td>
                                                                        <td className="fix-content-td-table">{item.blank}</td>
                                                                        <td className="fix-content-td-table">{item.comment}</td>
                                                                        <td className="fix-content-td-table">{item.code}</td>
                                                                    </tr>
                                                                );
                                                            }
                                                        }) : ""
                                                    }
                                                    <tr>
                                                    {(dataRes.data !== undefined && Object.keys(dataRes).length!== 0)?
                                                        dataRes.data.map((item, key)=> {
                                                            if (item.tittle === "SUM" && item.action === "modified") {
                                                                return (
                                                                    <><td className="fix-content-td-table sum-row">SUM</td>
                                                                    <td className="fix-content-td-table sum-row">{item.files}</td>
                                                                    <td className="fix-content-td-table sum-row">{item.blank    }</td>
                                                                    <td className="fix-content-td-table sum-row">{item.comment}</td>
                                                                    <td className="fix-content-td-table sum-row">{item.code}</td></>
                                                                );
                                                            }
                                                        }) : ""
                                                    }
                                                    </tr>
                                                    </tbody>
                                                </Table>}
                                            />
                                    </Grid>
                                    <Grid fluid>
                                        <Card
                                            id="RemovedTable"
                                            title="Removed"
                                            content={
                                                <Table hover bordered>
                                                    <thead>
                                                        <tr>
                                                            <th className="fix-content-td-table">Language</th>
                                                            <th scope="col" className="fix-content-td-table">Files Number</th>
                                                            <th scope="col" className="fix-content-td-table">Blank</th>
                                                            <th scope="col" className="fix-content-td-table">Comment</th>
                                                            <th scope="col" className="fix-content-td-table">Code</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {(dataRes.data !== undefined && Object.keys(dataRes).length!== 0)?
                                                        dataRes.data.map((item, key)=> {
                                                            if (item.tittle !== "SUM" && item.action === "removed") {
                                                                return (
                                                                    <tr>
                                                                        <td className="fix-content-td-table">{item.language}</td>
                                                                        <td className="fix-content-td-table">{item.files}</td>
                                                                        <td className="fix-content-td-table">{item.blank}</td>
                                                                        <td className="fix-content-td-table">{item.comment}</td>
                                                                        <td className="fix-content-td-table">{item.code}</td>
                                                                    </tr>
                                                                );
                                                            }
                                                        }) : ""
                                                    }
                                                    <tr>
                                                    {(dataRes.data !== undefined && Object.keys(dataRes).length!== 0)?
                                                        dataRes.data.map((item, key)=> {
                                                            if (item.tittle === "SUM" && item.action === "removed") {
                                                                return (
                                                                    <><td className="fix-content-td-table sum-row">SUM</td>
                                                                    <td className="fix-content-td-table sum-row">{item.files}</td>
                                                                    <td className="fix-content-td-table sum-row">{item.blank    }</td>
                                                                    <td className="fix-content-td-table sum-row">{item.comment}</td>
                                                                    <td className="fix-content-td-table sum-row">{item.code}</td></>
                                                                );
                                                            }
                                                        }) : ""
                                                    }
                                                    </tr>
                                                    </tbody>
                                                </Table>}
                                            />
                                    </Grid></>
                                    ) : (
                                    <table className="table table-hover table-bordered fix-content-table">
                                        <thead>
                                        <tr>
                                            <th className="fix-content-td-table">Language</th>
                                            <th scope="col" className="fix-content-td-table">Files Number</th>
                                            <th scope="col" className="fix-content-td-table">Blank</th>
                                            <th scope="col" className="fix-content-td-table">Comment</th>
                                            <th scope="col" className="fix-content-td-table">Code</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {(dataRes.data !== undefined && Object.keys(dataRes).length!== 0)?
                                            dataRes.data.map((item, key)=> {
                                                if (item.name !== "SUM" && item.language !== "SUM") {
                                                    return (
                                                        <tr>
                                                            <td>{item.name || item.language}</td>
                                                            <td>{item.files}</td>
                                                            <td>{item.blank}</td>
                                                            <td>{item.comment}</td>
                                                            <td>{item.code}</td>
                                                        </tr>
                                                    );
                                                }
                                            }) : ""
                                        }
                                        <tr>
                                            {(dataRes.data !== undefined && Object.keys(dataRes).length!== 0)?
                                                dataRes.data.map((item, key)=> {
                                                    if (item.name !== "SUM" && item.language !== "SUM") {
                                                        totalFiles = totalFiles + parseInt(item.files)
                                                        totalBlank = totalBlank + parseInt(item.blank)
                                                        totalComment = totalComment + parseInt(item.comment)
                                                        totalCode = totalCode + parseInt(item.code)
                                                    }
                                                })
                                                :totalFiles = 0}
                                            <td className="fix-content-td-table sum-row">SUM</td>
                                            <td className="fix-content-td-table sum-row">{totalFiles}</td>
                                            <td className="fix-content-td-table sum-row">{totalBlank}</td>
                                            <td className="fix-content-td-table sum-row">{totalComment}</td>
                                            <td className="fix-content-td-table sum-row">{totalCode}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    )
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

export default DetailCloc