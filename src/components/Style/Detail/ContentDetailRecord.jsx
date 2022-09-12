import React, {Component} from 'react';
import {getEditMemo } from 'api'
import {tokenName} from "../../../api/const";
import Modal from "react-bootstrap/lib/Modal";


class ContentDetailRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            content: props.content,
            idMemo:props.idMemo
        };
        this.onHandleChange = this.onHandleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    onHandleChange(event, id) {
        var target = event.target;
        // var id = target.id;
        var value = target.value;
        this.setState({
            content: value
        });
    }
    handleClose(event,id,content) {
        let target = document.getElementById(id);
        // target.parentNode.getElementsByTagName('span')[0].innerText = content;
        document.getElementsByClassName("close")[0].click();
    }


    render() {
        let urls = [];
        let rowspan = this.state.content.url.split(",").length;
        for (let i = 0; i < rowspan; i++) {
            urls.push(<tr><td className="td-content">{this.state.content.url.split(",")[i]}</td></tr>);
        } 
        return (
            <div>
                <Modal.Header closeButton>
                    <Modal.Title>Content Detail Record</Modal.Title>
                </Modal.Header>
                <Modal.Body className="detail-record-modal-body">
                    <table className="detail-record-table">
                        <tr className="detail-record-tr-th">
                            <th>{this.state.content.severity}</th>
                            <th>incompelete or No Cache-controller and Pragma HTTP Header Set</th>
                        </tr>
                        <tr className="detail-record-tr-td">
                            <td className="td-title">Cve</td>
                            <td className="td-content">{this.state.content.cve}</td>
                        </tr>
                        <tr>
                            <td className="td-title">Description</td>
                            <td className="td-content">{this.state.content.description}</td>
                        </tr>
                        <tr>
                            <td className="td-title">Id</td>
                            <td className="td-content">{this.state.content.id}</td>
                        </tr>
                        <tr>
                            <td className="td-title">Message</td>
                            <td className="td-content">{this.state.content.message}</td>
                        </tr>
                        <tr>
                            <td className="td-title">Note</td>
                            <td className="td-content">{this.state.content.note}</td>
                        </tr>
                        <tr>
                            <td className="td-title">Start_time</td>
                            <td className="td-content">{this.state.content.start_time}</td>
                        </tr>
                        <tr>
                            <td className="td-title">Solution</td>
                            <td className="td-content">{this.state.content.solution}</td>
                        </tr>
                        <tr>
                            <td className="td-title" rowspan={rowspan+1}>Url</td>
                        </tr>
                        {urls}
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        variant="primary"
                        onClick={event => this.handleClose(event, this.state.content.id, this.state.content)}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </div>
        )
    }
}

export default ContentDetailRecord;