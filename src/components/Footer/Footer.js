import React, { Component } from 'react';
import urls from '../../urls.json';
class Footer extends Component {
  constructor() {
    super();

    var today = new Date(),
        year = today.getFullYear();

    this.state = {
      year: year
    };
  }
  render() {
    return (
      <footer className="app-footer">
        {/* <div className="version-display">
        
        </div> */}
       Logitini {urls.version}  &copy; {this.state.year}        
      </footer>
    )
  }
}

export default Footer;
