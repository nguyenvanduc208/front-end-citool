import React from 'react'
import {Switch, Route, Link, BrowserRouter} from "react-router-dom";
import {adminLayout, historyUrlMonitoring, urlMonitoring} from "../config"
import {Tabs, Tab} from "@material-ui/core";
import MonitoringWeb from "../components/Monitoring/MonitoringWeb";
import MonitoringList from "../components/Monitoring/MonitoringList";


function Monitoring() {
    const routes = [adminLayout + urlMonitoring,historyUrlMonitoring];

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
                            label="New Monitoring"
                            component={Link}
                            to={routes[0]}
                        />
                        <Tab

                            className="text-tab"
                            value={routes[1]}
                            label="Monitoring List"
                            component={Link}
                            to={routes[1]}
                        />
                    </Tabs>
                    //
                )}
            />

            <Switch>
                <Route path={`${adminLayout + urlMonitoring}`} exact component={MonitoringWeb}/>
                <Route path={`${historyUrlMonitoring}`} exact component={MonitoringList}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Monitoring




