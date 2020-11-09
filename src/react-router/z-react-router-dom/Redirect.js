import React, { Component } from 'react'
import {RouterContext} from './RouterContext'
import LifeCycle from './LifeCycle'

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
