export function createStore(reducer, enhancer) {
  if (enhancer) {
    // 通过中间件重新加强createStore过程
    return enhancer(createStore)(reducer);
  }

  let currentState = undefined;
  let currentListeners = [];

  function getState() {
    return currentState;
  }

  function dispatch(action) {

    currentState = reducer(currentState, action);
    //   触发监听函数
    currentListeners.forEach((listener) => listener());
  }

  // 订阅，可订阅多次
  function subscribe(listener) {
    currentListeners.push(listener);
  }

  // 初始化，type填写不与业务层重复即可
  dispatch({ type: "@@redux/init" });

  return {
    getState,
    dispatch,
    subscribe,
  };
}

// applyMiddleware接收多个中间件
export function applyMiddleware(...middlewares) {
  // 中间件生成后返回接受createStore函数，再返回接受reducer函数
  return (createStore) => (...args) => {
    // [reducer]
    const store = createStore(...args); //参数传递，参数解构 a(...[x,y]) ---  funciton(x,7)

    let dispatch = store.dispatch;
    const middleApie = {
      getState: store.getState,
      dispatch,
    };

    // 聚合中间件 加强store dispatch getState等api  得到中间件链
    const middlewareChain = middlewares.map((middleware) => middleware(middleApie));

    // 生成经过中间件处理加强版dispatch
    // dispatch先通过logger加强函数，把加强版的dispatch传递给thunk，thunk再对外暴露加强版dispath，因此外部调用时先执行thunk -> logger -> dispatch
    dispatch = compose(...middlewareChain)(dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

// 聚合函数数组倒叙执行
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  // 闭包，从函数组最后一个开始执行  对外暴露dispath最终是数组第一个，因此是a(b())
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// 日志中间件，返回
export function logger(middleApie) {
  // 参数middleApi没用到

  // 接收dispathc 返回加强版dispatch
  return (dispatch) => (action) => {
    // 日志输出
    console.log(`${action.type}执行了`);
    return dispatch(action);
  };
}

// 接收函数中间件
export function thunk({ getState }) {
  // 接收dispathc 返回加强版dispatch
  return (dispatch) => (action) => {
    
    // action 可以是函数可以是对象  
    if (typeof action === "function") {
      return action(dispatch, getState);
    }

    return dispatch(action);
  };
}
