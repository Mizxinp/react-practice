import React, { Component } from 'react'
import { RouterContext } from './RouterContext'

export default class Router extends Component {
    static computeRootMatch(pathname) {
        return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
    }
    constructor(props) {
        super(props)
        this.state = {
            location: props.history.location
        }
    }
    componentDidMount() {
        this.unlisten = this.props.history.listen(location => {
            console.log('变化了')
            this.setState({ location })
        })
    }
    componentWillUnmount() {
        if (this.unlisten) {
            this.unlisten()
        }
    }
    render() {
        return (
            <RouterContext.Provider
                value={{
                    history: this.props.history,
                    location: this.state.location,
                    match: Router.computeRootMatch(this.state.location.pathname)
                }}
            >
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}
