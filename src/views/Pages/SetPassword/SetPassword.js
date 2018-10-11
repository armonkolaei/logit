import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import urls from '../../../urls.json';
import queryString from 'query-string';
class SetPassword extends Component {
    constructor(props) {
        super(props);
        let token_avaailable = false;
        let user_id_available = false;
        let token = '';
        let user_id = '';
        if(this.props.location.search && queryString.parse(this.props.location.search).token)
        {
            token = queryString.parse(this.props.location.search).token;
             token_avaailable = true;
        }
        else
        {
             token_avaailable = false;
            toast.error("Token is empty or missing !!", {
                position: toast.POSITION.TOP_CENTER
              });
        }
        if(this.props.location.search && queryString.parse(this.props.location.search).user_id)
        {
            user_id = queryString.parse(this.props.location.search).user_id;
            user_id_available = true;
        }
        else
        {
            user_id_available = false;
            toast.error("User Id is empty or missing !!", {
                position: toast.POSITION.TOP_CENTER
              });
        }
        
		this.state = {
			new_password: '',
      confirm_password:'',
      loading:false,
      password_valid:false,
      fields: {},
      errors: {},
      user_id:user_id,
      user_loggedin :false,
      token_available:token_avaailable,
      user_id_available:user_id_available,
      token : token 
		}

        this.setuserPassword = this.setuserPassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //this.getProfile = this.getProfile.bind(this);
	}
	componentDidMount() {
        //this.getProfile();
      }
	  
	setuserPassword(e) {
        e.preventDefault();
        if(this.handleValidation()){
            this.setState({loading:true});
            let { history } = this.props;
            // console.log("DATA",JSON.stringify({
            //     user_id : this.state.user_id,
            //     token : this.state.token,
            //     password : this.state.new_password
            //     }));
            //     return false;
            $.ajax({
                url: `${urls.server}/users/setpassword`,
                type: 'post',
                data: JSON.stringify({
                user_id : this.state.user_id,
                token : this.state.token,
                password : this.state.new_password
                }),
                headers: {
                  "Content-type": "application/json",
                //   "X-Authorization": this.state.auth_token,
                //   "X-Profile": this.state.x_profile
                }
              }).then((json) => {
                
                this.setState({loading:false}, function () {
                 // alert("Company created successfully !");
                  toast.success("success", {
                    position: toast.POSITION.TOP_CENTER
                  });
                  if(this.state.user_loggedin)
                  {
                    setTimeout(function() { history.push(`/dashboard`); }.bind(this), 2000);
                  }
                  else
                  {
                    setTimeout(function() { history.push(`/login`); }.bind(this), 2000);
                  }
                  
                 });
                
              }).catch((error) => {
                try {
                  let err = error.responseJSON;
                  
                  if(`${urls.development_mode}` == "Debug")
                  {
                    this.setState({loading:false});
                    toast.error(err.message, {
                        position: toast.POSITION.TOP_CENTER
                      });
                      if(this.state.user_loggedin)
                      {
                        setTimeout(function() { history.push(`/dashboard`); }.bind(this), 2000);
                      }
                      else
                      {
                        setTimeout(function() { history.push(`/login`); }.bind(this), 2000);
                      }  
                    //alert(err.message);
                  }
                  
                } catch (e) {
                  
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
    // getProfile() {
    //     this.setState({loading:true});
    //     let { history } = this.props;
    //     $.ajax({
    //       url: `${urls.server}/users/profile/0`,
    //       headers: {
    //         "Content-type": "application/json",
    //         "X-Authorization": this.state.auth_token,
    //         "X-Profile": this.state.x_profile
    //       }
    //     }).then((json) => {
    
    //       let data = json.data;
         
    //       this.setState({
    //         user_id:data["id"],
    //         loading:false,
    //         user_loggedin:true
    //       });
    
    //     }).catch((error) => {
    //      console.log("NOT LOGGED IN");
    //      this.setState({
    //         loading:false,
    //       });
    //     });
    // }

	
    handleValidation(){
    
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
    
        //New Password
        if(!fields["new_password"]){
           formIsValid = false;
           errors["new_password"] = "Password is required";
        }
        //Confirm password
        if(!fields["confirm_password"]){
          formIsValid = false;
          errors["confirm_password"] = "Confirm password is required";
       }
       // Match passwords
       if(typeof fields["new_password"] !== "undefined" && typeof fields["confirm_password"] !== "undefined"){
            if(fields["new_password"] === fields["confirm_password"])
            {
                formIsValid = true;
                errors["confirm_password"] = "";
            }
            else
            {
                formIsValid = false;
                errors["confirm_password"] = "New password and Confirm password does not match";
            }
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
                <form onSubmit={this.setuserPassword}>
						<div className="col-md-6 set-password-form">
							<div className="card mx-4">
								<div className="card-block p-4">
									<h1>Set Your Password</h1>
									
									<div className="form-group">
										<input type="password" className="form-control" placeholder="New Password" id="new_password" onChange={this.handleChange.bind(this, "new_password")} value={this.state.fields["new_password"]}   />
                                        <span style={{color: "red"}}>{this.state.errors["new_password"]}</span>
									</div>
                                    <div className="form-group">
										<input type="password" className="form-control" placeholder="Confirm Password" id="confirm_password" onChange={this.handleChange.bind(this, "confirm_password")} value={this.state.fields["confirm_password"]} />
                                        <span style={{color: "red"}}>{this.state.errors["confirm_password"]}</span>
									</div>
									
									
                                    {this.state.token_available && this.state.user_id_available? (<button type="submit" className="btn btn-block btn-success">Submit</button>):(<button type="submit" className="btn btn-block btn-success" disabled="disabled">Submit</button>) } 
									
                                    { this.state.user_loggedin ? (
									<Link to={`/dashboard`} className="btn btn-block btn-danger btn-sm">
                                        <i className="fa fa-ban" /> Cancel
                                    </Link>
                                    ) :(<Link to={`/login`} className="btn btn-block btn-danger btn-sm">
                                    <i className="fa fa-ban" /> Cancel
                                </Link>)}
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

export default SetPassword;
