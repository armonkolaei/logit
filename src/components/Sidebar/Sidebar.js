import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom'
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import urls from '../../urls.json';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    
    let { companyId } = this.props.match.params;
    
    this.state = {
      auth_token: localStorage.getItem("jwt"),
      x_profile: localStorage.getItem('x-profile'),
      companies: [],
      company_id: companyId,
      loading:false,
      company_setting_created:false,
      selected_company : false,
      onload_company_id : '',
      more_than_one_company: false,
      employee_id:''
    }

    this.logoutUser = this.logoutUser.bind(this);
    this.onCompanyChange = this.onCompanyChange.bind(this);
    this.launchTimeClock = this.launchTimeClock.bind(this);
    this.onloadCheckCompanySettings = this.onloadCheckCompanySettings.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  componentWillReceiveProps( nextProps ) {
    let { history } = this.props;
  
   if(nextProps.location.state && nextProps.location.state.settings_updated && this.state.company_id)
   {
    const settings_updated = nextProps.location.state.settings_updated;
    this.setState({company_setting_created : true});
    
   }
   const {companies}=nextProps;
   //console.log("UPDATED COMPANIES",companies);
  //  if(companies.length > 1)
  //  {
  //   this.setState({ more_than_one_company:true });
  //  }
   let selected_company = '';
   let first_comapny = false;
   if(nextProps.location.state && nextProps.location.state.new_company_added && nextProps.location.state.companyId)
   {
      selected_company = nextProps.location.state.companyId;
      first_comapny = true;
      if(companies.length === 1)
      {
        this.setState({companies,onload_company_id:selected_company,company_id:selected_company,selected_company:first_comapny},function(){
          this.onloadCheckCompanySettings(nextProps.location.state.companyId);
        })
      }
      else
      {
        this.setState({companies,onload_company_id:selected_company,selected_company:first_comapny},function(){
          this.onloadCheckCompanySettings(nextProps.location.state.companyId);
        })
      }
      
   }
   else
   {
    companies.map((comp,index) => {
      // var companyId = this.state.company_id
      // //console.log("SSSCOMAP",this.props);
      // if(companyId !== "")
      // {
      //   if(companyId === comp["id"])
      //   {
      //     selected_company = comp["id"];
      //     first_comapny = true;
      //   }
      // }
      // else
       if(index === 0)
      { 
        selected_company = comp["id"];
        first_comapny = true;
      }
    });

    if(companies.length === 1)
    {
      this.setState({companies,onload_company_id:selected_company,company_id:selected_company,selected_company:first_comapny})
    }
    else
    {
      this.setState({companies,onload_company_id:selected_company,selected_company:first_comapny})
    }
   }
   

  
   
  }

  componentDidMount() { 
    let { history } = this.props;
    this.getProfile();
    setTimeout(function() { 
      if(this.state.selected_company)
      {
        this.onloadCheckCompanySettings(this.state.onload_company_id);
      }
     }.bind(this), 2000);
  }
  getProfile() {		
		
		let { history } = this.props;
		$.ajax({
		  url: `${urls.server}/user/bysession`,
		  headers: {
			"Content-type": "application/json",
			"X-Authorization": this.state.auth_token,
			"X-Profile": this.state.x_profile
		  }
		}).then((json) => {
			   
    let data = json.data;
    let employee = data.employee;
		
		this.setState({employee_id:employee[0].id});
		
		}).catch((error) => {
		  //console.log("error",error);
		  //alert(error.responseText);		  
		});
	
	}
  logoutUser() {

    let { history } = this.props;
    this.setState({loading:true});
    $.ajax({
      url: `${urls.server}/users/logout`,
      headers: {
        "Content-type": "application/json",
        "X-Authorization": this.state.auth_token,
        "X-Profile": this.state.x_profile
      }
    }).then((json) => {
      //alert(json.message);
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("x-profile");
      history.push("/");
    }).catch((error) => {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("x-profile");
      history.push("/");
    })

  }
  onloadCheckCompanySettings(company_id)
  {
   
    let { history } = this.props;
    let value = company_id;
    this.setState({loading:true});
    if(value !="new")
    {
        if(this.state.x_profile == 0)
        {
          
          if (!value) {
            toast.warn("Please select company from the dropdown", {
              position: toast.POSITION.TOP_CENTER
            });
            setTimeout(function() { history.push(`/dashboard`); }.bind(this), 2000);
            return false;
          }
          
         
          $.ajax({
            url: `${urls.server}/dashboard/byCompany/${value}`,
            headers: {
              "Content-type": "application/json",
              "X-Authorization": this.state.auth_token,
              "X-Profile": this.state.x_profile
            }
          }).then((json) => {
            let { data } = json;
            this.setState({ company_id: value ,loading:false,company_setting_created:data.notifications.company_setting_created});
            if(!data.notifications.company_setting_created)
            {
              
              toast.warn("Company Settings needs to be updated.  Redirecting now.", {
                position: toast.POSITION.TOP_CENTER
              });
              setTimeout(function() { history.push(`/company/${value}/settings`); }.bind(this), 3000);
            }
            else
            {
              history.push(`/company/${value}`);
            }
           
          }).catch((error) => {
            try {
              var err = error.responseJSON;
              if (typeof err.message !== 'undefined') {
                if (err.message == 'Must be logged in') {
                  localStorage.removeItem('jwt');
                  localStorage.removeItem('user');
                  history.push(`/login`);
                }
                if(`${urls.development_mode}` == "Debug")
                {
                  alert(err.message);
                }
               
              }
            } catch (e) {
              if(`${urls.development_mode}` == "Debug")
              {
                alert("error: ", error.responseText);
              }
             
            }
          });
        }
        else
        {
          this.setState({loading:false});
          history.push(`/company/${value}`);
        }
          
    }
    else
    {
      history.push(`/company/create`);
    }
  }
  onCompanyChange(e) {

    let { history } = this.props;

    let value = (typeof e !== 'undefined') ? e.target.value : this.state.company_id;
    if(value !="new")
    {
      this.setState({ company_id: value });
      
          if (!value) {
            toast.warn("Please select company from the dropdown", {
              position: toast.POSITION.TOP_CENTER
            });
            setTimeout(function() { history.push(`/dashboard`); }.bind(this), 2000);
            return false;
          }
          this.setState({loading:true});
          ////console.log("PROFILE",this.state.x_profile);
          $.ajax({
            url: `${urls.server}/dashboard/byCompany/${value}`,
            headers: {
              "Content-type": "application/json",
              "X-Authorization": this.state.auth_token,
              "X-Profile": this.state.x_profile
            }
          }).then((json) => {
            let { data } = json;
           // //console.log("COMPANY_DATA",data);
            this.setState({loading:false,company_setting_created:data.notifications.company_setting_created});
            if(!data.notifications.company_setting_created)
            {
              
              toast.warn("Company Settings needs to be updated.  Redirecting now.", {
                position: toast.POSITION.TOP_CENTER
              });
              setTimeout(function() { history.push(`/company/${value}/settings`); }.bind(this), 3000);
            }
            else
            {
              history.push(`/company/${value}`);
            }
            
             
           
          }).catch((error) => {
            try {
              var err = error.responseJSON;
              if (typeof err.message !== 'undefined') {
                if (err.message == 'Must be logged in') {
                  localStorage.removeItem('jwt');
                  localStorage.removeItem('user');
                  history.push(`/login`);
                }
                if(`${urls.development_mode}` == "Debug")
                {
                  alert(err.message);
                }
               
              }
            } catch (e) {
              if(`${urls.development_mode}` == "Debug")
              {
                alert("error: ", error.responseText);
              }
             
            }
          });
    }
    else
    {
      history.push(`/company/create`);
    }
    this.removeSidebar();

  }

  componentWillUnmount() { }

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  launchTimeClock() {

    let { history } = this.props;
    let company_id = (this.state.company_id === undefined) ? this.state.onload_company_id : this.state.company_id;
    if (!company_id) {
      toast.warn("Please select company from the dropdown", {
        position: toast.POSITION.TOP_CENTER
      });
      return false;
    }

    let token = localStorage.getItem('jwt');
    
    let obj = JSON.stringify({
      token,
      company_id
    });

    localStorage.setItem('timeclock', obj);

    localStorage.removeItem('jwt');
    localStorage.removeItem('user');

    history.push("/timeclock");
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }
  removeSidebar(){
    
    $('.full-js-body').removeClass('sidebar-mobile-show');
  }
  render() {

    let { companies } = this.state;
    
    let company_id = (this.state.company_id === undefined) ? this.state.onload_company_id : this.state.company_id;

    let currentSelectedComapny=companies.find(o => o.id === company_id);
    ////console.log('currentSelectedComapny',currentSelectedComapny);

    return (
      <div>
      <ToastContainer 
        position="top-left"
        type="default"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item fixed-logo">
            <NavLink to={(company_id) ? `/company/${company_id}` : '/dashboard'}  onClick={this.removeSidebar}>
            {currentSelectedComapny&&currentSelectedComapny.logo_url?(<img src={currentSelectedComapny.logo_url} className="logo-img"  />):( <img src="/img/logo.png" className="logo-img" />)}
            </NavLink>
            </li>
            
            
            <li className="nav-item" >
            {/* <li className="nav-item" style={{
              borderBottomWidth: 1,
              borderBottomColor: '#fff',
              borderBottomStyle: 'solid'
            }}> */}
              <label>Logged in as</label>
              <select id="company_id" name="select" className="form-control company-select" value={company_id} onChange={this.onCompanyChange}>
                <option value="">{(companies.length > 0) ? 'Select a company' : 'Select a company'}</option>
                {this.state.x_profile == 0 ? (<option value="new">Add a company</option>) : null }
                {
                  companies.map((comp,index) => {
                    //var selected_company = (comp["id"] === this.state.company_id) ? 'true' : '' ; 
                    return (
                      <option key={comp["id"]} value={comp["id"]} >{comp["name"]}</option>
                    )
                  })
                }
              </select>
            </li>
           
           
            <li className="nav-item">
              <NavLink to={(company_id) ? `/company/${company_id}` : '/dashboard'} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Home </NavLink>
            </li>
			
			<li className="nav-item">
              <NavLink to={(company_id) ? `/company/${company_id}` : '/dashboard'} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Apps </NavLink>
            </li>
			
            {this.state.x_profile == 0 ? (
            <li className="nav-item">
                  <NavLink to={`/company`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Companies </NavLink>
            </li>
            ) : null }
            {this.state.x_profile == 0 ? (
            <div>
            {
              (company_id) ? (
                <div>
                  
                { (this.state.company_setting_created) ?  
                  <li className="nav-item">
                  <NavLink to={`/company/${company_id}/employee`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Employees </NavLink>
                </li>: <li className="nav-item">
                    <NavLink to={`#`} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Employees </NavLink>
                  </li>
                  }
                 
                  { (this.state.company_setting_created) ?  
                  <li className="nav-item">
                    <NavLink to={`/company/${company_id}/timecard`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Time Cards </NavLink>
                  </li>: <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Time Cards </NavLink>
                  </li>
                  }
                 
                  { (this.state.company_setting_created) ?  
                    <li className="nav-item">
                    <NavLink to={`/company/${company_id}/payroll`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Payroll </NavLink>
                  </li>: <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Payroll </NavLink>
                  </li>
                  }

                  { (this.state.company_setting_created) ?  
                    <li className="nav-item">
                    <NavLink to={`/company/${company_id}/accrualsemplist`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Vacation Pay </NavLink>
                  </li>: <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Vacation Pay </NavLink>
                  </li>
                  }

                  { (this.state.company_setting_created) ?  
                    <li className="nav-item">
                    <NavLink to={`/company/${company_id}/accrualrequests`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Requests </NavLink>
                  </li>: <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Requests </NavLink>
                  </li>
                  }

                  
                 
                  


                  { (this.state.company_setting_created) ?  
                    <li className="nav-item">
                      <NavLink to={`/reports`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Reports </NavLink>
                    </li>: <li className="nav-item" >
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Reports </NavLink>
                  </li>
                  }
              { (this.state.company_setting_created) ?  
              <li className={this.activeRoute("/documents")}>
                    <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}>Documents</a>
              

              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={`/company/${company_id}/documents/t4s`} className="nav-link" activeClassName="active"> T4</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={`/roe/employee/${company_id}`} className="nav-link" activeClassName="active">ROE</NavLink>
                </li>
                {/* <li className="nav-item">
                  <NavLink to={'/documents/wsib'} className="nav-link" activeClassName="active">WSIB
                  </NavLink>
                </li>                 */}
              </ul>
              </li>
             :
             <li className="nav-item" >
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Documents </NavLink>
              </li>
              }
                  { (this.state.company_setting_created) ?  
                    <li className="nav-item"  style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#fff',
                      borderBottomStyle: 'solid'
                    }}>
                    <a className="nav-link" onClick={this.launchTimeClock}> Launch Time Clock <img src="/img/clock-icon.png" className="clock-img" /></a>
                  </li>: <li className="nav-item" style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#fff',
                      borderBottomStyle: 'solid'
                    }}>
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Launch Time Clock <img src="/img/clock-icon.png" className="clock-img" /></NavLink>
                  </li>
                  }
                  
                  {/* <li className="nav-item">
                    <NavLink to={`/company/${this.state.company_id}/timerecord`} className="nav-link" activeClassName="active"> Time Records </NavLink>
                  </li> */}
                 
                  
                  <li className="nav-item">
                    <NavLink to={`/company/${company_id}/settings`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Company Settings </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to={`/company/info/${company_id}`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Company Profile </NavLink>

                  </li>
                </div>
              ) : (
                <div>

                  <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Employees </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Time Cards </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Payroll </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Vacation Pay </NavLink>
                  </li>
                  
                  <li className="nav-item" >
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Reports </NavLink>
                  </li>
                  <li className="nav-item" >
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Documents </NavLink>
                  </li>
                  <li className="nav-item" style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#fff',
                    borderBottomStyle: 'solid'
                  }}>
                    <a className="nav-link disabled-color"  > Launch Time Clock <img src="/img/clock-icon.png" className="clock-img" /></a>
                  </li>
                  <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Company Settings </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}> Company Profile </NavLink>
                  </li>
                </div>
                )
            }
          </div>
        ) : (
        <div>
          {
              
              <div>
                <li className="nav-item">
                    <NavLink to={`/employee/paystubs/${this.state.employee_id}`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Pay stubs </NavLink>
                </li>   
                <li className="nav-item">
                    <NavLink to={`/employee/myrequests/${this.state.employee_id}`} className="nav-link " activeClassName="active" onClick={this.removeSidebar}> My requests </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to={`/company/${company_id}/employee/${this.state.employee_id}/accruals`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Vacation Pay </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to={``} className="nav-link disabled-color" activeClassName="active" onClick={this.removeSidebar}>Settings </NavLink>
                </li>
              </div>
          }
        </div>) }
            
            <li className="nav-item" >
              <NavLink to={`/help`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}> Help Center </NavLink>
            </li>
            
            <li className="nav-item" >
              <NavLink to={`/updateprofile`} className="nav-link" activeClassName="active" onClick={this.removeSidebar}>User Profile</NavLink>
            </li>
           
            <li className="nav-item" style={{
              borderTopWidth: 1,
              borderTopColor: '#fff',
              borderTopStyle: 'solid',
              marginTop:'12px',
              marginBottom:'50px'
            }} >
              <NavLink to={'#'} className="nav-link" onClick={this.logoutUser}><i className="icon-power"></i> Logout</NavLink>
            </li>
            

            {/* <li className={this.activeRoute("/components")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Components</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/components/buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Buttons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/social-buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Social Buttons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/cards'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Cards</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/forms'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Forms</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/modals'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modals</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/switches'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Switches</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/tables'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tables</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/components/tabs'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tabs</NavLink>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/icons")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Icons</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/icons/font-awesome'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Font Awesome</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/icons/simple-line-icons'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Simple Line Icons</NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink to={'/widgets'} className="nav-link" activeClassName="active"><i className="icon-calculator"></i> Widgets <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/charts'} className="nav-link" activeClassName="active"><i className="icon-pie-chart"></i> Charts</NavLink>
            </li>
            <li className="divider"></li>
            <li className="nav-title">
              Extras
            </li>
            <li className="nav-item nav-dropdown">
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Pages</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/login'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/register'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Register</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/404'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 404</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/500'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 500</NavLink>
                </li>
              </ul>
            </li> */}
            
          </ul>
        </nav>
        
      </div>
      </div>
    )
  }
}

export default Sidebar;
