import React from 'react';
import {
    // BrowserRouter,
    // Link,
    // Route
    // Switch,
} from 'react-router-dom'

import {
    BrowserRouter,
    Link,
    Route,
    Switch,
} from './z-react-router-dom'

import HomePage from './pages/HomePage'
import UserPage from './pages/UserPage'
import LoginPage from './pages/LoginPage'
import ProductPage from './pages/ProductPage'

const RouterTestPage = () => {
    const style = { marginRight: 20 }
    return (
        <div>
            <BrowserRouter>
                <Link to="/" style={style}>首页</Link>
                <Link to="/product/23" style={style}>商品</Link>
                <Link to="/login" style={style}>登录</Link>
                <Link to="/user" style={style}>个人中心</Link>
                <Switch>
                    <Route
                        path="/"
                        exact
                        // children={children}
                        component={HomePage}

                    // render={HomePage}
                    />
                    <Route
                        path="/product/:id"
                        // component={Product}
                        render={() => <ProductPage />}
                    />
                    {/* <Route path="/user" component={UserPage} /> */}
                    <Route path="/user" component={Text} />
                    <Route path="/login" component={LoginPage} />
                    {/* <Route component={_404Page} /> */}
                </Switch>
            </BrowserRouter>
        </div>
    );
};

function children(props) {
    return <div>children</div>;
}

function Text(props) {
    console.log('pr', props)
    return <div>Text</div>
}

export default RouterTestPage;
