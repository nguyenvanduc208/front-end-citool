import React from 'react'
import DashWeb from "../components/Dast/DashWeb.jsx";
import DashApi from "../components/Dast/DashApi.jsx";
import DashHistory from "../components/Dast/DashHistory.jsx";
import {Switch, Route, Link, BrowserRouter} from "react-router-dom";
import {adminLayout, dast, dastAPIScan, historyDastURL} from "../config"
import {Tabs, Tab} from "@material-ui/core";

function Dast() {
    const routes = [adminLayout + dast, dastAPIScan, historyDastURL];

    return (
        <BrowserRouter>
            <Route
                path="/"
                render={(history) => (
                    // Menu tab
                    <Tabs
                        className="text-tab-change"
                        textColor="primary"
                        indicatorColor="primary"
                        value={
                            history.location.pathname !== "/"
                                ? history.location.pathname
                                : false
                        }
                    >
                        <Tab
                            textColor="secondary"
                            className="text-tab"
                            value={routes[0]}
                            label="New Web Scan"
                            component={Link}
                            to={routes[0]}
                        />
                        <Tab
                            textColor="secondary"
                            className="text-tab"
                            value={routes[1]}
                            label="New API Scan"
                            component={Link}
                            to={routes[1]}
                        />
                        <Tab

                            className="text-tab"
                            value={routes[2]}
                            label="Scan History"
                            component={Link}
                            to={routes[2]}
                        />
                    </Tabs>
                    //
                )}
            />

            <Switch>
                <Route path={`${adminLayout + dast}`} exact component={DashWeb}/>
                <Route path={`${dastAPIScan}`} exact component={DashApi}/>
                <Route path={`${historyDastURL}`} exact component={DashHistory}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Dast




