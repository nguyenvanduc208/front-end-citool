import React from 'react'
import FormCloc from "../components/Cloc/FormCloc";
import HistoryCloc from "../components/Cloc/HistoryCloc";
import {Switch, Route, Link, BrowserRouter} from "react-router-dom";
import {historyClocURL, adminLayout, cloc} from "../config"
import {Tabs, Tab} from "@material-ui/core";



function Cloc() {
    const routes = [adminLayout + cloc, historyClocURL];

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
                            label="New Count"
                            component={Link}
                            to={routes[0]}
                        />
                        <Tab

                            className="text-tab"
                            value={routes[1]}
                            label="History"
                            component={Link}
                            to={routes[1]}
                        />
                    </Tabs>
                )}
            />

            <Switch>
                <Route path={`${adminLayout + cloc}`} exact component={FormCloc}/>
                <Route path={`${historyClocURL}`} exact component={HistoryCloc}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Cloc




