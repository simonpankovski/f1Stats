import React, { Component } from 'react'
import { connect } from "react-redux";
import { getDrivers } from "../../actions";
import store from "../../store"
import Driver from './Driver'
import '../../content_style.css'
class Drivers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered: [],
            value:""
        }
        
        this.handleChange = this.handleChange.bind(this);
    }
      componentDidMount() {
        this.props.getDrivers();
        this.unsubscribe=store.subscribe(()=>{
            console.log(store.getState().driver.drivers)
          this.setState({filtered:store.getState().driver.drivers})
         })
      }
      componentWillUnmount(){
        this.unsubscribe();
      }
      handleSubmit(value){
        this.setState({filtered: this.props.driver.drivers.filter(item=>item.forename.toLowerCase().includes(value) || item.surname.toLowerCase().includes(value))})
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
                  {this.state.filtered.map(driver => (
                    <Driver key={driver.id} driver={driver} />
                  ))}
                </div>
              </div>
            
          </div>
        );
      }
}
const mapStateToProps = state => ({
    driver: state.driver
  });
  
  export default connect(mapStateToProps, { getDrivers })(Drivers);
  