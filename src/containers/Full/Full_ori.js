import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import $ from 'jquery';

import urls from '../../urls.json';

import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/'
import CompanyDashboard from '../../views/Pages/CompanyDashboard/'
import CompanyList from '../../views/Pages/CompanyList/'
import AddCompany from '../../views/Pages/AddCompany/'
import UpdateCompany from '../../views/Pages/UpdateCompany/'
import EmployeeList from '../../views/Pages/EmployeeList/'
import AddEmployee from '../../views/Pages/AddEmployee/'
import UpdateEmployee from '../../views/Pages/UpdateEmployee/'
import TimeRecord from '../../views/Pages/TimeRecord/'
import TimeRecordList from '../../views/Pages/TimeRecordList/'
import Charts from '../../views/Charts/'
import Widgets from '../../views/Widgets/'
import Buttons from '../../views/Components/Buttons/'
import Cards from '../../views/Components/Cards/'
import Forms from '../../views/Components/Forms/'
import Modals from '../../views/Components/Modals/'
import SocialButtons from '../../views/Components/SocialButtons/'
import Switches from '../../views/Components/Switches/'
import Tables from '../../views/Components/Tables/'
import Tabs from '../../views/Components/Tabs/'
import FontAwesome from '../../views/Icons/FontAwesome/'
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/'

class Full extends Component {

  constructor(props) {
    super(props);

    this.state = {
      auth_token: localStorage.getItem('jwt'),
      companies: []
    }

    this.getCompanies = this.getCompanies.bind(this);
  }

  componentDidMount() {
    this.getCompanies();
  }

  getCompanies() {

    $.ajax({
      url: `${urls.server}/company`,
      headers: {
        "Content-type": "application/json",
        "X-Authorization": this.state.auth_token
      }
    }).then((json) => {

      let comp = json.data;
      let sComp = [];

      Object.keys(comp).map((k, i) => {
        if (!parseInt(comp[k]["deleted"])) {
          sComp.push(comp[k]);
        }
      });

      this.setState({
        companies: sComp
      });

    }).catch((error) => {
      try {
        var err = error.responseJSON;
        if (typeof err.message !== 'undefined') {
          alert(err.message);
        }
      } catch (e) {
        alert("error: ", error.responseText);
      }
    });
  }

  render() {

    let { companies } = this.state;

    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar companies={companies} {...this.props} />
          <main className="main">
            <Breadcrumb />
            <div className="container-fluid">
              <Switch>
                {/* <Route path="/dashboard" name="Dashboard" component={CompanyDashboard} /> */}
                <Route path="/dashboard" name="Dashboard" render={(props) => {
                  return <CompanyDashboard companies={companies} {...props} />
                }} />
                <Route exact path="/company" name="company" render={(props) => {
                  return <CompanyList updateCompanies={this.getCompanies} {...props} />
                }} />
                <Route exact path="/company/create" name="add company" render={(props) => {
                  return <AddCompany updateCompanies={this.getCompanies} {...props} />
                }} />
                <Route exact path="/company/edit/:companyId" name="add company" component={UpdateCompany} />
                <Route exact path="/company/:companyId" name="impersonate in company" render={(props) => {
                  return <CompanyDashboard companies={companies} {...props} />
                }} />
                <Route exact path="/company/:companyId/employee" name="employee" component={EmployeeList} />
                <Route exact path="/company/:companyId/employee/create" name="employee" component={AddEmployee} />
                <Route exact path="/company/:companyId/employee/edit/:employeeId" name="update employee" component={UpdateEmployee} />
                <Route exact path="/company/:companyId/employee/:employeeId/timerecord" name="time record of employee" component={TimeRecord} />
                <Route exact path="/company/:companyId/timerecord" name="time records" component={TimeRecordList} />
                <Route path="/components/buttons" name="Buttons" component={Buttons} />
                <Route path="/components/cards" name="Cards" component={Cards} />
                <Route path="/components/forms" name="Forms" component={Forms} />
                <Route path="/components/modals" name="Modals" component={Modals} />
                <Route path="/components/social-buttons" name="Social Buttons" component={SocialButtons} />
                <Route path="/components/switches" name="Swithces" component={Switches} />
                <Route path="/components/tables" name="Tables" component={Tables} />
                <Route path="/components/tabs" name="Tabs" component={Tabs} />
                <Route path="/icons/font-awesome" name="Font Awesome" component={FontAwesome} />
                <Route path="/icons/simple-line-icons" name="Simple Line Icons" component={SimpleLineIcons} />
                <Route path="/widgets" name="Widgets" component={Widgets} />
                <Route path="/charts" name="Charts" component={Charts} />
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
