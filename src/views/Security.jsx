import React from "react";
import { useDispatch } from 'react-redux'
import { Grid, Form } from "react-bootstrap";
import { FieldGroup } from "components/FormInputs/FormInputs.jsx";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { Redirect } from "react-router-dom";
import TYPE from "actions"
import {historyURL} from "config"


function Security () {
  const dispatch = useDispatch()
  const [url, setURL] = React.useState(undefined)
  const [toHistory, setToHistory] = React.useState(false)

  const runWithZap = (event) => {
    event.preventDefault();
    dispatch({type: TYPE.CREATE_TASK_REQUESTING, task: {"domain": url, "run_type": "SECURITY"}})
    setToHistory(true)
  }

  return (
    <div className="content">
      {toHistory && <Redirect to={historyURL}/>}
      <Grid fluid>
        <Card 
          id="addScript"
          title="Security Check"
          content={
            <Form onSubmit={e => runWithZap(e)}>
              <FieldGroup
                  label="Target Domain"
                  type="text"
                  bsClass="form-control"
                  placeholder="sampleidomain.xxx.yyy"
                  onChange={e => setURL(e.target.value)}
                  required
                />
              <Button bsStyle="danger" fill type="submit">
                Run Test
              </Button>
            </Form>
          }
        >
        </Card>
      </Grid>
    </div>
  )
}

export default Security