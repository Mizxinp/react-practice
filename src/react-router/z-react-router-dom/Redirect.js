import React, { Component } from 'react'
import {RouterContext} from './RouterContext'

const Redirect = ({  to, push = false }) => {
    return(
        <RouterContext.Consumer>
            {context => {
                const { history } = context
                const method = push ? history.push : history.replace;
                return (
                    <LifeCycle
                        onMount={() => {
                            method(to)
                        }}
                    />
                )
            }}
        </RouterContext.Consumer>
    )
}

export default Redirect

class LifeCycle extends Component {
    componentDidMount() {
        if (this.props.onMount) {
            this.props.onMount.call(this, this);
        }
    }
    render() {
        return null;
    }
}
