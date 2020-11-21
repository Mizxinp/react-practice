/**
 * 使用fiber架构（初始化过程）
 *  
 *  
 */

function performUnitOfWork(workInProgress) {
    // * 1、执行当前的fiber
    const { type } = workInProgress
    if (typeof type === 'function') {
        type.prototype.isReactComponent
            ? updateClassComponent(workInProgress)
            : updateFunctionComponent(workInProgress)
    } else {
        updateHostComponent(workInProgress)
    }

    // * 2、返回下一个fiber
    // 先找子节点
    if (workInProgress.child) {
        return workInProgress.child
    }
    // 没有子节点，则找兄弟节点
    let nextFiber = workInProgress
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.return
    }
}

// 下一个fiber任务
let nextUnitOfWork = null
// 正在进行中的节点
let workInProgressRoot = null

function workLoop(IdleDeadline) {
    while(nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
        // 因为是一个单链表结构，所以执行当前fiber后，返回下一个fiber
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }

    if (!nextUnitOfWork && workInProgressRoot) {
        commitRoot()
    }
}

requestIdleCallback(workLoop)

function commitRoot() {
    commitWorker(workInProgressRoot.child)
    workInProgressRoot = null
}

function commitWorker(workInProgress) {
    console.log('workInProgress111', workInProgress)
    if (!workInProgress) return

    // 1、提交当前fiber
    let parentNodeFiber = workInProgress.return
    while(!parentNodeFiber.stateNode) {
        parentNodeFiber = parentNodeFiber.return
    }
    // 父或者祖先 dom节点
    const parentNode = parentNodeFiber.stateNode
    if (workInProgress.stateNode) {
        parentNode.appendChild(workInProgress.stateNode)
    }
    console.log('workInProgress', workInProgress)

    // 1、提交当前fiber的子节点
    commitWorker(workInProgress.child)
    // 2、提交当前fiber的兄弟节点
    commitWorker(workInProgress.sibling)
}

function render(vnode, container) {
    console.log('v',vnode)
    workInProgressRoot = {
        stateNode: container,
        props: {children: vnode}
      };
    
    nextUnitOfWork = workInProgressRoot;
}

function createNode(workInProgress) {
    let node = null;
  
    const {type, props} = workInProgress;
  
    if (typeof type === "string") {
      // 原生标签
      node = document.createElement(type);
    }
  
    updateNode(node, props);
  
    return node;
  }

/**
 * 原生标签节点, 其实做的都一样，更新属性，如果有children，就协调children
 * @param {*} workInProgress 
 */
function updateHostComponent(workInProgress) {
    if (!workInProgress.stateNode) {
        workInProgress.stateNode = createNode(workInProgress)
    }
    // 协调children
    reconcileChildren(workInProgress, workInProgress.props.children)
}


function reconcileChildren(workInProgress, children) {
    if (!(workInProgress.props && typeof workInProgress.props.children !== 'string')) {
        return
    }

    let newChildren = Array.isArray(children) ? children : [children]

    let previousNewFiber = null
    for (let index = 0; index < newChildren.length; index++) {
        const child = newChildren[index]

        let newFiber = null

        // 初次构造fiber结构
        newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            sibling: null,
            return: workInProgress,
            stateNode: null
        }

        if (index === 0) {
            workInProgress.child = newFiber
        } else {
            previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
    }
}

/**
 * 函数组件，执行函数
 * @param {*} vnode 
 */
function updateFunctionComponent(workInProgress) {
    const { type, props } = workInProgress
    const children = type(props)
    reconcileChildren(workInProgress, children)
}

/**
 * 类组件
 * 先实例化，再调用render方法
 * @param {*} vnode
 */
function updateClassComponent(workInProgress) {
    const { type, props } = workInProgress
    const instance = new type(props)
    const children = instance.render()
    reconcileChildren(workInProgress, children)
}

/**
 * 更新属性
 * @param {*} node 
 * @param {*} nextVal 
 */
function updateNode(node, nextVal) {
    Object.keys(nextVal).forEach(k => {
      if (k === "children") {
        if (typeof nextVal.children === "string") {
          const textNode = document.createTextNode(nextVal.children);
          node.appendChild(textNode);
        }
      } else {
        node[k] = nextVal[k];
      }
    });
}

export default { render }
