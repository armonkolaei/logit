import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import $ from "jquery";
 import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';

import urls from '../../../urls.json';

class Portal extends Component {

	constructor(props) {
		super(props);

		
	}
	selectPortal(type){
		let { history } = this.props;
		if(type === "employee")
		{
			localStorage.setItem("x-profile", 1);
		}
		else
		{
			localStorage.setItem("x-profile", 0);
		}
		history.push('/dashboard');
	}
	
	componentDidMount() {
	
	}		

	render() {

		return (
			<div className="app flex-row align-items-center version-main">
				
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-md-8">
							<div className="card-group mb-0">
								<div className="card p-4 login-card">
									<div className="card-block select-portal">
										<div onClick={this.selectPortal.bind(this,'employee')}>
										<img src="/img/portal-select.png" className="logo-img" />
										<span>Employee Portal</span>
										</div>
									</div>
								</div>
								<div className="card p-4">
									<div className="card-block select-portal">
										<div onClick={this.selectPortal.bind(this,'company')}>
										<img src="/img/portal-select.png" className="logo-img" />
										<span>Company Management Portal</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>				
				</div>
				
			</div>
		);
	}
}

export default Portal;
