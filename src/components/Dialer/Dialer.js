import React, { Component } from 'react';

class Dialer extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="container">

        <div className="row">
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(1) }}>1</button>
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(2) }} >2</button>
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(3) }} >3</button>
        </div>

        <div className="row">
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(4) }} >4</button>
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(5) }} >5</button>
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(6) }} >6</button>
        </div>

        <div className="row">
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(7) }} >7</button>
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(8) }} >8</button>
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(9) }} >9</button>
        </div>

        <div className="row">
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={this.props.onClear} >CLEAR</button>
          <button type="button" className="col-4 btn btn-lg btn-secondary" onClick={() => { this.props.onButtonClick(0) }} >0</button>
          <button type="button" className="col-4 btn btn-lg btn-success" onClick={this.props.onDone}>DONE</button>
        </div>

      </div>
    )

  }
}

export default Dialer;
