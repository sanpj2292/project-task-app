import React from 'react';
import { Button, Card, Icon, Avatar, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import showDeleteConfirm from '../../components/delete-modal';
import constants from '../../constants';
import Description from "../../components/description";

const { Meta } = Card;

class ProjectCard extends React.Component {

    render() {
        const { project, token } = this.props;
        return (
            <Card key={`project-card-${project.id}`}
                hoverable
                actions={[
                    <Link to={`${project.id}`}>
                        <Tooltip placement="bottom" title="Project Detail View">
                            <Icon type="read" />
                        </Tooltip>
                    </Link>,
                    <Button onClick={() => showDeleteConfirm({
                        url: `${constants.HOST}/api/project/${project.id}/`,
                        token: token,
                        entity: 'Project',
                        dataKey: `${project.name}`
                    })} type="danger" >
                        <Icon type="delete" />
                    </Button >,
                ]}
            >
                <Meta
                    avatar={<Avatar src={project.avatar ? project.avatar : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} />}
                    title={`${project.name}`}
                    description={<Description content={`${project.description}`} />}
                />
            </Card>
        )
    }

}

export default ProjectCard;