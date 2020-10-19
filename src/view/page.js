import React, { useState, useEffect } from "react";

const Page = (props) => {
  const { getState, dispatch, subscribe } = props.store;
  let [count, setCount] = useState(getState().count);

  useEffect(() => {
    // 首次加载订阅
    subscribe(() => {
      // 更新视图
      setCount(getState().count);
    });
  }, []);

  const asyadd = () => {
    dispatch((dispatch,getState) => {
      // 模拟中间件
      setTimeout(() => {
        dispatch({ type: "add" });
        // console.log(dispatch);
      }, 1000);
    });
  };

  return (
    <div>
      <div>{count}</div>
      <div>
        <button
          onClick={() => {
            dispatch({ type: "add" });
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            dispatch({ type: "dec" });
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            asyadd();
          }}
        >
          async add
        </button>
      </div>
    </div>
  );
};

// const mapStateToProps = (state) => ({
//   count: state.count,
// });

// export default connect(mapStateToProps)(Page);
export default Page;
