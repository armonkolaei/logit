import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import Widget04 from '../../Widgets/Widget04';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { Card, CardColumns, CardHeader,CardGroup, Col, Row } from 'reactstrap';
import moment from 'moment';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import urls from '../../../urls.json';
const line = {
  labels: ['1', '2', '3'],
  datasets: [
    {
      label: 'Stats 1',
      fill: false,
      backgroundColor: "red",
			borderColor: "red",
      data: [0,0,0],
    },
    {
      label: 'Stats 2',
      fill: false,
      backgroundColor: "blue",
			borderColor: "blue",
      data: [0,0,0],
    },
    {
      label: 'Stats 3',
      fill: false,
      backgroundColor: "yellow",
			borderColor: "yellow",
      data: [0,0,0],
    },
  ],
};
const Lineoptions = {
  responsive: true,
  title: {
    display: false,
    text: 'Payrol stats'
  },
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'nearest',
    intersect: true,
    axis:"x",
  },
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Pay Period'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Net Payroll Expense ($)'
      }
    }]
  }
}

const options = {
  tooltips: {
    enabled: false,
    custom: false,
  },
  maintainAspectRatio: false
}

const stackedoptions = {
  scales: {
       xAxes: [{
           stacked: true,
           scaleLabel: {
            display: true,
            labelString: 'Pay Period'
          }
       }],
       yAxes: [{
           stacked: true,
           scaleLabel: {
            display: true,
            labelString: 'Total Hours Worked'
          }
           
       }]
   }
}

const barChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'Dataset 1',
    backgroundColor: 'red',
    data: [65, 59, 80, 81, 56, 55, 40]
  }, {
    label: 'Dataset 2',
    backgroundColor: 'blue',
    data: [61, 55, 75, 73, 50, 48, 32]
  }, {
    label: 'Dataset 3',
    backgroundColor: 'green',
    data:[53, 51, 71, 78, 58, 40, 28]
  }]
};
function ObjectLength( object ) {
  var length = 0;
  for( var key in object ) {
      if( object.hasOwnProperty(key) ) {
          ++length;
      }
  }
  return length;
};
class CompanyDashboard extends Component {

