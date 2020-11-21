function render(vnode, container) {
    console.log('v',vnode)
    // vnode => node
    const node = createNode(vnode)
    // appendChild
    container.appendChild(node)
}

function createNode(vnode) {
    let node = null

    const { type } = vnode

    // 原生标签
    if (typeof type === 'string') {
        node = updateHostComponent(vnode)
    } else if (typeof type === 'function') {
        // 函数组件和类组件
        node = type.prototype.isReactComponent
            ? updateClassComponent(vnode)
            : updateFunctionComponent(vnode)
    } else {
        // Fragment
        node = createFragmentComponent(vnode)
    }
    return node
}

/**
 * 原生标签节点
 * @param {*} vnode 
 */
function updateHostComponent(vnode) {
    const { type, props } = vnode
    let node = document.createElement(type)

    // 文本
    if (typeof props.children === 'string') {
        let childText = document.createTextNode(props.children)
        node.appendChild(childText)
    } else {
        reconcileChildren(props.children, node)
    }

    // 更新属性
    updateNode(node, props)

    return node
}

/**
 * 函数组件，执行函数
 * @param {*} vnode 
 */
function updateFunctionComponent(vnode) {
    const { type, props } = vnode
    const vvnode = type(props)
    const node = createNode(vvnode)
    return node
}

/**
 * 类组件
 * 先实例化，再调用render方法
 * @param {*} vnode
 */
function updateClassComponent(vnode) {
    const { type, props } = vnode
    const instance = new type(props)
    const vvnode = instance.render()
    const node = createNode(vvnode)
    return node
}

function createFragmentComponent(vnode) {
    const node = document.createDocumentFragment();
    reconcileChildren(vnode.props.children, node)
    return node
}

// vnode => node, 插入到dom节点
function reconcileChildren(children, node) {
    if (Array.isArray(children)) {
        for (let index = 0; index < children.length; index++) {
          const child = children[index];
          render(child, node);
        }
      } else {
        render(children, node);
      }
}

/**
 * 更新属性
 * @param {*} node 
 * @param {*} nextVal 
 */
function updateNode(node, nextVal) {
    Object.keys(nextVal)
      .filter(key => key !== "children")
      .forEach(key => {
        node[key] = nextVal[key];
      });
  }

export default { render }
