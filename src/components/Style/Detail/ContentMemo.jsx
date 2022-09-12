import React, {Component} from 'react';
import {getEditMemo } from 'api'
import {tokenName} from "../../../api/const";
import Modal from "react-bootstrap/lib/Modal";


class ContentMemo extends Component {
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
        const tokenUser = localStorage.getItem(tokenName);
        getEditMemo(tokenUser,id, {
            note: content
        }).then(res => {
            let target = document.getElementById(id);
            target.parentNode.getElementsByTagName('span')[0].innerText = content;
            document.getElementsByClassName("close")[0].click();
        });
    }


    render() {

        return (
            <div>
                <Modal.Header closeButton>
                    <Modal.Title>Memo Content</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="fix-witdh"
                        value={this.state.content}
                        id={this.state.idMemo}
                        onChange={event => this.onHandleChange(event, this.state.idMemo)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button
                        variant="primary"
                        onClick={event => this.handleClose(event, this.state.idMemo,this.state.content)}
                    >
                        Save Changes
                    </button>
                </Modal.Footer>
            </div>
        )
    }
}

export default ContentMemo;