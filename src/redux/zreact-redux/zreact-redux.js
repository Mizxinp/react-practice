import React, {
    useContext,
    useReducer,
    useCallback,
    useLayoutEffect
  } from "react";

const Context = React.createContext()

export function Provider({ store, children }) {
    return <Context.Provider value={store}>{children}</Context.Provider>
}

export const connect = (
    mapStateToProps = (state) => state,
    mapDispatchToProps
) => WrapperComponent => props => {
    const store = useContext(Context)
    const { getState, dispatch, subscribe } = store
    
    const stateProps = mapStateToProps(getState())

    let dispatchProps = { dispatch }

    if (typeof mapDispatchToProps === 'object') {
        dispatchProps = bindActionCreators(mapDispatchToProps, dispatch)
    } else if (typeof mapDispatchToProps === 'function') {
        dispatchProps = mapDispatchToProps(dispatch)
    }
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    useLayoutEffect(() => {
        const unsubscribe = store.subscribe(() => { forceUpdate() })
        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [store])

    return <WrapperComponent {...props} {...stateProps} {...dispatchProps} />
}

function bindActionCreator(creator, dispatch) {
    return (...args) => dispatch(creator(...args))
}

export function bindActionCreators(creators, dispatch) {
    let obj = {}

    for (const key in creators) {
        obj[key] = bindActionCreator(creators[key], dispatch)
    }

    return obj
}
