import React, {Component} from "react";
import store from "./store";
console.log('store', store)

export default class ReduxTestPage extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      console.log('订阅了')
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  add = () => {
    store.dispatch({type: "ADD"});
  };

  asyAdd = () => {
    // setTimeout(() => {
    //   store.dispatch({type: "ADD"});
    // }, 1000);

    store.dispatch((dispatch, getState) => {
      setTimeout(() => {
        dispatch({type: "ADD"});
      }, 1000);
    });
  };

  promiseMinus = () => {
    store.dispatch(
      Promise.resolve({
        type: "MINUS",
        payload: 1
      })
    );
  };

  render() {
    console.log('render')
    return (
      <div>
        <h3>ReduxPage</h3>
        {/* <p>{store.getState()}</p> */}
        <p>{store.getState().count}</p>
        <button onClick={this.add}>add</button>
        <button onClick={this.asyAdd}>asyAdd</button>
        <button onClick={this.promiseMinus}>promiseMinus</button>
      </div>
    );
  }
}
