import React from "react";
import { Tabs } from "antd";
import CreateProject from "./create-update";
import TaskList from "../task/list";
import { connect } from "react-redux";

const { TabPane } = Tabs;

class ProjectDetail extends React.Component {

    render() {
        return (
            <Tabs defaultActiveKey="1" >
                <TabPane tab='Project Detail' key='1' >
                    <CreateProject method='get' {...this.props} />
                </TabPane>
                <TabPane tab='Project Tasks' key='2' >
                    <TaskList {...this.props} />
                </TabPane>
            </Tabs>
        );
    }
}
const mapStateToProps = state => {
    return {
        token: state.token
    };
};

export default connect(mapStateToProps)(ProjectDetail);