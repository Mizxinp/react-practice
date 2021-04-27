// import React, {Component} from "react";
// import ReactDOM from "react-dom";
// import ReactDOM, { useState } from "./react/react-dom-v3";
import ReactDOM from "./react/react-dom-v1";
import Component from "./react/Component";

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

// function FunctionComponent(props) {
//     const [count, setCount] = useState(0);
//     return (
//       <div className="border">
//         <button onClick={() => setCount(count + 1)}>
//           {count + ""}
//         </button>
//         {count % 2 ? <p>{props.name}</p> : <span>span</span>}
//       </div>
//     );
//   }

function FunctionComponent1() {
  return (
    <div>函数组件</div>
  )
}

const jsx = (
  <div className="border">
    <p>p</p>
    <a href="https://www.baidu.com/">链接</a>
    {/* <FunctionComponent name="函数组件" /> */}
    <ClassComponent name="类组件" />
    <FunctionComponent1 />
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
