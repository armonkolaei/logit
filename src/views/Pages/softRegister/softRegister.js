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
class softRegister extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
            auth_token: '',
            register_success:false,
            after_register_message:'',
			loading:false,
			terms :false,
			modalIsOpen: false,
			modalPrivacyIsOpen :false,
		}

		this.registerUser = this.registerUser.bind(this);
		this.updateEmailState = this.updateEmailState.bind(this);
		this.updateTermsState = this.updateTermsState.bind(this);
	}
	handleClick(){
		this.setState({modalIsOpen: true});		
	  }
	handleClickPrivacy(){
		this.setState({modalPrivacyIsOpen: true});		
	}  
	  closeModal() {
		this.setState({modalIsOpen: false});		
	  }
	  PrivacycloseModal() {
		this.setState({modalPrivacyIsOpen: false});		
	  }
	setCheckboxStates(attr){
		if($("#"+attr).prop("checked") === true)
		{
		 $("#"+attr).val(1);
		}
		else
		{
		 $("#"+attr).val(0);
		}
	   }
	   updateTermsState(e) {
		this.setState({ terms: e.target.value });
	}
	  
	registerUser() {

		let { history } = this.props;
		
		if(this.state.terms && $("#terms").prop("checked"))
		{           
			this.setState({loading:true});
			$.ajax({
				url: `${urls.server}/users/soft_register`,
				type: 'POST',
				headers: {
					"Content-type": "application/json"
				},
				data: JSON.stringify({
					"email": this.state.email
				})
			}).then((json) => {
                console.log("main response",json);
                if(json.status === 200)
                {
                    console.log("here");
                    this.setState({loading:false,register_success:true,after_register_message:json.message},function(){
                        setTimeout(function() { this.setState({register_success:false,email:""});  }.bind(this), 3000);
                    });
                }
                else if(json.success)
                {
                    this.setState({loading:false,register_success:true,after_register_message:json.message},function(){
                        setTimeout(function() { this.setState({register_success:false,email:""});  }.bind(this), 3000);
                    });
                }
	
			}).catch((error) => {
				var err = error.responseJSON;
				this.setState({loading:false});
				if (typeof err.message !== 'undefined') {
					//alert(err.message);
					toast.error(err.message, {
						position: toast.POSITION.TOP_CENTER
                        });
                    setTimeout(function() { this.setState({email:""});  }.bind(this), 3000);
				}
			});
		}
		else
		{
			toast.error("Please accepts our terms", {
				position: toast.POSITION.TOP_CENTER
				});
			//alert("Please accepts our terms");
			return false;
		}
		
	}

	updateEmailState(e) {
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
                { !this.state.register_success ? (<div className="row justify-content-center">
						<div className="col-md-6">
							<div className="card mx-4">
								<div className="card-block p-4">
									<h1>Register</h1>
									<p className="text-muted">Create your account</p>
									<div className="input-group mb-3">
										<span className="input-group-addon">@</span>
										<input type="text" className="form-control" placeholder="Email" id="email" value={this.state.email} onChange={this.updateEmailState} />
									</div>
									
									<div className="input-group mb-4 tearms-service-register">										
									<input type="checkbox" id="terms" onClick={this.setCheckboxStates.bind(this,"terms")}  value={this.state.terms} onChange={this.updateTermsState} /> I agree to the  <a href="#"	onClick={this.handleClick.bind(this)}>terms of service</a>
									</div>
                 
									<button type="button" className="btn btn-block btn-success" onClick={this.registerUser}>Create Account</button>

									<div className="input-group mb-4 policy-privacy-register">
									<a href="#"	onClick={this.handleClickPrivacy.bind(this)}>Privacy Policy</a>								
										{/* <Link className="" to="" onClick={this.handleClick.bind(this)}>Privacy Policy</Link> */}
									</div>
								</div>
								
							</div>
						</div>
					</div>):(<div className="row justify-content-center">
						<div className="col-md-6">
							<div className="card mx-4">
								<div className="card-block p-4">
									<h1>{this.state.after_register_message}</h1>
                                </div>
                            </div>
                        </div>
                        </div>)}
					
				</div>
				}
				
				<Modal open={this.state.modalPrivacyIsOpen} onClose={this.PrivacycloseModal.bind(this)} modalStyle={customStyles}>
				<div className="app flex-row align-items-center">
            <div className="container">
              <div className="row justify-content-center">
                <div className="tos-box-detail">
                <p className="title">MOTHERCLOCK’S</p>
    <h1 className="sub-title">Privacy Policy</h1>
    <p>MotherClock Inc. handles confidential financial information from its customers, Canadian corporations,
    companies or persons in the process of providing services. When you use these services you trust us
    with your information. This Privacy Policy is meant to help you understand what data we collect, why we
    collect it, and what we do with it. </p>
    <p>We collect information primarily to provide services to our users. We also use this information internally
    to learn how to provide, maintain and improve our services to our users, and to protect MotherClock
    and our users. We will never use your information for any other purpose without your express written
    consent. </p>
    <p>We collect information that you give to us and based on your use of our services including: </p>
    <p>• device-specific information</p>
    <p>• location information</p>
    <p>• details of how you used our service</p>
    <p>• Internet protocol address</p>
    <p>• cookies that may uniquely identify your browser or your MotherClock Account </p>
    
    <p>Data security is our highest priority. We maintain a very high level of protection against unauthorized
    intrusion. Every member of our team pledges their commitment to keep your data private and safe. </p>
    <p>Our Privacy Policy applies to all of the services offered by MotherClock Inc. The policy may change from
    time to time. We will post any privacy policy changes on this page and, if the changes are significant, we
    will provide a more prominent notice (including, for certain services, email notification of privacy policy
    changes). </p>
                </div>
              </div>
            </div>
          </div>
        		</Modal>
				<Modal open={this.state.modalIsOpen} onClose={this.closeModal.bind(this)} modalStyle={customStyles}>
					<div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="tos-box-detail">
            <p className="title">MOTHERCLOCK’S</p>
