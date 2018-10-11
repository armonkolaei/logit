import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import urls from '../../../urls.json';
import Modal from 'react-responsive-modal';
const customStyles = {
	content : {
	  width:'auto',
	  top                   : '50%',
	  left                  : '50%',
	  right                 : 'auto',
	  bottom                : 'auto',
	  marginRight           : '-50%',
	  transform             : 'translate(-50%, -50%)'
	}
  };
class RecoverPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
            auth_token: '',
            fields:{},
            errors:{}            
		}

		this.recoverPassword = this.recoverPassword.bind(this);
		this.updateEmailState = this.updateEmailState.bind(this);
		
    }
    handleValidation(){
    
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
    
        //Email
        if(!fields["email"])
        {
          formIsValid =false;
          errors["email"] = "Email is required";
        }
        else
        {
          const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
          if (!re.test(fields["email"])) {
            formIsValid =false;
            errors["email"] = "Please enter valid email address";
          }
        }
        
       this.setState({errors: errors});
       return formIsValid;
    } 
	handleClick(){
		this.setState({modalIsOpen: true});		
	  }
	handleClickPrivacy(){
		this.setState({modalPrivacyIsOpen: true});		
	}  
	 
	
	  
	recoverPassword() {

		let { history } = this.props;
		if(this.handleValidation()){
		          
			this.setState({loading:true});
			$.ajax({
				url: `${urls.server}/users/recoverPassword`,
				type: 'POST',
				headers: {
					"Content-type": "application/json"
				},
				data: JSON.stringify({
					"email": this.state.email
				})
			}).then((json) => {
				this.setState({loading:false}, function () {
					toast.success(json.message, {
						position: toast.POSITION.TOP_CENTER
					});
				});
				setTimeout(function() { history.push("/login"); }.bind(this), 3000);
                
	
			}).catch((error) => {
				var err = error.responseJSON;
				this.setState({loading:false});
				if (typeof err.message !== 'undefined') {
					//alert(err.message);
					toast.error(err.message, {
						position: toast.POSITION.TOP_CENTER
                        });
                    
				}
            });
        }
        else
        {
            toast.error("Form has errors !", {
                position: toast.POSITION.TOP_CENTER
              });
        }
		
		
	}

	updateEmailState(e) {
        let fields = this.state.fields;
        fields["email"] = e.target.value;        
        this.setState({fields});
		this.setState({ email: e.target.value });
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
						<div className="col-md-6">
							<div className="card mx-4">
								<div className="card-block p-4">
                                    <div className="form-group img-and-text">
                                    <img src={'img/icon_pwd_header.png'} className="" width="70px" height="70px" style={{align:"center"}}/>
                                
									<h1>Recover Password</h1>
									</div>
									<div className="form-group">
										<input type="text" className="form-control" placeholder="Email" id="email" value={this.state.email} onChange={this.updateEmailState} />
                                        <span style={{color: "red"}}>{this.state.errors["email"]}</span>
									</div>
									
									
                 
									<button type="button" className="btn btn-block btn-success" onClick={this.recoverPassword}>Submit</button>

									<div className="form-group">
												<Link to="/login" className="btn btn-link px-0">Login</Link>
									</div>
								</div>
								
							</div>
						</div>
					</div>
				</div>
				}
			</div>
		);
	}
}

export default RecoverPassword;
