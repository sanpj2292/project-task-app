import React from 'react';
import 'antd/dist/antd.css';
import {connect} from "react-redux";
import CustomLayout from './containers/CustomLayout'
import BaseRouter from "./routes/routes";
import * as actions from './store/actions/auth';
import { withRouter } from 'react-router-dom';

class App extends React.Component{
    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    render() {
        return (
            <CustomLayout {...this.props}>
                <BaseRouter history={this.props.history} {...this.props}/>
            </CustomLayout>
        );
    }
}

// The below function enables the values inside the return object
// to be accessed in the props of this Component
const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
