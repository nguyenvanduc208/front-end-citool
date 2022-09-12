import React from 'react'
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import { adminLayout, autoTest, historyAutoTest } from "../config"
import {Tabs, Tab} from "@material-ui/core";
import FormAutoTest from "../components/AutoTest/FormAutoTest";
import HistoryAutoTest from "../components/AutoTest/HistoryAutoTest";

function AutoTest() {
    const routes = [adminLayout + autoTest, historyAutoTest];

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
                            label="New Auto Test"
                            component={Link}
                            to={routes[0]}
                        />
                        <Tab

                            className="text-tab"
                            value={routes[1]}
                            label="Auto Test History"
                            component={Link}
                            to={routes[1]}
                        />
                    </Tabs>
                    //
                )}
            />

            <Switch>
                <Route path={`${adminLayout + autoTest}`} exact component={FormAutoTest}/>
                <Route path={`${historyAutoTest}`} exact component={HistoryAutoTest}/>
            </Switch>
        </BrowserRouter>
    );
};

export default AutoTest;