import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Home from "../components/home";
import Login from "../components/login";
import Register from "../components/register";
import CreateProject from "../containers/project/create-update";
import ProjectDetails from "../containers/project/detail";
import TaskCreateUpdate from "../containers/task/create-update";
import TaskDetail from "../containers/task/detail";
import AuthenticatedRoute from "./authenticated-routes";

const BaseRouter = (props) => {
    return (
          <div>
            <Route exact path="/login/" component={Login} />
            <Route exact path="/app/register/" component={Register} />
            <Switch>
                <Route  exact path="/">
                    <Redirect from="/" to="/project/" />
                </Route>
                <Route exact path="/project/" component={Home} />
                <AuthenticatedRoute exact path="/project/create"
                                    component={CreateProject} />
                <AuthenticatedRoute exact path="/project/:projectID"
                                    component={ProjectDetails}
                                     />
                <AuthenticatedRoute exact path="/project/:projectID/task/create"
                                    method='post' {...props} component={TaskCreateUpdate}/>
                <AuthenticatedRoute exact path="/project/:projectID/task/:taskID"
                       component = {TaskDetail} />
            </Switch>
          </div>
    )
};

export default BaseRouter;
