import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";


function App() {
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
    </div>
  );
};

export default App;
