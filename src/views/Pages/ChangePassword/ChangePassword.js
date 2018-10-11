import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import urls from '../../../urls.json';
class ChangePassword extends Component {
    constructor(props) {
        super(props);
        
        
		this.state = {
			old_password: '',
      auth_token: localStorage.getItem("jwt"),
      x_profile: localStorage.getItem('x-profile'),
      new_password:'',
      loading:false,
      fields: {},
      errors: {},
    }
    this.changeuserPassword = this.changeuserPassword.bind(this);
	}
	componentDidMount() {
       
      }
      handleValidation(){
    
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
    
        //New Password
        if(!fields["old_password"]){
           formIsValid = false;
           errors["old_password"] = "Old Password is required";
        }
        //Confirm password
        if(!fields["new_password"]){
          formIsValid = false;
          errors["new_password"] = "New Password is required";
       }
       this.setState({errors: errors});
       return formIsValid;
    }
    handleChange(field, e){   
      let attr = e.target.id;
      this.setState({
        [attr]: e.target.value
      });      
      let fields = this.state.fields;
      fields[field] = e.target.value;        
      this.setState({fields});
    }
    changeuserPassword(e)
    {
      e.preventDefault();
        if(this.handleValidation()){
            let { history } = this.props;
            this.setState({loading:true});
            $.ajax({
                url: `${urls.server}/users/changepassword`,
                type: 'post',
                data: JSON.stringify({
                old_password : this.state.old_password,
                new_password : this.state.new_password
                }),
                headers: {
                  "Content-type": "application/json",
                  "X-Authorization": this.state.auth_token,
                  "X-Profile": this.state.x_profile
                }
              }).then((json) => {
                
                this.setState({loading:false}, function () {
                 // alert("Password has been changes successfully !");
                  toast.success("Password has been changes successfully !", {
                    position: toast.POSITION.TOP_CENTER
                  });
                 
                 });
                 setTimeout(function() { history.push("/updateprofile"); }.bind(this), 3000);
                
              }).catch((error) => {
                try {
                  let err = error.responseJSON;
                  this.setState({loading:false});
                  if(`${urls.development_mode}` == "Debug")
                  {
                    toast.error(err.message, {
                        position: toast.POSITION.TOP_CENTER
                      });
                    //alert(err.message);
                  }
                  
                } catch (e) {
                  this.setState({loading:false});
                }
              });
        }
        else
        {
            if(`${urls.development_mode}` == "Debug")
            {
              toast.error("Form has errors!", {
                position: toast.POSITION.TOP_CENTER
              });
              
            }
        }
    }
	render() {

		return (
			<div className="app flex-row align-items-center">
				<ToastContainer 
    position="top-left"
    type="default"
    autoClose={5000}
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick
    pauseOnHover
  />
				{
							this.state.loading?
							<div className="sk-wave">
                <div className="sk-rect sk-rect1"></div>
                <div className="sk-rect sk-rect2"></div>
                <div className="sk-rect sk-rect3"></div>
                <div className="sk-rect sk-rect4"></div>
                <div className="sk-rect sk-rect5"></div>
              </div>
								:
				<div className="container">
                <div className="row justify-content-center">
                <form onSubmit={this.changeuserPassword}>
						<div className="col-md-6 set-password-form">
							<div className="card mx-4">
								<div className="card-block p-4">
									<h1>Change Password</h1>
									<p className="text-muted">You can change your password from here</p>
									<div className="form-group">
										<input type="password" className="form-control" placeholder="Old Password" id="old_password" onChange={this.handleChange.bind(this, "old_password")} value={this.state.fields["old_password"]}   />
                                        <span style={{color: "red"}}>{this.state.errors["old_password"]}</span>
									</div>
                                    <div className="form-group">
										<input type="password" className="form-control" placeholder="New Password" id="new_password" onChange={this.handleChange.bind(this, "new_password")} value={this.state.fields["new_password"]} />
                                        <span style={{color: "red"}}>{this.state.errors["new_password"]}</span>
									</div>
									
									
                  <button type="submit" className="btn btn-block btn-success">Submit</button>
									
                                  
									<Link to={`/updateprofile`} className="btn btn-block btn-danger btn-sm">
                                        <i className="fa fa-ban" /> Cancel
                                    </Link>
                                  
								</div>
								
							</div>
						</div>
                </form>
					</div>
				</div>
				}
			</div>
		);
	}
}

export default ChangePassword;
