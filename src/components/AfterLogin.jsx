import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'

class AfterLogin extends Component {
  constructor(props) {

    super(props);

    this.isUserLoggedIn = this.isUserLoggedIn.bind(this);

  }

  isUserLoggedIn() {

    try {

      var token = localStorage.getItem("jwt");

      if (token && typeof token !== 'undefined') {
        var payload = token.split(".")[1];
        if (payload && typeof payload !== 'undefined') {
          var dPayJSON = JSON.parse(atob(payload));
          if (dPayJSON && typeof dPayJSON !== 'undefined') {
            var eDate = dPayJSON.expire.date;
            if (eDate) {
              eDate = new Date(eDate).getTime();
              if (new Date().getTime() < eDate) {
                return true;
              }
            }
          }
        }
      }
    } catch (e) {
      localStorage.removeItem("jwt");
      return false;
    }

    localStorage.removeItem("jwt");
    return false;
  }

  render() {
    const Component = this.props.component;
    const props = this.props;

    return (
      <Route {...props} render={props => (
        this.isUserLoggedIn() ? (
          <Component {...props} />
        ) : (
            <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
            }} />
          )
      )} />
    )

  }
}

export default AfterLogin