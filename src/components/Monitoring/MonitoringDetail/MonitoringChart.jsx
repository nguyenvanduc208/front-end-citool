import Card from "../../Card/Card";
import React from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import PropTypes from 'prop-types';
import Chart from "react-google-charts";

const pieOptions = {
    pieHole: 0.6,
    pieSliceTextStyle: {
        color: 'black',
    },
    slices: [
        {
            color: "#2BB673"
        },
        {
            color: "#d91e48"
        },
        {
            color: "#007fad"
        },
        {
            color: "#e9a227"
        }
    ],
    legend: {
        position: "bottom",
        alignment: "center",
        textStyle: {
            color: "233238",
            fontSize: 14
        }
    },
    tooltip: {
        showColorCode: true
    },
    chartArea: {
        left: 0,
        top: 10,
        width: "100%",
        height: "80%"
    },
    fontName: "Roboto"
};

MonitoringChart.propTypes = {
    value: PropTypes.array.isRequired,
    avg: PropTypes.number.isRequired,
    resNow: PropTypes.number.isRequired,
};


function MonitoringChart(props) {

    const {value, avg, resNow} = props;
    let status_code = value.map((item) =>{
        return item.status_code;
    });
   
    const counts = [];
    status_code.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

    let data_sum = [['Status Code', 'Sum Status Code']];
    counts.map((value,key) => {
        data_sum.push([key.toString(), value]);
        pieOptions.slices.map((item,key2) => {
            if (key === 401) {
                pieOptions.slices[key2].color = "#d91e48"
            }else if (key === 200) {
                pieOptions.slices[key2].color = "#2BB673"
            } else if (key === 500) {
                pieOptions.slices[key2].color = "#B67400"
            }
        });

    });

    return (
        <div className="monitoring_status">
            <Card
                content={
                    <div className="chart">
                        <div className="char_status">
                            <h5 className="chartTitle">Status code of check in the last 24 hrs</h5>
                            <Chart
                                chartType="PieChart"
                                data={data_sum}
                                options={pieOptions}
                                graph_id="PieChart"
                                width={"90%"}
                                height={"400px"}
                                legend_toggle
                            />
                        </div>
                        <div className="chart-check">
                            <h5 className="chartTitle">Last 24H Check Response Time</h5>
                            <h5 className="chartTitle-1">RESPONSE TIME</h5>
                            <div className="chartFull">
                                <div className="chartContent">
                                    <p className="text-resTime">Response Time (ms)</p>
                                    <ResponsiveContainer width="100%" aspect={7 / 3}>
                                        <AreaChart
                                            width={500}
                                            height={400}
                                            data={value}
                                            margin={{
                                                top: 10,
                                                right: 30,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="start_time_hm" axisLine={false} tickLine={false}/>
                                            <YAxis
                                                dataKey="response_time_ms"
                                                axisLine={false}
                                                tickLine={false}
                                                tickCount={10}
                                            />
                                            <Tooltip/>
                                            <Area type="monotone" dataKey="response_time_ms" stroke="#8884d8"
                                                  fill="#8884d8" tickCount={10}/>
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="responseTable">
                                    <table id="tableChart">
                                        <tbody>
                                        <tr>
                                            <th>Attribute</th>
                                            <th>Value</th>
                                        </tr>
                                        <tr>
                                            <td>Average Response Time</td>
                                            <td>{avg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ms</td>
                                        </tr>
                                        <tr>
                                            <td>Current Response Time</td>
                                            <td>{resNow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ms</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <p className="resTime">Time( UTC +0 )</p>
                        </div>
                    </div>
                }
            >
            </Card>
        </div>
    )
}

export default MonitoringChart;