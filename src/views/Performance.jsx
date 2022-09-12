import React from "react";
import { useDispatch } from 'react-redux'
import {
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { FieldGroup } from "components/FormInputs/FormInputs.jsx";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import TYPE from "actions"
import {historyURL} from "config"


export default Performance = () => {
  const defaultForm = {
    "loops": 1,
    "num_threads": 10,
    "ramp_time": 10,
    "protocol": "http",
    "domain": "google.com",
    "port": 80,
  }
  const dispatch = useDispatch()
  const [form, setForm] = React.useState(defaultForm)
  const [file, setFile] = React.useState(undefined)
  const [toHistory, setToHistory] = React.useState(false)

  const runWithConfig = (event) => {
    event.preventDefault();
    dispatch({type: TYPE.CREATE_TASK_REQUESTING, task: {...form, "run_type": "CONFIG"}})
    setToHistory(true)
  }

  const runWithFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file)
    formData.append("run_type", "SCRIPT")
    dispatch({type: TYPE.CREATE_TASK_REQUESTING, task: formData})
    setToHistory(true)
  }

  return (
    <div className="content">
      {toHistory && <Redirect to={historyURL}/>}
      <Grid fluid>
        <Card 
          id="addScript"
          title="Upload Script"
          content={
            <Form onSubmit={e => runWithFile(e)}>
              <FieldGroup
                id="formControlsFile"
                type="file"
                accept=".jmx"
                onChange={e => setFile(e.target.files[0])}
                required
              />
              <Button bsStyle="primary" fill type="submit">
                Run Test
              </Button>
            </Form>
          }
        >
        </Card>
        <Card
          id="loadConfig"
          title="Load Configuration"
          content={
            <Form onSubmit={e => runWithConfig(e)}>
              <Row>
                <Col md={6}>
                  <FieldGroup
                    label="Target Domain"
                    type="text"
                    bsClass="form-control"
                    placeholder="sampleidomain.xxx.yyy"
                    onChange={e => setForm({...form, "domain": e.target.value})}
                    defaultValue="google.com"
                    required
                  />
                </Col>
                <Col md={6}>
                  <FieldGroup
                    label="Total Users"
                    type="number"
                    bsClass="form-control"
                    placeholder="10"
                    max="50"
                    min="1"
                    onChange={e => setForm({...form, "num_threads": parseInt(e.target.value)})}
                    defaultValue="10"
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup controlId="formControlsSelect" bsClass="form-group">
                    <ControlLabel>Protocol</ControlLabel>
                    <FormControl
                      componentClass="select"
                      placeholder="select"
                      onChange={e => setForm({...form, "protocol": e.target.value})}
                    >
                      <option value="http">Http</option>
                      <option value="https">Https</option>
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FieldGroup
                    label="Ramp Time"
                    type="number"
                    bsClass="form-control"
                    placeholder="10"
                    max="50"
                    min="1"
                    onChange={e => setForm({...form, "ramp_time": parseInt(e.target.value)})}
                    defaultValue="10"
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FieldGroup
                    label="Port"
                    type="number"
                    bsClass="form-control"
                    placeholder="80"
                    min="1"
                    max="65535"
                    onChange={e => setForm({...form, "port": parseInt(e.target.value)})}
                    defaultValue="80"
                    required
                  />
                </Col>
                <Col md={6}>
                  <FieldGroup
                    label="Loops"
                    type="number"
                    bsClass="form-control"
                    placeholder="1"
                    min="1"
                    max="50"
                    onChange={e => setForm({...form, "loops": parseInt(e.target.value)})}
                    defaultValue="1"
                    required
                  />
                </Col>
              </Row>
              <Button bsStyle="info" fill type="submit">
                Run Test
              </Button>
              <div className="clearfix" />
            </Form>
        }
        />
      </Grid>
    </div>
  )
}