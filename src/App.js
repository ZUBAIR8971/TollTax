import React, { Component } from 'react';
import {Route , Switch} from "react-router-dom";

import "./Assets/css/style.css";

import Navbar from './components/Navbar';

import Entry from './components/Entry';
import Exit from './components/Exit';
class App extends Component {

  render() {
    return (
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Entry} />
          <Route exact path="/exitToll" component={Exit} />
        </Switch>
      </>
    );
  }
}

export default App;