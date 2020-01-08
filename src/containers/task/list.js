import React, { Component } from 'react';
import { Table, Button, Tooltip, Row, Col } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import showDeleteConfirm from '../../components/delete-modal';
import constants from '../../constants';


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
                <Link to={`/api/project/${this.props.match.params.projectID}/task/${record.id}`}>{text}</Link>)
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
        }, {
            title: 'Action(Delete)',
            dataIndex: 'id',
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
                        type="danger" >
                        Delete
                </Button >
                )
            }
        }
    ];

    componentDidMount() {
        let prj_id = this.state.project_id;
        let url = constants.HOST + "/api/project/";
        if (prj_id) {
            url = `${constants.HOST}/api/project/${prj_id}/task/`;
            axios
                .get(url)
                .then(res => {
                    const tasks = res.data;
                    console.log(tasks)
                    this.setState({ tasks: tasks });
                })
                .catch(err => console.error(err));
        } else {
            console.error('Invalid URL provided');
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
                                <Link style={{ color: "rgba(255,255,255)", marginLeft: '2px' }} to={`/api/project/${this.state.project_id}/task/create`}>Create</Link>
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
                <Row gutter={[8, 24]}>
                    <Col span={4.5}>
                        <Table columns={this.columns} bordered dataSource={tasks}></Table>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default TaskList;