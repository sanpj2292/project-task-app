import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import CreateProject from "./containers/project/create-update";
import ProjectDetails from "./containers/project/detail";
import TaskCreateUpdate from "./containers/task/create-update";
import TaskDetail from "./containers/task/detail";

const BaseRouter = () => (
  <div>
    <Route exact path="/">
      <Redirect from="/" to="/project/" />
    </Route>
    <Route exact path="/login/" component={Login} />
    <Route exact path="/app/register/" component={Register} />
    <Route exact path="/project/" component={Home} />
    <Switch>
      <Route exact path="/project/create" render={(props) => <CreateProject method='post' {...props} />} />
      <Route exact path="/project/:projectID" render={(props) => <ProjectDetails {...props} />} />
      <Route exact path="/project/:projectID/task/create"
        render={(props) => <TaskCreateUpdate method='post' {...props} />} />
      <Route exact path="/project/:projectID/task/:taskID"
        render={(props) => <TaskDetail {...props} />} />
    </Switch>
  </div>
);

export default BaseRouter;
