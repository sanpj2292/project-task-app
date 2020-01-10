import React from "react";
import {
  Button,
  DatePicker,
  Form,
  Icon,
  Input,
  Tooltip,
  Row, Col,
  Upload, TimePicker, message
} from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";
import { updateObject } from "../../store/utility";
import showDeleteConfirm from '../../components/delete-modal';
import constants from '../../constants';
import NumericInput from "../../components/days-input";

const { InputGroup } = Input.Group;
const { RangePicker } = DatePicker;

const rangeConfig = {
  rules: [{ type: "array", required: true, message: "Please select duration!" }]
};

const Duration = (
  <RangePicker
    format="DD HH:mm:ss"
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
    selectedFiles: [],
  };

  VALID_LENGTH = {
    prj_name: 120,
    prj_description: 2000
  };

  handleDurationChange = e => {
    console.log('Duration Change Value: ', e);
  };

  handleChange = e => {
    e.preventDefault();
    let { form_vals } = this.state;
    let mod_form_vals = updateObject({ form_vals }, { form_vals: { [e.target.id]: e.target.value } });
    console.log('Modified Fields: ', mod_form_vals);
    this.setState(updateObject(this.state, mod_form_vals));
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, vals) => {
      if (!err) {
        axios.defaults.headers = {
          Authorization: `Token ${this.props.token}`,
        };
        let form_data = new FormData();
        const {isFieldTouched, isFieldsTouched, getFieldValue} = this.props.form;
        // add one or more of your files in FormData
        // again, the original file is located at the `originFileObj` key
        if (this.state.method === 'post') {
          // Create Project
          // add one or more of your files in FormData
          // again, the original file is located at the `originFileObj` key
            form_data.append("avatar", getFieldValue('avatar')[0].originFileObj);
            form_data.append('duration', `${vals.days} ${vals.time.format('HH:mm:ss').toString()}`);
            form_data.append('name', vals.prj_name);
            form_data.append('description', vals.prj_description);
            axios
            .post(constants.HOST + "/api/project/", form_data)
            .then(res => {
              console.log(res.data);
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

          if(isFieldTouched('avatar')) {
              form_data.append("avatar", getFieldValue('avatar')[0].originFileObj);
          }

          if(isFieldTouched('prj_name')) {
            form_data.append('name', mod_vals.prj_name);
          }

          if(isFieldTouched('prj_description')) {
            form_data.append('description', mod_vals.prj_description);
          }

          let isDurationTouched = isFieldTouched('days') || isFieldTouched('time');
          if(isDurationTouched){
              form_data.append('duration',
                  `${getFieldValue('days')} ${getFieldValue('time').format('HH:mm:ss').toString()}`);
          }
          let partial = !(isFieldsTouched(['avatar', 'prj_name', 'prj_description']) && isDurationTouched);
          axios.patch(`${constants.HOST}/api/project/${prj_id}/`, form_data).then(res => {
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
        .then(async res => {
          const project = res.data;
          const vals = project.duration.split(' ');
          let field_vals = {};
          if(project.avatar){
              let originFileObj = await axios.get(project.avatar, {headers: {
                  'Content-Type': 'application/octet-stream'
                  }
                }).then(res => {
                    console.log(res);
                    let av_name = project.avatar.split('/').pop();
                    return new File([res.data], av_name, {
                        type: res.headers['content-type'],
                        lastModified: res.headers['last-modified'],
                    });
                });
                let obj = {
                  uid: -1,
                  "lastModified": originFileObj.lastModified,
                  "lastModifiedDate": originFileObj.lastModifiedDate,
                  "name": originFileObj.name,
                  "size": originFileObj.size,
                  "type": originFileObj.type,
                  "status": "done",
                  "thumbUrl": project.avatar,
                };
                field_vals = {
                    prj_name: project.name,
                    prj_description: project.description,
                    days: Number(vals[0]),
                    time: moment(vals[1], 'HH:mm:ss'),
                    avatar: [updateObject(obj, {originFileObj} )],
                }
          } else {
              field_vals = {
                    prj_name: project.name,
                    prj_description: project.description,
                    days: Number(vals[0]),
                    time: moment(vals[1], 'HH:mm:ss'),
              }

          }
          setFieldsValue(field_vals);
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
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG file!');
    }
    return isJpgOrPng;
  };

  dummyRequest = ({file, onSuccess}) => {
      setTimeout(() => {
          onSuccess('ok');
      }, 0)
  };

  normFile = (e) => {
      if(Array.isArray(e)) {
          return e
      }
      if(e.fileList.length > 1) {
          e.fileList.shift();
      }
      return e && e.fileList;
  };


  render() {
    const { isEdit, isDisabled, method } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { token } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          <Row type='flex' justify='end'>
            {method === 'post' ? null :
              (<Col style={{ marginRight: '4px', marginLeft: '4px' }}>
                <Button
                  onClick={() => showDeleteConfirm({
                    url: `${constants.HOST}/api/project/${this.state.prj_id}`,
                    token: token,
                    entity: 'Project',
                    dataKey: `${getFieldValue('prj_name')}`
                  })}
                  type="delete" >
                  Delete
              </Button>
              </Col>)}
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
          <Row type='flex' justify='start'>
            <Col span={4}>
              {
                getFieldDecorator('avatar', {
                rules: [
                  { required: false }
                ],
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
              })
                (<Upload
                    customRequest={this.dummyRequest}
                  // onChange={this.handleUpload}
                  beforeUpload={this.beforeUpload}
                  disabled={isDisabled}
                  listType='picture-card'
                >
                    <Button icon='upload'>
                      Upload Project Avatar
                    </Button>
                </Upload>)}
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
            getFieldDecorator('days', { rules: [{ required: false }] })
            (
            <NumericInput
                style={{ width: 180 }}
                addonBefore={
                  getFieldDecorator('time', { rules: [{ required: false }] })
                  (
                      <TimePicker
                          disabled={isDisabled}
                          // onChange={this.handleChange}
                          defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                  )
                }
                onChange={this.handleChange}
                disabled={isDisabled}
                placeholder='No of Days(+ve int)'
            />
            )
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
