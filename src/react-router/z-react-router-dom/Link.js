import React, { useContext } from 'react';
import { RouterContext } from './RouterContext'

const Link = ({ to, children, ...restProps}) => {
    const context = useContext(RouterContext)
    const handleClick = (event) => {
        event.preventDefault()
        context.history.push(to)
    }
    return (
        <a href={to} {...restProps} onClick={handleClick}>{children}</a>
    );
};

export default Link;