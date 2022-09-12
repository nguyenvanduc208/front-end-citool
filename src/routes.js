/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import History from "views/History.jsx";
import Style from "views/Style.jsx";
import Detail from "views/Detail.jsx";
import Dast from "views/Dast.jsx";
import Cloc from "views/Cloc.jsx";
import DetailCloc from "views/DetailCloc.jsx";
import DetailDast from "./views/DetailDast.jsx";
import Monitoring from "./views/Monitoring.jsx";
import AutoTest from "views/AutoTest.jsx";
import LogsAutoTest from "views/LogsAutoTest.jsx";
import MonitoringDetail from "./components/Monitoring/MonitoringDetail/MonitoringDetail";

// Config
import {
  adminLayout, dashBoard,
  sast, detail, cloc, detailCloc, autoTest, logsAutoTest, dast, detailDast,
  urlMonitoring, detailUrlMonitoring
} from "config";

const dashboardRoutes = [
  {
    path: dashBoard,
    name: "Dashboard",
    icon: "nc-icon pe-7s-graph",
    component: History,
    layout: adminLayout
  },
  {
    path: sast,
    name: "SAST Scan",
    icon: "pe-7s-shield",
    component: Style,
    layout: adminLayout
  },
  {
    path: detail,
    name: "Scan Detail",
    component: Detail,
    layout: adminLayout,
    hide: 1
  },
  {
    path: dast,
    name: "DAST Scan",
    icon: "pe-7s-diamond",
    component: Dast,
    layout: adminLayout
  },
  {
    path: detailDast, 
    name: "Dast Detail",
    component: DetailDast,
    layout: adminLayout,
    hide: 1
  },
  {
    path: cloc,
    name: "LOC Count",
    icon: "pe-7s-stopwatch",
    component: Cloc,
    layout: adminLayout
  },
  {
    path: detailCloc,
    name: "LOC Detail",
    component: DetailCloc,
    layout: adminLayout,
    hide: 1
  },
  {
    path: autoTest,
    name: "Automation Test",
    icon: "pe-7s-magic-wand",
    component: AutoTest,
    layout: adminLayout
  },
  {
    path: logsAutoTest,
    name: "Automation Test Logs",
    component: LogsAutoTest,
    layout: adminLayout,
    hide: 1
  },
  {
    path: urlMonitoring,
    name: "URL Monitoring",
    icon: "pe-7s-graph2",
    component: Monitoring,
    layout: adminLayout
  },
  {
    path: detailUrlMonitoring,
    name: "Monitoring Detail",
    component: MonitoringDetail,
    layout: adminLayout,
    hide: 1
  },
];

export default dashboardRoutes;
