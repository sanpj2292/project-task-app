import React, { Component } from "react";
import TaskCreateUpdate from "./create-update";
import { Tabs } from "antd";

const { TabPane } = Tabs;

class TaskDetail extends Component {

    render() {

        return (
            <Tabs defaultActiveKey="1" >
                <TabPane tab='Task Detail' key='1' >
                    <TaskCreateUpdate method='get' {...this.props} />
                </TabPane>
            </Tabs>
        );
    }
}

export default TaskDetail;