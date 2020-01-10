import React from "react";
import { Table, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import * as moment from "moment";
import showDeleteConfirm from '../../components/delete-modal';
import { connect } from 'react-redux';
import constants from '../../constants';
import ProjectCard from './card';


var momentDurationFormatSetup = require("moment-duration-format");

momentDurationFormatSetup(moment);

const mapStateToProps = function (state) {
  return {
    token: state.token,
  }
};

class Projects extends React.Component {
  state = {
    projects: []
  };

  columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <Link to={`${record.id}`}>{text}</Link>
    },
    {
      title: "Project Description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Project Duration",
      dataIndex: "duration",
      key: "duration"
    }, {
      title: 'Action(Delete)',
      dataIndex: 'id',
      render: (text, record) => {
        const { token } = this.props;
        return (<Button onClick={() => showDeleteConfirm({
          url: `${constants.HOST}/api/project/${record.id}/`,
          token: token,
          entity: 'Project',
          dataKey: `${record.name}`
        })} type="danger" >
          Delete
      </Button >)
      }
    }
  ];

  componentDidMount() {
    let prj_id;
    if (this.props.match && this.props.match.params.projectID) {
      prj_id = this.props.match.params.projectID;
    }
    let url = constants.HOST + "/api/project/";
    if (prj_id) {
      url = `${constants.HOST}/api/project/${prj_id}`;
    }
    axios
      .get(url)
      .then(res => {
        const projects = res.data;
        console.log(projects)
        this.setState({ projects: projects });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { projects } = this.state;
    return (
      <div>
        <Row gutter={[16, 16]}>
          {
            projects.map(proj =>
              <Col className="gutter-row" span={8} >
                <ProjectCard project={proj} token={this.props.token} />
              </Col>)
          }
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Projects);
