import React, { Component } from "react";
import { Information } from "../components/index";

export class Home extends Component { 

  state = { 
    title: "Home",
    description: "pagina principal"
  };

  render() {
    return (
      <React.Fragment>
        <Information title={this.state.title} description={this.state.description}/>
     </React.Fragment>
    );
  }
}
    
export default Home;