<h1 className="sub-title">TERMS OF SERVICE</h1>
<p>Your use of MotherClock’s products, software, services and web sites (referred to collectively as the
“Services” in this document and excluding any services provided to you by MotherClock under a
separate written agreement) is subject to the terms of a legal agreement between you and
MotherClock. “MotherClock” means MotherClock Inc., whose principal place of business is at 149
Burleigh Street, Apsley, ON K0L 1A0, Canada.</p>
<p>In order to use the Services, you must first agree to the Terms. You may not use the Services if you do
not accept the Terms.</p>
<p>You can accept the Terms by:</p>
<p>(A) clicking to accept or agree to the Terms, where this option is made available to you by MotherClock
in the user interface for any Service; or</p>
<p>(B) using the Services. In this case, you understand and agree that MotherClock will treat your use of the
Services as acceptance of the Terms from that point onwards.</p>
<p>You may not use the Services and may not accept the Terms if (a) you are not of legal age to form a
binding contract with MotherClock, or (b) you are a person barred from receiving the Services under the
laws of Canada or other countries including the country in which you are resident or from which you use
the Services.</p>
<p>In order to access certain Services, you may be required to provide information about yourself or your
employees (such as identification or contact details) as part of the registration process for the Service, or
as part of your continued use of the Services. You agree that any registration information you give to
MotherClock will always be accurate, correct and up to date.</p>
<p>While we will do everything possible to ensure that the Services meets and exceeds your expectations,
you expressly understand and agree that:</p>
<p>(A) your use of the Services is at your sole risk and that the Services are provided “as is” and “as
available”; and</p>
<p>(B) MotherClock, its subsidiaries and affiliates, and its licensors shall not be liable to you for any reason.</p>
<p>MotherClock may make changes to the Terms and Conditions or Additional Terms from time to time.
When these changes are made, MotherClock will make a new copy of the Terms and Conditions
available at <a href="#">http://www.motherclock.com/termsofservice.html</a> and any new Additional Terms will be
made available to you from within, or through, the affected Services.</p>
<p>You understand and agree that if you use the Services after the date on which the Terms and Conditions
or Additional Terms have changed, MotherClock will treat your use as acceptance of the updated Terms
and Conditions or Additional Terms.</p>
            </div>
          </div>
        </div>
      </div>
        		</Modal>
			</div>
		);
	}
}

export default softRegister;
