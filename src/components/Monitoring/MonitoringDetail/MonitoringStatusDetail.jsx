import Card from "../../Card/Card";
import React from "react";
import LinkIcon from '@material-ui/icons/Link';
import PropTypes from 'prop-types';

MonitoringStatusDetail.propTypes = {
    dataRes: PropTypes.object.isRequired,
};

function MonitoringStatusDetail(props) {
    const {dataRes} = props;
    return (
        <div className="monitoring_status">
            <div className="icons-link">
                <span className="link"><LinkIcon id="icon"/> <p id="link-info">{dataRes.url}</p></span>
            </div>
            <Card
                content={
                    <div className="status-info">

                        <div className="status-items">
                            <span className="item-title">{dataRes.success_percent}</span>
                            <div>
                                <span className="item-1">Success rate</span>
                            </div>
                            <span className="item-hours">last 24 hrs</span>
                        </div>

                        <div className="status-items">
                            <span className="item-title">{dataRes.failed_count}/{dataRes.all_status_count}</span>
                            <div>
                                <span className="item-1">Checks failed</span>
                            </div>
                            <span className="item-hours">last 24 hrs</span>
                        </div>
                        {dataRes.success_percent == '100.0%' ? (
                            <div className="status-items">
                                <div>
                                    <span className="item-1">Everything's A-OK!</span>
                                </div>
                                <span className="item-hours">No failures detected within the last 24 hrs</span>
                            </div>
                        ) : (
                            <div className="status-items">
                                <div>
                                    <span className="item-1">Something went wrong!</span>
                                </div>
                                <span className="item-hours">Failures detected within 24 hrs</span>
                            </div>
                        )}
                    </div>
                }
            >
            </Card>

        </div>
    )
}

export default MonitoringStatusDetail;