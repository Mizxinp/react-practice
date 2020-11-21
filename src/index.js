import React, {Component} from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "./react/react-dom-v1";
// import Component from "./kreact/Component";

import "./index.css";

class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <p>{this.props.name}</p>
      </div>
    );
  }
}

function FunctionComponent(props) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  );
}

const jsx = (
  <div className="border">
    <p>p</p>
    <a href="https://www.baidu.com/">链接</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
{/* 
    <>
      <h1>这是一个fragment</h1>
      <h1>这是一个fragment</h1>
    </> */}
  </div>
);

ReactDOM.render(jsx, document.getElementById("root"));

// 文本标签 done
// 原生标签 done
// 函数组件 done
// 类组件 done
// Fragment
// 逻辑组件 Provider Consumer
