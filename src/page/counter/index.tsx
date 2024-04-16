import React from "react";
import useGlobalStore from "@/store/useGlobalStore";

const Counter = () => {
  const globalStore = useGlobalStore((state) => state);
  console.log(globalStore);
  const { bears, count, increase, reSet, radomCount, destroy } = globalStore;
  return (
    <div>
      <h1>Demo</h1>
      <div className="card">
        <button onClick={() => increase(count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <h3>Parent</h3>
        <div>
          bears ( {bears} ):
          <button onClick={() => increase()}>增加 </button>
          <button onClick={() => reSet(10086)}>重置为10086</button>
        </div>
        <div>
          count ( {count} ): <button onClick={() => radomCount()}>随机</button>
        </div>
        <div>
          <button onClick={() => destroy()}>销毁</button>
        </div>
      </div>
    </div>
  );
};

export default Counter;
