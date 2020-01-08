import React from "react";
import {
  Button,
  DatePicker,
  Form,
  Icon,
  Input,
  Tooltip,
  Row, Col
} from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";
import { updateObject } from "../../store/utility";
import showDeleteConfirm from '../../components/delete-modal';
import constants from '../../constants';

const { RangePicker } = DatePicker;

const rangeConfig = {
  rules: [{ type: "array", required: true, message: "Please select time!" }]
};

const Duration = (
  <RangePicker
    format="YYYY/MM/DD HH:mm:ss"
    ranges={{
      "This day": [moment().startOf("day"), moment().endOf("day")],
      "This Month": [moment().startOf("month"), moment().endOf("month")],
      "This Week": [moment().startOf("day"), moment().endOf("week")],
      "This Year": [moment().startOf("day"), moment().endOf("year")]
    }}
    showTime
  />
);


axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

class CreateProjectForm extends React.Component {

  state = {
    project: {},
    isEdit: this.props.method === 'put' && this.props.match.params.projectID !== 'create',
    isDisabled: this.props.method === 'get',
    form_vals: {},
    method: this.props.method,
    prj_id: this.props.match.params.projectID,
  };

  VALID_LENGTH = {
    prj_name: 120,
    prj_description: 2000
  };

  handleChange = e => {
    e.preventDefault();
    let { form_vals } = this.state;
    let mod_form_vals = updateObject({ form_vals }, { form_vals: { [e.target.id]: e.target.value } })
    this.setState(updateObject(this.state, mod_form_vals));
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, vals) => {
      if (!err) {
        axios.defaults.headers = {
          Authorization: `Token ${this.props.token}`
        };
        if (this.state.method === 'post') {
          let diff = vals.duration[1].diff(vals.duration[0]);
          // Create Project
          axios
            .post(constants.HOST + "/api/project/", {
              name: vals.prj_name,
              description: vals.prj_description,
              duration: diff
            })
            .then(res => {
              this.props.history.push("/");
            })
            .catch(err => {
              console.error(err);
            });
        } else if (this.state.method === 'put') {
          // Update Project
          let prj_id = this.state.prj_id;
          let { form_vals } = this.state;
          let mod_vals = updateObject(vals, form_vals);
          axios.put(`${constants.HOST}/api/project/${prj_id}/`, {
            name: mod_vals.prj_name,
            description: mod_vals.prj_description,
            duration: mod_vals.duration
          }).then(res => {
            console.log('Successful Updation: ', res.data);
            this.props.history.push('/')
          }).catch(err => console.error(err));

        }
      }
    });
  };

  validateInput = (rule, value, callback) => {
    const specialCharRegex = new RegExp("^[a-zA-Z][a-zA-Z0-9@.' ,-_]");
    if (value.length > this.VALID_LENGTH[rule.field]) {
      callback("Number of characters should be < 120");
    } else if (!specialCharRegex.test(value)) {
      callback("Should start with (a-zA-Z) & can contain (0-9@.' ,-)");
    } else {
      callback();
    }
  };

  componentDidMount() {
    if (this.state.isEdit || this.state.isDisabled) {
      let prj_id = this.state.prj_id;
      let { setFieldsValue } = this.props.form;
      axios.get(`${constants.HOST}/api/project/${prj_id}/`)
        .then(res => {
          const project = res.data;
          setFieldsValue({
            prj_name: project.name,
            prj_description: project.description,
            duration: project.duration
          });
        })
        .catch(err => console.error(err));
    }
  }

  editClick = () => {
    let new_state = updateObject(this.state,
      {
        isDisabled: !this.state.isDisabled,
        method: 'put',
        isEdit: !this.state.isEdit,
      });
    this.setState(new_state);
  }

  render() {
    const { isEdit, isDisabled, method } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { token } = this.props;
    console.log('Project Delete Token: ', token);
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          <Row type='flex' justify='end'>
            <Col style={{ marginRight: '4px', marginLeft: '4px' }}>
              <Button
                onClick={() => showDeleteConfirm({
                  url: `${constants.HOST}/api/project/${this.state.prj_id}`,
                  token: token,
                  entity: 'Project',
                  dataKey: `${getFieldValue('prj_name')}`
                })}
                type="danger" >
                Delete
              </Button>
            </Col>
            <Col style={{ marginRight: '4px', marginLeft: '4px' }}>
              {method === 'post' ? null : (
                <Tooltip placement="bottom" title={isDisabled ? 'Edit' : 'Cancel'}>
                  <Button
                    icon={isDisabled ? "edit" : 'close'}
                    type="default"
                    onClick={this.editClick} />
                </Tooltip>
              )}
            </Col>
            <Col style={{ marginRight: '4px', marginLeft: '4px' }}>
              {isDisabled ? null : (
                <Button type="primary" htmlType="submit" className="login-form-button">
                  {isEdit ? 'Update' : 'Create'}
                </Button>
              )}
            </Col>
          </Row>

        </Form.Item>
        <Form.Item>
          {getFieldDecorator("prj_name", {
            rules: [
              {
                required: true,
                message: "Please provide the name of Project!",
              },
              { validator: this.validateInput }
            ]
          })
            (
              <Input
                prefix={
                  <Icon type="project" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Enter Project Name"
                onChange={isEdit ? this.handleChange : null}
                disabled={isDisabled}
              />
            )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("prj_description", {
            rules: [
              {
                required: false,
              },
              { validator: this.validateInput }
            ]
          })(
            <Input.TextArea
              placeholder={`Describe the project in ${this.VALID_LENGTH["prj_description"]} words`}
              cols={16}
              rows={4}
              onChange={isEdit ? this.handleChange : null}
              disabled={isDisabled}
            />
          )}
        </Form.Item>
        <Form.Item>
          {
            isEdit || isDisabled ? getFieldDecorator('duration', { rules: [{ required: false }] })(< Input onChange={this.handleChange} disabled={isDisabled} />) : getFieldDecorator("duration", rangeConfig)(Duration)
          }
        </Form.Item>

      </Form>
    );
  }
}

const CreateProject = Form.create()(CreateProjectForm);

const mapStateToProps = state => {
  return {
    token: state.token
  };
};

export default connect(mapStateToProps)(CreateProject);
