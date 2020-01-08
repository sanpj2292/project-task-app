import React from "react";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import * as moment from "moment";
import showDeleteConfirm from '../../components/delete-modal';
import { connect } from 'react-redux';
import constants from '../../constants';


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
      render: (text, record) => <Button onClick={() => showDeleteConfirm({
        url: `${constants.HOST}/api/project/${record.id}`,
        token: this.props.token,
        entity: 'Project',
        dataKey: `${record.name}`
      })} type="danger" >
        Delete
      </Button >
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
        <Table columns={this.columns} bordered dataSource={projects}></Table>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Projects);
