import React, { Component } from "react";
import { connect } from "react-redux";
import { getCircuits } from "../actions";
import Circuit from "./Circuit/Circuit";
import store from "../store"
import '../content_style.css'
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
        filtered: [],
        value:""
    }
    
    this.handleChange = this.handleChange.bind(this);
}
  componentDidMount() {
    this.props.getCircuits();
    this.unsubscribe=store.subscribe(()=>{
      this.setState({filtered:store.getState().circuit.circuits})
     })
  }
  componentWillUnmount(){
    this.unsubscribe();
  }
  handleSubmit(value){
    this.setState({filtered: this.props.circuit.circuits.filter(item=>item.name.toLowerCase().includes(value))})
  }
  handleChange(event) {
    this.setState({value: event.target.value},this.handleSubmit(event.target.value));
    
  }
  
  render() {
    
    return (  
      <div style={{height:"100vh",overflowX:"auto"}} id="style-1">
       
          <div className="row" >
            <div className="col-12 col-md-2 mb-2"style={{paddingRight:"0"}} >
              <input type="text" id="search" className="form-control mr-sm-2" placeholder="Search" value={this.state.value} onChange={this.handleChange}></input>
            </div>
            <div className="col-md-10" style={{paddingRight:"0"}}>
              {this.state.filtered.map(circuit => (
                <Circuit key={circuit.id} circuit={circuit} />
              ))}
            </div>
          </div>
        
      </div>
    );
  }
}

const mapStateToProps = state => ({
  circuit: state.circuit
});

export default connect(mapStateToProps, { getCircuits })(Content);
