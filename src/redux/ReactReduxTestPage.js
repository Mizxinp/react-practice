import { Component } from "react";
// import { connect } from "react-redux";

// import {bindActionCreators} from "redux";
import { bindActionCreators, connect } from "./zreact-redux/zreact-redux";

// connect原理 高阶组件（hoc）
class ReactReduxTestPage extends Component {
    render() {
        const { count, dispatch, add, minus } = this.props;
        return (
            <div>
                <h3>ReactReduxTestPage</h3>
                <p>{count}</p>
                <button onClick={() => dispatch({ type: "ADD", payload: 100 })}>
                    dispatch add
        </button>
                <button onClick={add}> add</button>
                <button onClick={minus}>minus </button>
            </div>
        );
    }
}
export default connect(
    // mapStateToProps 把state映射到props
    ({ count }) => ({ count }),
    // mapDispatchToProps object| function
    // {add: () => ({type: "ADD"}), minus: () => ({type: "MINUS"})}

    dispatch => {
        let creators = {
            add: () => ({ type: "ADD" }),
            minus: () => ({ type: "MINUS" })
        };

        creators = bindActionCreators(creators, dispatch);

        return { dispatch, ...creators };
    }
)(ReactReduxTestPage);


// function connect(mapStateToProps, mapDispatchToProps) {
//     return function (component) {
//         return function (props) {

//         }
//     }
// }

// connect(props)(ReactReduxTestPage)