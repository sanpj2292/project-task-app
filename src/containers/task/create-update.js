import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Button,
    DatePicker,
    Form,
    Icon,
    Input,
    Tooltip, Row, Col, message
} from "antd";
import { updateObject } from "../../store/utility";
import moment from "moment";
import axios from "axios";
import showDeleteConfirm from '../../components/delete-modal';
import constants from '../../constants';
import UserInput from "../../components/user-input";

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
        userDataSource: [],
        userDict: {},
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
                if(this.props.token) {
                    const {isFieldTouched, getFieldValue} = this.props.form;
                    const {userDict} = this.state;
                    let form_data = new FormData();
                    if (this.state.method === 'post') {
                        axios.defaults.headers = {
                            Authorization: `Token ${this.props.token}`
                        };
                        let { proj_id } = this.state;
                        let url = `${constants.HOST}/api/project/${proj_id}/task/`;
                        form_data.append('name', vals.task_name);
                        form_data.append('description', vals.task_description);
                        form_data.append('start_date', vals.date_range[0].format('YYYY/MM/DD'));
                        form_data.append('end_date', vals.date_range[1].format('YYYY/MM/DD'));
                        form_data.append('project_id', proj_id);
                        if(isFieldTouched('assignee') && getFieldValue('assignee') !== '') {
                            let key = getFieldValue('assignee');
                            form_data.append('assignee', userDict[key]);
                        }
                        axios.post(url, form_data
                            ).then(res => {
                                this.props.history.push(`/project/${proj_id}/`);
                            }).catch(err => {
                                console.error(err);
                                message.error('Task creation Failed!, please create with correct values');
                            });
                    } else if (this.state.method === 'put' ) {
                        axios.defaults.headers = {
                            Authorization: `Token ${this.props.token}`
                        };
                        let {proj_id} = this.state;
                        let task_id = this.props.match.params.taskID;
                        let url = `${constants.HOST}/api/project/${proj_id}/task/${task_id}/`;
                        form_data.append('name', vals.task_name);
                        form_data.append('description', vals.task_description);
                        form_data.append('start_date', vals.date_range[0].format('YYYY/MM/DD'));
                        form_data.append('end_date', vals.date_range[1].format('YYYY/MM/DD'));
                        form_data.append('project_id', proj_id);
                        if(isFieldTouched('assignee') && getFieldValue('assignee') !== '') {
                            let key = getFieldValue('assignee');
                            form_data.append('assignee', userDict[key]);
                        }
                        axios.put(url, form_data).then(res => {
                            this.props.history.push(`/project/${proj_id}/`);
                        }).catch(err => {
                            console.error(err);
                            message.error('Task updation Failed!, please update with correct values');
                        });
                    }
                } else {
                    message.error('Please Login and Try Again', 3);
                }
            }
        });
    };

    async componentDidMount() {
        try {
        let assignee = 0;
        let task_name = '';
        let task_description = '';
        let start_date = '';
        let end_date = '';
        let { setFieldsValue } = this.props.form;
        if (this.state.isEdit || this.state.isDisabled) {
            let prj_id = this.props.match.params.projectID;
            let task_id = this.props.match.params.taskID;
            await axios.get(`${constants.HOST}/api/project/${prj_id}/task/${task_id}`)
                .then(res => {
                    const task = res.data;
                    task_name = task.name;
                    task_description = task.description;
                    start_date = moment(task.start_date, 'YYYY/MM/DD');
                    end_date = moment(task.end_date, 'YYYY/MM/DD');
                    if(task.assignee && task.assignee !== ''){
                        assignee = task.assignee;
                    }
                })
                .catch(err => console.error(err));
        }
        let user_id_dict = {};
        await axios.get(`${constants.HOST}/api/user/`)
            .then(res => {
                let user_data_list = res.data;
                let user_dict = {};
                let user_list = [];
                user_data_list.forEach(user => {
                    user_dict[user.username] = user.id;
                    user_id_dict[user.id] = user.username;
                    user_list.push(user.username);
                });
                let new_state = updateObject(this.state, {
                    userDataSource: user_list,
                    userDict: user_dict,
                });
                this.setState(new_state);
            }).catch(err => {
                console.error(err);
                message.error('Error occurred')
            });
            await setFieldsValue({
                task_name: task_name,
                task_description: task_description,
                date_range: [start_date, end_date],
                assignee: user_id_dict[assignee]
            });
        } catch (err) {
            console.error('Some Error occurred in Rendering: ', err);
            message.error('Some Error occurred in Rendering');
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

    validateAssignee = (rule, value, callback) => {
        const { userDict } = this.state;
        if( value==='' || (userDict[value] && userDict[value] !== undefined)) {
            callback();
        } else if(userDict[value] === undefined) {
            callback('Invalid User, please change input and try again!');
        }
    };



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
                                    redirectUrl: `${constants.HOST}/project/${prj_id}/`
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
                            { required: false },
                            { validator: this.validateInput }
                        ],
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
                <Form.Item>
                    {
                        getFieldDecorator("assignee", {
                            rules: [
                                { required: false },
                                { validator: this.validateAssignee }
                            ]
                        })(
                            <UserInput
                                placeholder='Select Assignee for the Task'
                                dataSource={this.state.userDataSource}
                                disabled={isDisabled}
                            />
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