import React from 'react'
import FormStyle from "../components/Style/FormStyle";
import HistoryStyle from "../components/Style/HistoryStyle";
import {Switch, Route, Link, BrowserRouter} from "react-router-dom";
import {historyStyleURL, adminLayout, style ,sast, scheduleStyleURL, schedule} from "../config"
import {Tabs, Tab} from "@material-ui/core";
import ScheduleStyle from "../components/Style/ScheduleStyle";


function Style() {
    const routes = [adminLayout + sast, historyStyleURL, scheduleStyleURL];

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
                            label="New Scan"
                            component={Link}
                            to={routes[0]}
                        />
                        <Tab

                            className="text-tab"
                            value={routes[1]}
                            label="Scan History"
                            component={Link}
                            to={routes[1]}
                        />
                        <Tab

                            className="text-tab"
                            value={routes[2]}
                            label="schedule"
                            component={Link}
                            to={routes[2]}
                        />
                    </Tabs>
                    //
                )}
            />

            <Switch>
                <Route path={`${adminLayout + sast}`} exact component={FormStyle}/>
                <Route path={`${historyStyleURL}`} exact component={HistoryStyle}/>
                <Route path={`${scheduleStyleURL}`} exact component={ScheduleStyle}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Style




