import React, { Component } from "react";
import { Form, Row, Col, Input, Button } from 'antd';
import * as actions from "../store/actions/auth";
import { connect } from 'react-redux';

class RegisterForm extends Component {

    state = {
        confirmDirty: false,
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password_1')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            if (value.length < 8) {
                callback('Password length must have atlease 8 characters');
            }
            form.validateFields(['password_2'], { force: true });
        }
        callback();
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, vals) => {
            if (!err) {
                console.log('Received Values: ', vals);
                this.props.onAuth(vals.username, vals.email, vals.password_1, vals.password_2);
                // this.props.history.push('/');
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Row type='flex' justify='center'>
                <Col span={10}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label='Username'>
                            {getFieldDecorator('username',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your username!'
                                        }
                                    ],
                                })(<Input placeholder="Enter your username" />)
                            }
                        </Form.Item>
                        <Form.Item label='Password' hasFeedback>
                            {getFieldDecorator('password_1',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your Password!'
                                        },
                                        {
                                            validator: this.validateToNextPassword
                                        }
                                    ],
                                })(<Input.Password placeholder="Password" />)
                            }
                        </Form.Item>
                        <Form.Item label='Confirm Password' hasFeedback>
                            {getFieldDecorator('password_2',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input the same password!'
                                        },
                                        {
                                            validator: this.compareToFirstPassword
                                        }
                                    ],
                                })(<Input.Password
                                    onBlur={this.handleConfirmBlur}
                                    placeholder="Confirm Password" />)
                            }
                        </Form.Item>
                        <Form.Item label='E-mail'>
                            {getFieldDecorator('email', {
                                rules: [{ type: 'email' }, {
                                    required: false
                                }]
                            })(<Input
                                placeholder="Enter your Email"
                            />)}
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Register
                        </Button>
                    </Form>
                </Col>
            </Row>
        );
    }
}

const Register = Form.create({ name: 'RegisterForm' })(RegisterForm);


const mapStateToProps = state => {
    return {
        loading: state.loading,
        error: state.error,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => {
            return dispatch(actions.authSignUp(username, email, password1, password2));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);