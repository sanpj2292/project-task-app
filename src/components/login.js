import React from "react";
import './css/login.css';
import { Form, Icon, Input, Button, Checkbox, Row, Col, Spin, Alert } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';


const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;

class LoginForm extends React.Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      // retrieves the URL set on the PrivateRoute component above
      let { from } = this.props.location.state || { from: { pathname: '/' } };
      this.props.onAuth(values.username, values.password, from);
    });
  };


  render() {
    const {error} = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {error ? <Alert message={Object.values(error.response.data)[0][0]}
                        closable type="error" /> : null}
        {this.props.loading ?
          <Spin indicator={antIcon} />
          :
          (<Form onSubmit={this.handleSubmit} className="login-form login-form-width">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: false,
              })(<Checkbox>Remember me</Checkbox>)}
              <div>
                <Row>
                  <Col xs={{ span: 6 }}>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      Log in
                    </Button>
                  </Col>
                  <Col xs={{ span: 6, offset: 6 }}>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      <a href="/app/register/">Register now!</a>
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form.Item>
          </Form>)
        }
      </div>
    );
  }
}

const Login = Form.create({ name: 'LoginForm' })(LoginForm);

const mapStateToProps = state => {
  return {
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.token !== null,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password, from) =>  dispatch(actions.authLogin(username, password, from))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);