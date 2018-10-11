import React, { Component } from 'react';

import urls from '../../../urls.json';

class HelpCenter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      auth_token: localStorage.getItem("jwt"),
      x_profile: localStorage.getItem('x-profile'),
    };

  }

  componentDidMount() { }

  render() {

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h2>Help center</h2>
            <hr className="title-separator" />
          </div>
        </div>
        <div className="row">
            <div className="col-12">
            <span className="body-text">
                    <i className="fa fa-check"  aria-hidden="true"></i><span className="step-title"> Step 1: Create user account</span><br/>
                    <div className="step-title-below-text-one">Your user account is the highest level admin account. You can control everything from here.</div>
              </span>
              <div className="main-body-text">
              <span className="body-text">
                    <span className="step-title">Step 2: Add your company</span><br/>
                    <div className="step-title-below-text">           
You need a company for each entity you pay employees from. Each company requires a unique Payroll Identifier ID from Canada Revenue (i.e. RP0001) to pay employees.</div>
              </span>
              </div>
              <div className="main-body-text">
              <span className="body-text">
                    <span className="step-title">Step 3: Add your employees</span><br/>
                    <div className="step-title-below-text">Each employee is associated with a company.</div>
              </span>
              </div>
              <div className="main-body-text">
              <span className="body-text">
                    <span className="step-title">Step 4: Enter your settings</span><br/>
                    <div className="step-title-below-text">The final step before using this service! We’ll need to know things like your current pay period start date, pay frequency, and some
YTD values from your last payroll for a smooth mid-year payroll transition.</div>                   
              </span>
              </div>
            </div>
        </div>
      </div >
    )
  }
}

export default HelpCenter;