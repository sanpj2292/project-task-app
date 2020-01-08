import React from 'react';
import 'antd/dist/antd.css';
import {connect} from "react-redux";
import CustomLayout from './containers/CustomLayout'
import BaseRouter from "./routes";
import {BrowserRouter as Router} from "react-router-dom";
import * as actions from './store/actions/auth';

class App extends React.Component{
    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    render() {
        return (
            <div>
                <Router>
                    <CustomLayout {...this.props}>
                        <BaseRouter/>
                    </CustomLayout>
                </Router>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
