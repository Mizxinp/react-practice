import React, { Component } from 'react'
import {RouterContext} from "./RouterContext"
import matchPath from "./matchPath"

/**
 * 独占路由
 * 渲染与该地址匹配等第一个字组件 <Route> 或者 <Redirect>
 * 遍历所有子节点，找到匹配的就不往下找了
 */
export default class Switch extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const location = this.props.location || context.location
                    // 标记是否匹配
                    let match
                    // 记录匹配的元素
                    let element

                    React.Children.forEach(this.props.children, child => {
                        if (match == null && React.isValidElement(child)) {
                            element = child

                            match = child.props.path
                                ? matchPath(location.pathname, child.props)
                                : context.match
                        }
                    })
                    return match
                     ? React.cloneElement(element, { computedMatch: match })
                     : null
                }}
            </RouterContext.Consumer>
        )
    }
}
