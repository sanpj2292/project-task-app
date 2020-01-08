import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Button,
    DatePicker,
    Form,
    Icon,
    Input,
    Tooltip, Row, Col
} from "antd";
import { updateObject } from "../../store/utility";
import moment from "moment";
import axios from "axios";
import showDeleteConfirm from '../../components/delete-modal';
import constants from '../../constants';

const { RangePicker } = DatePicker;

const rangeConfig = {
    rules: [
        {
            type: "array",
            required: true,
            message: "Please select time!"
        }
    ]
};

const DateRangePicker = (is_disabled) => (
    <RangePicker
        format="YYYY/MM/DD"
        ranges={{
            "This day": [moment().startOf("day"), moment().endOf("day")],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "This Week": [moment().startOf("day"), moment().endOf("week")],
            "This Year": [moment().startOf("day"), moment().endOf("year")]
        }}
        disabled={is_disabled}
    />
);

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

class TaskCreateUpdateForm extends Component {

    state = {
        proj_id: this.props.match.params.projectID,
        isEdit: this.props.method === 'put' && this.props.match.params.taskID !== 'create',
        isDisabled: this.props.method === 'get',
        form_vals: {},
        tasks: [],
        method: this.props.method,
    };

    VALID_LENGTH = {
        task_name: 150,
        task_description: 3000
    };

    handleChange = e => {
        e.preventDefault();
        let { form_vals } = this.state;
        let mod_form_vals = updateObject({ form_vals }, { form_vals: { [e.target.id]: e.target.value } })
        this.setState(updateObject(this.state, mod_form_vals));
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


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, vals) => {
            if (!err) {
                if (this.state.method === 'post' && this.props.token) {
                    axios.defaults.headers = {
                        Authorization: `Token ${this.props.token}`
                    };
                    console.log('Task Creation Token: ', this.props.token);
                    let { proj_id } = this.state;
                    let url = `${constants.HOST}/api/project/${proj_id}/task/`;
                    axios
                        .post(url, {
                            name: vals.task_name,
                            description: vals.task_description,
                            start_date: vals.date_range[0].format('YYYY/MM/DD'),
                            end_date: vals.date_range[1].format('YYYY/MM/DD'),
                            project_id: proj_id,
                        }).then(res => {
                            this.props.history.push(`/api/project/${proj_id}/`);
                        }).catch(err => {
                            console.error(err);
                        });
                } else {
                    console.error('Missing Token or calling wrong method');
                }
            } else if (this.state.method === 'put' && this.props.token) {
                axios.defaults.headers = {
                    Authorization: `Token ${this.props.token}`
                };
                let { proj_id } = this.state;
                let task_id = this.props.match.params.taskID;
                let url = `${constants.HOST}/api/project/${proj_id}/task/${task_id}`;
                axios.put(url, {
                    name: vals.task_name,
                    description: vals.task_description,
                    start_date: vals.date_range[0].format('YYYY/MM/DD'),
                    end_date: vals.date_range[1].format('YYYY/MM/DD'),
                    project_id: proj_id,
                }).then(res => {
                    this.props.history.push(`/api/project/${proj_id}/`);
                }).catch(err => {
                    console.error(err);
                });
            } else {
                console.error('Some Error Occurred!: ', err)
            }
        });
    }

    componentDidMount() {
        if (this.state.isEdit || this.state.isDisabled) {
            let prj_id = this.props.match.params.projectID;
            let task_id = this.props.match.params.taskID;
            let { setFieldsValue } = this.props.form;
            axios.get(`${constants.HOST}/api/project/${prj_id}/task/${task_id}`)
                .then(res => {
                    const task = res.data;
                    console.log('Task Values: ', task);
                    let st_date = moment(task.start_date, 'YYYY/MM/DD');
                    let en_date = moment(task.end_date, 'YYYY/MM/DD');
                    setFieldsValue({
                        task_name: task.name,
                        task_description: task.description,
                        date_range: [st_date, en_date],
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
        const { isEdit, method, isDisabled } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let prj_id = this.props.match.params.projectID;
        let task_id = this.props.match.params.taskID;
        let { token } = this.props;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    <Row type='flex' justify='end'>
                        <Col style={{ marginRight: '4px', marginLeft: '4px' }}>
                            <Button
                                onClick={() => showDeleteConfirm({
                                    url: `${constants.HOST}/api/project/${prj_id}/task/${task_id}`,
                                    token: token,
                                    entity: 'Task',
                                    dataKey: `${getFieldValue('task_name')}`,
                                    redirectUrl: `http:localhost:3000/api/project/${prj_id}/`
                                })}
                                type="danger" >
                                Delete
                            </Button >
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
                    {getFieldDecorator("task_name", {
                        rules: [
                            {
                                required: true,
                                message: "Please provide the name of Task!",
                            },
                            { validator: this.validateInput }
                        ]
                    })
                        (
                            <Input
                                prefix={
                                    <Icon type="deployment-unit"
                                        style={{ color: "rgba(0,0,0,.25)" }} />
                                }
                                placeholder="Enter Task Name"
                                onChange={isEdit ? this.handleChange : null}
                                disabled={isDisabled}
                            />
                        )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("task_description", {
                        rules: [
                            {
                                required: false,
                            },
                            { validator: this.validateInput }
                        ]
                    })(
                        <Input.TextArea
                            placeholder={`Describe the task in ${this.VALID_LENGTH["task_description"]} words`}
                            cols={16}
                            rows={4}
                            onChange={isEdit ? this.handleChange : null}
                            disabled={isDisabled}
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator("date_range", rangeConfig)(
                            DateRangePicker(isDisabled)
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}

const TaskCreateUpdate = Form.create()(TaskCreateUpdateForm);

const mapStateToProps = state => {
    return {
        token: state.token
    };
};

export default connect(mapStateToProps)(TaskCreateUpdate);