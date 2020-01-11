import React from 'react';
import { Layout, Menu } from "antd";
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

const { Header, Content } = Layout;

class CustomLayout extends React.Component {

  handleLogout = async () => {
    try {
      await this.props.logout();
      this.props.history.push('/login/');
    } catch (e) {
      console.error(e.message);
    }
  };

  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[this.props.location.pathname.split('/')[1],]}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="project">
              <Link to='/project/'>Projects</Link>
            </Menu.Item>
            {this.props.isAuthenticated ?
              (<Menu.Item key="login" onClick={this.handleLogout}>Logout</Menu.Item>) :
              (<Menu.Item key="login">
                <Link to='/login/'>Login</Link>
              </Menu.Item>)
            }
          </Menu>
        </Header>
        <Content style={{ padding: '16px 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            {this.props.children}
          </div>
        </Content>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.authLogout())
  }
};

export default withRouter(connect(null, mapDispatchToProps)(CustomLayout));