import React, { Component } from "react";

export class Information extends Component {
    
    render() {
        return (
            <React.Fragment key="info">
                <h3 className='title text-left'>{this.props.title}</h3>
                <hr className="mt-1"></hr>     
                <div className="pb-3">
                    <p className="text-left">{this.props.description}</p>
                </div>
            </React.Fragment>
        );
    }
}

export default Information;
