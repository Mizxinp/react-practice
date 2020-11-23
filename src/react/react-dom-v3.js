import { UPDATE, PLACEMENT, DELETION } from "./const"

/**
 * 使用fiber架构（更新过程）
 *  
 */

// 当前的根结点
let currentRoot = null
// 搜集要删除的fiber
let deletions = null;

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

    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function commitRoot() {
    deletions.forEach(commitWorker)
    commitWorker(workInProgressRoot.child)
    currentRoot = workInProgressRoot
    workInProgressRoot = null
}

function commitWorker(workInProgress) {
    if (!workInProgress) return

    // 1、提交当前fiber
    let parentNodeFiber = workInProgress.return
    while(!parentNodeFiber.stateNode) {
        parentNodeFiber = parentNodeFiber.return
    }
    // 父或者祖先 dom节点
    const parentNode = parentNodeFiber.stateNode
    if (workInProgress.effectTag === PLACEMENT && workInProgress.stateNode) {
        parentNode.appendChild(workInProgress.stateNode)
    } else if (workInProgress.effectTag === UPDATE && workInProgress.stateNode) {
        updateNode(
          workInProgress.stateNode,
          workInProgress.base.props,
          workInProgress.props
        );
    } else if (workInProgress.effectTag === DELETION && workInProgress.stateNode) {
        commitDeletion(workInProgress, parentNode);
      }

    // 1、提交当前fiber的子节点
    commitWorker(workInProgress.child)
    // 2、提交当前fiber的兄弟节点
    commitWorker(workInProgress.sibling)
}

function commitDeletion(workInProgress, parentNode) {
    // removeChild
    if (workInProgress.stateNode) {
      // workInProgress有真实dom节点
      parentNode.removeChild(workInProgress.stateNode);
    } else {
      commitDeletion(workInProgress.child, parentNode);
    }
  }

function render(vnode, container) {
    console.log('v',vnode)
    workInProgressRoot = {
        stateNode: container,
        props: {children: vnode}
      };
    
    nextUnitOfWork = workInProgressRoot;
    deletions = []
}

function createNode(workInProgress) {
    let node = null;
  
    const {type, props} = workInProgress;
  
    if (typeof type === "string") {
      // 原生标签
      node = document.createElement(type);
    }
  
    updateNode(node, {}, props);
  
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
    // 第一个老的节点
    let oldFiber = workInProgress.base && workInProgress.base.child
    for (let index = 0; index < newChildren.length; index++) {
        const child = newChildren[index]

        const same = child && oldFiber && child.type === oldFiber.type

        let newFiber = null
        // 如果类型相同，表示可以复用（没有考虑key值的情况）
        if (same) {
            newFiber = {
                type: child.type,
                props: child.props,
                child: null,
                sibling: null,
                return: workInProgress,
                stateNode: oldFiber.stateNode,
                base: oldFiber,
                effectTag: UPDATE,
            }
        }

        // 不能复用，新增加入
        if (!same && child) {
            newFiber = {
                type: child.type,
                props: child.props,
                child: null,
                sibling: null,
                return: workInProgress,
                stateNode: null,
                base: null,
                effectTag: PLACEMENT,
            }
        }

        // 删除
        if (!same && oldFiber) {
            oldFiber.effectTag = DELETION
            deletions.push(oldFiber)
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling;
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
    // hook开始的地方
    workInProgressFiber = workInProgress
    workInProgressFiber.hooks = []
    workInProgressFiber.hookIndex = 0

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
function updateNode(node, preVal, nextVal) {
    Object.keys(preVal).forEach(k => {
        if (k === "children") {
            if (typeof nextVal.children === "string") {
                node.innerHTML = "";
            }
        } else {
          // 源码当中事件是合成事件，利用了事件委托，react17之前是把事件添加到document上，react17是添加到了container
            if (k.slice(0, 2) === "on") {
                let eventName = k.slice(2).toLowerCase();
                node.removeEventListener(eventName, preVal[k]);
            } else {
                //  老的有 新的没有
                if (!(k in nextVal)) {
                node[k] = "";
                }
            }
        }
    })

    Object.keys(nextVal).forEach(k => {
      if (k === "children") {
        if (typeof nextVal.children === "string") {
            node.innerHTML = nextVal.children;
          }
      } else {
        // 源码当中事件是合成事件，利用了事件委托，react17之前是把事件添加到document上，react17是添加到了container
        if (k.slice(0, 2) === "on") {
            let eventName = k.slice(2).toLowerCase();
            node.addEventListener(eventName, nextVal[k]);
          } else {
            node[k] = nextVal[k];
          }
      }
    });
}


// 当前正在工作的fiber
let workInProgressFiber = null

export function useState(init) {
    const oldHook = workInProgressFiber.base && workInProgressFiber.base.hooks[workInProgressFiber.hookIndex]
    const hook = oldHook
        ? {
            state: oldHook.state,
            queue: oldHook.queue,
        }
        : { state: init, queue: [] }

    // 批量更新
    hook.queue.forEach(action => {
        hook.state = action
    })

    const setState = (action) => {
        hook.queue.push(action)
        workInProgressRoot = {
            stateNode: currentRoot.stateNode,
            props: currentRoot.props,
            base: currentRoot
        }
        nextUnitOfWork = workInProgressRoot
        deletions = []
    }
    workInProgressFiber.hooks.push(hook)
    workInProgressFiber.hookIndex++

    return [hook.state, setState]
}

export default { render }
