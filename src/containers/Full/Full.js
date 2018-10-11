import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import $ from 'jquery';

import urls from '../../urls.json';

import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/'
import CompanyDashboard from '../../views/Pages/CompanyDashboard/'
import HelpCenter from '../../views/Pages/HelpCenter/'
class Full extends Component {

  constructor(props) {
    super(props);
    this.state = {
      auth_token: localStorage.getItem('jwt'),
      x_profile: localStorage.getItem('x-profile'),
      companies: []
    }
    // this.getCompanies = this.getCompanies.bind(this);
  }

  componentDidMount() {
    // this.getCompanies();
  }

  removeSidebar(){
    $('.full-js-body').removeClass('sidebar-mobile-show');
  }

  // getCompanies() {
  //   let { history } = this.props;
  //   $.ajax({
  //     url: `${urls.server}/company`,
  //     headers: {
  //       "Content-type": "application/json",
  //       "X-Authorization": this.state.auth_token,
  //       "X-Profile": this.state.x_profile
  //     }
  //   }).then((json) => {
  //
  //     let comp = json.data;
  //
  //     let sComp = [];
  //
  //     Object.keys(comp).map((k, i) => {
  //       if (!parseInt(comp[k]["deleted"])) {
  //         sComp.push(comp[k]);
  //       }
  //     });
  //
  //     this.setState({
  //       companies: sComp
  //     });
  //
  //   }).catch((error) => {
  //     try {
  //       var err = error.responseJSON;
  //       if (typeof err.message !== 'undefined') {
  //         if (err.message == 'Must be logged in') {
  //           localStorage.removeItem('jwt');
  //           localStorage.removeItem('user');
  //           history.push(`/login`);
  //         }
  //         alert(err.message);
  //       }
  //     } catch (e) {
  //       alert("error: ", error.responseText);
  //     }
  //   });
  // }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }
  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  render() {
    let { companies } = this.state;

    return (
      <div className="app">
        <div className="nav-bar-btn">
          <a className="btn btn-default" onClick={this.mobileSidebarToggle}><i className="fa fa-bars"></i></a>
          </div>
        <div className="app-body">
          <Sidebar companies={companies} {...this.props} />
          <main className="main" onClick={this.removeSidebar}>
            <div className="container-fluid">
              <Switch>
                <Route path="/dashboard" name="Dashboard" render={(props) => {
                  return <CompanyDashboard companies={companies} {...props} />
                }} />
                <Route exact path="/help" name="HelpCenter" component={HelpCenter} />
                {/* <Route exact path="/payment" name="Payment" component={Payment} />
                <Route exact path="/thankyou" name="Thankyou" component={Thankyou} /> */}
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
