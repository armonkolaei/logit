import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import $ from 'jquery';
import urls from './urls.json';
// Containers
import Full from './containers/Full/'

// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import softRegister from './views/Pages/softRegister/'
import RecoverPassword from './views/Pages/RecoverPassword'
import TermsofSerive from './views/Pages/TermsofSerive'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'
import ResetPassword from './views/Pages/ResetPassword/'
import SetPassword from './views/Pages/SetPassword/'
import ChangePassword from './views/Pages/ChangePassword/'
import Portal from './views/Pages/Portal/'

function convertToDateForIE(dateString) {
  var str = dateString.replace(/^(.*-[0-9][0-9])(\ )([0-9][0-9]\:.*$)/, '$1T$3')
  var d = Date.parse(str);
  return d;
}

function loggedIn() {
  try {

    var token = localStorage.getItem("jwt");
    var user = localStorage.getItem("user");

    if (token && user && typeof token != 'undefined') {
      var payloadArray = token.split(".");
      var payload = payloadArray[1];
      if (payload && typeof payload != 'undefined') {
        var dPayNonJSON = atob(payload);

        var dPayJSON = JSON.parse(dPayNonJSON);

        if (dPayJSON && typeof dPayJSON != 'undefined') {
          var eDate = dPayJSON.expire.date;
          if (eDate) {
            var eDateTimeStamp =convertToDateForIE(eDate);
            var currentTimeStamp = new Date().getTime();
            if (currentTimeStamp < eDateTimeStamp) {
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

const AfterLogin = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    loggedIn() ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
      )
  )} />
)

const BeforeLogin = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    !loggedIn() ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/portal_select',
          state: { from: props.location }
        }} />
      )
  )} />
)

const history = createBrowserHistory();

ReactDOM.render((
  <Router history={history}>
    <Switch>
      <BeforeLogin exact path="/login" name="Login Page" component={Login} />
      <BeforeLogin exact path="/register" name="Register Page" component={Register} />
      <BeforeLogin exact path="/soft_register" name="Register Page" component={softRegister} />
      <BeforeLogin exact path="/recover_password" name="Forgot Password" component={RecoverPassword} />
      <Route exact path="/terms_of_service" name="Terms on Service Page" component={TermsofSerive} />
      <Route exact path="/set_password" name="Set Password" component={SetPassword} />
      <Route exact path="/change_password" name="Change Password" component={ChangePassword} />
      <AfterLogin exact path="/resetpassword" name="Change Password" component={ResetPassword} />
      <Route exact path="/404" name="Page 404" component={Page404} />
      <Route exact path="/500" name="Page 500" component={Page500} />
	    <AfterLogin path="/portal" name="Portal" component={Portal} />
      <AfterLogin path="/" name="Home" component={Full} />
    </Switch>
  </Router>
), document.getElementById('root'))
