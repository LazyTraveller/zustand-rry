import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import useGlobalStore from './store/useGlobalStore'

function App() {
  const globalStore = useGlobalStore((state) => state)
  console.log(globalStore)
  const { bears, count, increase, reSet, radomCount, destroy } = globalStore;
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => increase(count + 1)}>
          count is {count}
        </button>
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
    </>
  )
}

export default App
