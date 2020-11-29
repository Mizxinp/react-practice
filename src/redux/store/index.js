import {
  // createStore,
  // applyMiddleware,
  // combineReducers,
} from 'redux'
// import thunk from "redux-thunk";
// import promise from 'redux-promise'
import isPromise from 'is-promise';
import { combineReducers, createStore, applyMiddleware } from '../zredux'

function countReducer(state = 0, action) {
  switch (action.type) {
    case "ADD":
      return state + 1;
      case "MINUS":
          console.log('actio', state, action)
        return state - (action.payload || 1);
      default:
        return state;
    }
  }

const store = createStore(
  combineReducers({ count: countReducer }),
  applyMiddleware(promise, thunk)
)

function thunk({ dispatch, getState}) {
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }
    return next(action)
  }
}

function promise({ dispatch }) {
  return next => action => {
    return isPromise(action) ? action.then(dispatch) : next(action)
  }
}
export default store