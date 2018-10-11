import React, { Component } from 'react';

class ResetPassword extends Component {


  constructor(props) {
    super(props);
    
    this.state = {
       old_password: '',
       new_password: ''
    }
    
    this.changePassword = this.changePassword.bind(this);
    this.updateOldPasswordState = this.updateOldPasswordState.bind(this);
    this.updateNewPasswordState = this.updateNewPasswordState.bind(this);
  }

  changePassword() {

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4)
        if (this.status == 200) {
          alert("Success");
          alert(this.responseText);
        } else {
          alert("There was an error");
          alert(this.responseText);
        }
      };
      xhttp.open("POST", "http://motherclock.us-east-1.elasticbeanstalk.com/users/changepassword", false);
      xhttp.setRequestHeader("Content-type", "application/json");
      var params = '{' +
      '"old_password" : ' + '"' + this.state.old_password + '"' + ',' +
      '"new_password" : ' + '"' + this.state.new_password + '" }';
      alert(params);
      xhttp.send(params);
      return xhttp.responseText;
  }

  updateOldPasswordState(e) {
   this.setState({old_password: e.target.value});
  }

  updateNewPasswordState(e) {
   this.setState({new_password: e.target.value});
  }
    
  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card mx-4">
                <div className="card-block p-4">
                  <h1>Change Password</h1>
                  <p className="text-muted">Forgot your password?  Change it here.</p>
                  <div className="input-group mb-3">
                    <span className="input-group-addon"><i className="icon-lock"></i></span>
                    <input type="password" className="form-control" placeholder="Password" value = {this.state.password} onChange = {this.updatePasswordState}/>
                  </div>
                  <div className="input-group mb-4">
                    <span className="input-group-addon"><i className="icon-lock"></i></span>
                    <input type="password" className="form-control" placeholder="Repeat password"/>
                  </div>
                  <button type="button" className="btn btn-block btn-success" onClick = {this.registerUser}>Change Password</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
