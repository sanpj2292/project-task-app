import React, { Component } from 'react';
import {Table, Button, Tooltip, Row, Col, message, Typography} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import showDeleteConfirm from '../../components/delete-modal';
import constants from '../../constants';

const {Text} = Typography;

class TaskList extends Component {

    state = {
        tasks: [],
        project_id: this.props.match.params.projectID,
        token: this.props.token
    };

    columns = [
        {
            title: "Task Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Link to={`/project/${this.props.match.params.projectID}/task/${record.id}`}>{text}</Link>)
        },
        {
            title: "Task Description",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date"
        }, {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date"
        },
        {
            title: "Assignee",
            dataIndex: "assignee",
            key: "assignee",
            render:  (text, record) => {
                return <Row type='flex' justify='center'><Text mark>{text}</Text></Row>
            }
        },
        {
            title: 'Action(Delete)',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => {
                const { token } = this.state;
                return (
                    <Button
                        onClick={() => showDeleteConfirm({
                            url: `${constants.HOST}/api/project/${this.state.project_id}/task/${record.id}/`,
                            token: token,
                            entity: 'Task',
                            dataKey: `${record.name}`
                        })
                        }
                        type="danger"
                        icon='delete'>
                        Delete
                </Button >
                )
            }
        }
    ];

    async componentDidMount() {
        try {
            let prj_id = this.state.project_id;
            let url = constants.HOST + "/api/project/";
            if (prj_id) {
                url = `${constants.HOST}/api/project/${prj_id}/task/`;
                let user_map = {};
                await axios.get(`${constants.HOST}/api/user/`)
                        .then(res => {
                            let user_list = res.data;
                            user_list.forEach(user => {
                                user_map[user.id] = user.username;
                            });
                        }).catch(err => {
                            message.error(err.message)
                        });
                await axios
                    .get(url)
                    .then(res => {
                        const tasks = res.data;
                        tasks.forEach((task, k) => {
                            tasks[k].key = k;
                            if(task.assignee && task.assignee!==0 && task.assignee !== '') {
                                tasks[k].assignee = user_map[task.assignee];
                            } else {
                                tasks[k].assignee = '-';
                            }
                        });
                        this.setState({ tasks: tasks });
                    })
                    .catch(err => console.error(err));
            } else {
                console.error('Invalid URL provided');
            }
        } catch (e) {

        }
    }

    render() {
        const { tasks } = this.state;
        return (
            <div>
                <Row gutter={[8, 24]} type='flex' justify='end'>
                    <Col span={4.5}>
                        <Tooltip placement="bottom" title="Create Task">
                            <Button icon="plus" type="primary">
                                <Link style={{ color: "rgba(255,255,255)", marginLeft: '2px' }} to={`/project/${this.state.project_id}/task/create`}>Create</Link>
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
                <Row gutter={[8, 24]}>
                    <Col span={4.5}>
                        <Table columns={this.columns} bordered dataSource={tasks} />
                    </Col>
                </Row>
            </div>
        );
    }

}

export default TaskList;