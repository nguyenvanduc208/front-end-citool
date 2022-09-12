import React, {Component} from "react";
// import ReactDOMServer from 'react-dom/server';
import { LazyLog } from "react-lazylog";

class LogsDetails extends Component {
    render() {
        let logs = '';

        this.props.data.results.map((item, index) => {
            logs += item.message + '\n\n';
        })

        console.log(this.props.data.results);

        return (
            <div className="LogsView">
                <LazyLog height={480} extraLines={1} enableSearch text={logs} />
            </div>
        );
    }
}

export default LogsDetails;

