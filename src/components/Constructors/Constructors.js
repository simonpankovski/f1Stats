import React, { Component } from "react";
import * as actionCreators from "../../actions";
import { connect } from "react-redux";
import store from "../../store"
import Constructor from './Constructor'
class Constructors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.props.getConstructors();
    this.unsubscribe = store.subscribe(() => {
      console.log(store.getState().constructor.constructors);
      this.setState({ filtered: store.getState().constructor.constructors });
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleSubmit(value){
    this.setState({filtered: this.props.constructor.constructors.filter(item=>item.name.toLowerCase().includes(value))})
  }
  handleChange(event) {
    console.log(event.target.value)
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
            {this.state.filtered.map(constructor => (
              <Constructor key={constructor.id} constructor={constructor} />
            ))}
          </div>
        </div>
      
    </div>
    );
  }
}
const mapStateToProps = state => ({
  constructor: state.constructor
});
export default connect(mapStateToProps, actionCreators)(Constructors);
