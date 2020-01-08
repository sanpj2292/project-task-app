import React from "react";
import { Button, Col, Row, Tooltip, Tabs } from "antd";
import { Link } from "react-router-dom";
import Projects from "../containers/project/list";

const { TabPane } = Tabs;

class Home extends React.Component {
  render() {
    return (
      <Tabs defaultActiveKey="1" >
        <TabPane tab='Projects' key='1' >
          <Row gutter={[8, 24]} type='flex' justify='end'>
            <Col span={4.5}>
              <Tooltip placement="bottom" title="Create Project">
                <Button icon="plus" type="primary">
                  <Link style={{ color: "rgba(255,255,255)", marginLeft: '2px' }} to="create">Create</Link>
                </Button>
              </Tooltip>
            </Col>
          </Row>
          <Row gutter={[8, 24]} type='flex' justify='start'>
            <Col span={24}>
              <Projects />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    );
  }
}

export default Home;
