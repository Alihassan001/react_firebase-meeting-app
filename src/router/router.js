import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

//import screens
import Signin from "../screens/login";
import Home from "../screens/home";
import Profile from "../screens/profile";
import Location from "../screens/location";
import Meetings from "../screens/meetings";

export default function Router() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Switch>
          <Route exact component={Signin} path="/" />
          <Route exact component={Profile} path="/profile" />
          <Route exact component={Home} path="/home" />
          <Route exact component={Location} path="/location" />
          <Route exact component={Meetings} path="/meetings" />
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
}
