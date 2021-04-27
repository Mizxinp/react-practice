function createStore(reducer, enhancer) {
    if (enhancer) {
        // enhance: 增强store.dispatch的
        return enhancer(createStore)(reducer)
    }

    let currentState

    // 监听函数数组
    let currentListeners = []

    // 获取状态
    function getState() {
        return currentState
    }

    // 修改状态
    function dispatch(action) {
        currentState = reducer(currentState, action)
        // store中的state已经发生变化

        // 通知组件修改变化
        currentListeners.forEach(listener => listener())
    }

    function subscribe(listener) {
        currentListeners.push(listener)

        // 返回取消订阅函数
        return () => {
            const index = currentListeners.indexOf(listener)
            currentListeners.splice(index, 1)
        }
    }

    // 手动执行dispatch，派发初始值
    dispatch({ type: "xxxxxx"})

    return {
        getState,
        dispatch,
        subscribe,
    }
}

export default createStore;