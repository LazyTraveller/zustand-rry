import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import { delay } from '@/utils/index'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function App() {

  useEffect(() => {
    (async() => {
      await delay(2 * 1000)
      console.log("hello delay 2s", )
    })()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

const Nav = () => {
  const { pathname } = useLocation();
  console.log("pathname", pathname);
  const routes = [
    { path: "/home", title: "Home" },
    { path: "/about", title: "About" },
    { path: "/dashboard", title: "Dashboard" },
  ];
  return (
    <ul>
      {routes.map((route, index) => (
        <li
          key={index}
          style={{ color: pathname.match(route.path) ? "red" : "black" }}
        > 
          {pathname.match(route.path) && "✅"}
          <Link to={route.path}>{route.title}</Link>
        </li>
      ))}
    </ul>
  );
};
const Home = () => {
  return (
    <div>
      hello world, this is Home Page
      <Nav />
    </div>
  );
};

const About = () => {
  return (
    <div>
      这里是卡拉云的主页
      <Nav />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      今日活跃用户: 42
      <Nav />
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default App;