  constructor(props) {
    super(props);

    let { companyId } = this.props.match.params;    
    let { companies } = this.props;
    this.toggle = this.toggle.bind(this);
   
    this.state = {
      auth_token: localStorage.getItem('jwt'),
      x_profile: localStorage.getItem('x-profile'),
      company_id: companyId,
      companies: companies || [],
      email_verified:false,
      loading:false,
      dropdownOpen: false,
      LineDataset:{
        labels: ['1', '2', '3'],
        datasets: [
          {
            label: 'Net Payroll Expense',
            fill: false,
            backgroundColor: "red",
            borderColor: "red",
            data: [0,0,0],
          }
        ],
      },
      chartDataset:{
        labels: ['0', '1', '2'],
        datasets: [{
          label: 'Regular Hours',
          backgroundColor:"#4dbd74",
          data: [0,0,0]
        }, {
          label: 'Overtime Hours',
          backgroundColor:"#f86c6b",
          data: [0,0,0]
        }, {
          label: 'Holiday Hours',
          backgroundColor:"#f8cb00",
          data: [0,0,0]
        }]
      },
      active_employees:0,
      active_employees_value:0,
      next_payrol_count_down: "0 hours",
      next_payroll_value : 0,
      pending_acrrual_request:0,
      pending_accrual_request_value:0
    };
    this.getDashboardDetails = this.getDashboardDetails.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.handleVisitorsClick = this.handleVisitorsClick.bind(this);
    this.handlePayrollClick =this.handlePayrollClick.bind(this);
    this.getHoursworkedDetails = this.getHoursworkedDetails.bind(this);
    this.getPayrollStats = this.getPayrollStats.bind(this);
    this.getActiveEmployeeStats = this.getActiveEmployeeStats.bind(this);
    this.getNextPayrollTimeUntil = this.getNextPayrollTimeUntil.bind(this);
    this.getPendingAccrualRequest = this.getPendingAccrualRequest.bind(this);
    this.handleAccrualRequestsClick =this.handleAccrualRequestsClick.bind(this);
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  componentWillReceiveProps(nextProps) {
   
    let { companyId } = nextProps.match.params;
    let { companies } = nextProps;
    this.setState({
      company_id: companyId,
      companies
    },function(){
      this.getDashboardDetails();
      this.getHoursworkedDetails();
      this.getPayrollStats();
      this.getActiveEmployeeStats();
      this.getNextPayrollTimeUntil();
      this.getPendingAccrualRequest();
    });
    
  }

  componentDidMount() { 
    this.getHoursworkedDetails();
    this.getPayrollStats();
    this.getActiveEmployeeStats();
    this.getNextPayrollTimeUntil();
    this.getPendingAccrualRequest();
   }
   handleAccrualRequestsClick()
   {
    let { history } = this.props;
    if(this.state.company_id == 'undefined')
    {
      history.push(`/company/${this.state.company_id}/accrualrequests`);
    }
   }
   handleVisitorsClick()
   {
    let { history } = this.props;
    if(this.state.company_id == 'undefined')
    {
      history.push(`/company/${this.state.company_id}/employee`);
    }
    
   }
   handlePayrollClick(){
    let { history } = this.props;
    if(this.state.company_id == 'undefined')
    {
      history.push(`/company/${this.state.company_id}/payroll`);
    }
    
   }
  getPendingAccrualRequest()
  {
    let { history } = this.props;
    this.setState({loading:true});
    if(this.state.company_id == 'undefined')
    {
      this.setState({loading:false});
    }
    else
    {
      //console.log("API CALL",this.state.company_id);
      $.ajax({
        url: `${urls.server}/dashboard/widget/pending_accruals/${this.state.company_id}`,
        headers: {
          "Content-type": "application/json",
          "X-Authorization": this.state.auth_token,
        }
      }).then((json) => {
        let { data } = json; 
        

        this.setState({loading:false,pending_acrrual_request:data.num_requests,pending_accrual_request_value:(data.num_requests*10)}); 
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
              //alert(err.message);
            }
           
          }
        } catch (e) {
          if(`${urls.development_mode}` == "Debug")
          {
            //alert("error: ", error.responseText);
          }
         
        }
      }); 
    }
  }
  getNextPayrollTimeUntil()
  {
    let { history } = this.props;
    this.setState({loading:true});
    if(this.state.company_id == 'undefined')
    {
      this.setState({loading:false});
    }
    else
    {
      //console.log("API CALL",this.state.company_id);
      $.ajax({
        url: `${urls.server}/dashboard/widget/time_until_next_payroll/${this.state.company_id}`,
        headers: {
          "Content-type": "application/json",
          "X-Authorization": this.state.auth_token,
        }
      }).then((json) => {
        let { data } = json; 
        
        var new_count_down = data.days +" days "+data.hours+" hours";
        var new_next_payroll_value = ((14-data.days)/14)*100;
        console.log("next_payroll_value",new_next_payroll_value);
        //this.setState({loading:false,next_payrol_count_down:new_count_down});
        if(data.days >= 1)
        {
          this.setState({loading:false,next_payrol_count_down:data.days+" days",next_payroll_value:new_next_payroll_value}); 
        }
        else
        {
          this.setState({loading:false,next_payrol_count_down:data.hours+" hours",next_payroll_value:new_next_payroll_value}); 
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
              //alert(err.message);
            }
           
          }
        } catch (e) {
          if(`${urls.development_mode}` == "Debug")
          {
            //alert("error: ", error.responseText);
          }
         
        }
      }); 
    }
  }
  getActiveEmployeeStats()
  {
    let { history } = this.props;
    this.setState({loading:true});
    if(this.state.company_id == 'undefined')
    {
      this.setState({loading:false});
    }
    else
    {
      console.log("API CALL",this.state.company_id);
      $.ajax({
        url: `${urls.server}/dashboard/widget/active_employees/${this.state.company_id}`,
        headers: {
          "Content-type": "application/json",
          "X-Authorization": this.state.auth_token,
        }
      }).then((json) => {
        let { data } = json; 
        this.setState({loading:false,active_employees:data.num_employees,active_employees_value:(data.num_employees*1.75)}); 
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
              //alert(err.message);
            }
           
          }
        } catch (e) {
          if(`${urls.development_mode}` == "Debug")
          {
            //alert("error: ", error.responseText);
          }
         
        }
      }); 
    }
  }
  getPayrollStats()
  {
    let { history } = this.props;
    this.setState({loading:true});
    if(this.state.company_id == 'undefined')
    {
      console.log("ID UNDEFINED");
      this.setState({loading:false});
    }
    else
    {
      console.log("API CALL",this.state.company_id);
      $.ajax({
        url: `${urls.server}/dashboard/widget/payroll_net/${this.state.company_id}`,
        headers: {
          "Content-type": "application/json",
          "X-Authorization": this.state.auth_token,
          //"X-Profile": this.state.x_profile
        }
      }).then((json) => {
        let { data } = json;  
       console.log("PAYROLL STATS",data);
       if(ObjectLength(data) === 6)
        {
          let DataSet=[];
          for (let key in data) {
            
            let finalObj={
              labels: [data[5].period,data[4].period,data[3].period,data[2].period,data[1].period,data[0].period],
              datasets: [{
                label:`Net Payroll Expense`,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [data[5].stats.total_withdrawal,data[4].stats.total_withdrawal,data[3].stats.total_withdrawal,data[2].stats.total_withdrawal,data[1].stats.total_withdrawal,data[0].stats.total_withdrawal]
              }]
            }
            this.setState({LineDataset :finalObj ,loading:false});
          }
        }
        else if(ObjectLength(data) === 5)
        {
          let DataSet=[];
          for (let key in data) {
            
            let finalObj={
              labels: [data[4].period,data[3].period,data[2].period,data[1].period,data[0].period],
              datasets: [{
                label:`Net Payroll Expense`,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [data[4].stats.total_withdrawal,data[3].stats.total_withdrawal,data[2].stats.total_withdrawal,data[1].stats.total_withdrawal,data[0].stats.total_withdrawal]
              }]
            }
            this.setState({LineDataset :finalObj ,loading:false});
          }
        }
        else if(ObjectLength(data) === 4)
        {
          let DataSet=[];
          for (let key in data) {
            
            let finalObj={
              labels: [data[3].period,data[2].period,data[1].period,data[0].period],
              datasets: [{
                label:`Net Payroll Expense`,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [data[3].stats.total_withdrawal,data[2].stats.total_withdrawal,data[1].stats.total_withdrawal,data[0].stats.total_withdrawal]
              }]
            }
            this.setState({LineDataset :finalObj ,loading:false});
          }
        }
        else if(ObjectLength(data) === 3)
        {
          let DataSet=[];
          for (let key in data) {
            
            let finalObj={
              labels: [data[2].period,data[1].period,data[0].period],
              datasets: [{
                label:`Net Payroll Expense`,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [data[2].stats.total_withdrawal,data[1].stats.total_withdrawal,data[0].stats.total_withdrawal]
              }]
            }
            this.setState({LineDataset :finalObj ,loading:false});
          }
        }
        else if(ObjectLength(data) === 2)
        {
          let DataSet=[];
          for (let key in data) {
            
            let finalObj={
              labels: [data[1].period,data[0].period],
              datasets: [{
                label:`Net Payroll Expense`,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [data[1].stats.total_withdrawal,data[0].stats.total_withdrawal]
              }]
            }
            this.setState({LineDataset :finalObj ,loading:false});
          }
        }
        else if(ObjectLength(data) === 1)
        {
          let DataSet=[];
          for (let key in data) {
            
            let finalObj={
              labels: [data[0].period],
              datasets: [{
                label:`Net Payroll Expense`,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [data[0].stats.total_withdrawal]
              }]
            }
            this.setState({LineDataset :finalObj ,loading:false});
          }
        }
        else
        {
          this.setState({LineDataset:{
            labels: ['1', '2', '3'],
            datasets: [
              {
                label: 'Net Payroll Expense',
                fill: false,
                backgroundColor: "red",
                borderColor: "red",
                data: [0,0,0],
              }
            ],
          },loading:false});
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
              //alert(err.message);
            }
           
          }
        } catch (e) {
          if(`${urls.development_mode}` == "Debug")
          {
            //alert("error: ", error.responseText);
          }
         
        }
      }); 
    }
  }
  getHoursworkedDetails()
  {
    let { history } = this.props;
    this.setState({loading:true});
    if(this.state.company_id == 'undefined')
    {
      console.log("ID UNDEFINED");
      this.setState({loading:false});
    }
    else
    {
      console.log("API CALL",this.state.company_id);
      $.ajax({
        url: `${urls.server}/dashboard/widget/emp_hours/${this.state.company_id}`,
        headers: {
          "Content-type": "application/json",
          "X-Authorization": this.state.auth_token,
          //"X-Profile": this.state.x_profile
        }
      }).then((json) => {
        let { data } = json;
        console.log("HOURS WORKED",data);     
        if(ObjectLength(data) === 3)
        {
          let DataSet=[];
            for (let key in data) {
              //console.log("Key >>>> " + key + "   data >>>>> " + data[key]);
              // let tempcolor="red";
              // if(key==1){
              //   tempcolor="blue";
              // }else if(key==2){
              //   tempcolor="green";
              // }
              // let tempObj={
              //   label:`Dataset ${key}`,
              //   backgroundColor:tempcolor,
              //   data: [data[key].reg_work_time,Math.floor(Math.random() * 100),Math.floor(Math.random() * 100)]
              // };
              // DataSet.push(tempObj);

              let finalObj={
                labels: [data[2].period,data[1].period,data[0].period],
                datasets: [{
                  label:`Regular Hours`,
                  backgroundColor:"#4dbd74",
                  data: [data[2].reg_work_time,data[1].reg_work_time,data[0].reg_work_time]
                },
                {
                  label:`Overtime Hours`,
                  backgroundColor:"#f86c6b",
                  data: [data[2].ot_work_time,data[1].ot_work_time,data[0].ot_work_time]
                },
                {
                  label:`Holiday Hours`,
                  backgroundColor:"#f8cb00",
                  data: [data[2].hol_work_time,data[1].hol_work_time,data[0].hol_work_time]
                }]
              }
              this.setState({chartDataset :finalObj ,loading:false});
            }
        }
        else if(ObjectLength(data) === 2)
        {
          
            for (let key in data) {
             
              let finalObj={
                labels: [data[1].period,data[0].period],
                datasets: [{
                  label:`Regular Hours`,
                  backgroundColor:"#4dbd74",
                  data: [data[1].reg_work_time,data[0].reg_work_time]
                },
                {
                  label:`Overtime Hours`,
                  backgroundColor:"#f86c6b",
                  data: [data[1].ot_work_time,data[0].ot_work_time]
                },
                {
                  label:`Holiday Hours`,
                  backgroundColor:"#f8cb00",
                  data: [data[1].hol_work_time,data[0].hol_work_time]
                }]
              }
              this.setState({chartDataset :finalObj ,loading:false});
            }
        }
        else if(ObjectLength(data) === 1)
        {
          
            for (let key in data) {
             
              let finalObj={
                labels: [data[0].period],
                datasets: [{
                  label:`Regular Hours`,
                  backgroundColor:"#4dbd74",
                  data: [data[0].reg_work_time]
                },
                {
                  label:`Overtime Hours`,
                  backgroundColor:"#f86c6b",
                  data: [data[0].ot_work_time]
                },
                {
                  label:`Holiday Hours`,
                  backgroundColor:"#f8cb00",
                  data: [data[0].hol_work_time]
                }]
              }
              this.setState({chartDataset :finalObj ,loading:false});
            }
        }
        else
        {
          this.setState({chartDataset:{
            labels: ['0', '1', '2'],
            datasets: [{
              label: 'Regular Hours',
              backgroundColor:"#4dbd74",
              data: [0,0,0]
            }, {
              label: 'Overtime Hours',
              backgroundColor:"#f86c6b",
              data: [0,0,0]
            }, {
              label: 'Holiday Hours',
              backgroundColor:"#f8cb00",
              data: [0,0,0]
            }]
          },loading:false});
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
              //alert(err.message);
            }
           
          }
        } catch (e) {
          if(`${urls.development_mode}` == "Debug")
          {
            //alert("error: ", error.responseText);
          }
         
        }
      });   
    }
    
  }
  getDashboardDetails(){
    let { history } = this.props;
    if(this.state.company_id == 'undefined')
    {
      //Do nothing when company id is undefined.
    }
    else
    {
      $.ajax({
        url: `${urls.server}/dashboard/byCompany/${this.state.company_id}`,
        headers: {
          "Content-type": "application/json",
          "X-Authorization": this.state.auth_token,
          //"X-Profile": this.state.x_profile
        }
      }).then((json) => {
        let { data } = json;
        
        this.setState({email_verified : data.notifications.email_verified });
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
              //alert(err.message);
            }
           
          }
        } catch (e) {
          if(`${urls.development_mode}` == "Debug")
          {
            //alert("error: ", error.responseText);
          }
         
        }
      });   
    }
  }
  verifyEmail()
  {
    this.setState({loading:true});
    $.ajax({
      url: `${urls.server}/users/verifyemail`,
      headers: {
        "Content-type": "application/json",
        "X-Authorization": this.state.auth_token,
        //"X-Profile": this.state.x_profile
      }
    }).then((json) => {
      let { data } = json;
      this.setState({loading:false});
      
      toast.success(json.message, {
        position: toast.POSITION.TOP_CENTER
        });
      //alert(data);
      // console.log("COMPANY_DATA DASHBOARD",data);
      // this.setState({email_verified : data.notifications.email_verified });
    }).catch((error) => {
      //console.log("ERROR",error);
      this.setState({loading:false});
      //alert(error);
      
    });
  }
  
  render() {

    let { companies, company_id } = this.state;

    return (
     
      <div>
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
        <div>
        <div>
          <ToastContainer 
											position="top-left"
											type="default"
											autoClose={5000}
											hideProgressBar={true}
											newestOnTop={false}
											closeOnClick
											pauseOnHover
											/>  
        <div className="row">
          <div className="col-md-12">
            <h2>Dashboard</h2>
            <hr className="title-separator" />
          </div>
        </div>
        <p className="card-text">Payroll - The Easy Way.</p>
        <br/>
        {
          !company_id ? (
            (companies.length <= 0) ? (
              <div>
                <p className="card-text">Finish setting up your acount to start using MotherClock.</p>
                <br/>
                <div className="alert alert-danger fade show" role="alert">
                  No company associated with this user account.
                      <div className="pull-right">
                    <Link to={'/company/create'} className="btn btn-sm btn-secondary" style={{
                      marginTop: -4
                    }}>Add Your Company</Link>
                  </div>
                </div>
              </div>
            ) : ( (companies.length > 1) ? (<div className="alert alert-success fade show" role="alert"> Please select a company to get started. </div>):(null) 
                
              )
          ) : null
        }
        {
          (this.state.email_verified === "0") ? (
            <div className="alert alert-success alert-blue-text fade show" role="alert">
            Your Email is not verifed yet
              <div className="">
                <button type="submit" className="btn btn-sm btn-primary" onClick={this.verifyEmail}>
                    Verify Now
                </button>
              </div>
            </div>
          ): null
        }
      </div>
      {this.state.x_profile == 0 ? (
        <div className="animated fadeIn">
        <Row>
          <Col sm="6" md="2">
          <Link to={`/company/${this.state.company_id}/employee`}>
          <Widget04 icon="icon-people" color="info" header={this.state.active_employees} value={this.state.active_employees_value} invert={true} onClick={this.handleVisitorsClick}>Active Employees</Widget04>
          </Link>            
            
          </Col>          
          <Col sm="6" md="2">
          <Link to={`/company/${this.state.company_id}/payroll`}>
            <Widget04 icon="icon-speedometer" color="danger" header={this.state.next_payrol_count_down} value={this.state.next_payroll_value} invert={true} onClick={this.handlePayrollClick}>Next Payroll</Widget04>
            </Link>   
          </Col>
          <Col sm="6" md="2">
          <Link to={`/company/${this.state.company_id}/accrualrequests`}>
            <Widget04 icon="icon-layers" color="warning" header={this.state.pending_acrrual_request} value={this.state.pending_accrual_request_value} invert={true} onClick={this.handleAccrualRequestsClick}>Pending Requests</Widget04>
            </Link>   
          </Col>
        </Row>
        <CardColumns className="cols-2">
          <Card>
            <CardHeader>
            Payroll Statistics             
            </CardHeader>
            <div className="card-body">
              <div className="chart-wrapper">
                <Line data={this.state.LineDataset} options={Lineoptions} />
              </div>
            </div>
          </Card>
          
          <Card>
            <CardHeader>
            Time Card Statistics           
            </CardHeader>
            <div className="card-body">
              <div className="chart-wrapper">
              <Bar  data={this.state.chartDataset} options={stackedoptions} />
              </div>
              </div>
          </Card>          
        </CardColumns>
      </div>
      ):(null)}
      </div>
      }
      </div>
    )
  }
}
export default CompanyDashboard;