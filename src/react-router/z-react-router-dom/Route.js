import React, { Component } from 'react'
import { RouterContext } from './RouterContext'
import matchPath from './matchPath'
export default class Route extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const { location } = context
                    const { path, children, component, render, computedMatch } = this.props

                    const match = computedMatch ? computedMatch
                        : path ? matchPath(location.pathname, this.props)
                            : context.match

                    const props = {
                        ...context,
                        location,
                        match,
                    }

                    /**
                     * 优先级：children =》 component =》 render
                     * 先判断是否match，如果match，则判断是否有children，有则判断是否是函数，是就执行，不是就返回children
                        * 没有children则判断是否有component，有则使用React.createElement()
                        * 没有component，则判断是否有render，有则执行render函数，没有返回null
                     * 没有match时，判断children是否是函数，是就执行，不是就返回null
                     */

                    return (
                        // 使用最新的match等做为Provider
                        <RouterContext.Provider value={props}>
                            {match
                                ? children ? typeof children === 'function' ? children(props) : children
                                    : component ? React.createElement(component, props)
                                    : render ? render(props) : null

                                : typeof children === 'function' ? children(props) : null
                            }
                        </RouterContext.Provider>
                    )
                }}
            </RouterContext.Consumer>
        )
    }
}
