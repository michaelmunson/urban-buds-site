import './App.css';
import Home from './components/Home';
import Shop from './components/Shop';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import Contact from './components/Contact';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AboutUs from './components/AboutUs';


function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home/>} />
				<Route path="/home" element={<Home/>} />
				<Route path='/shop' element={<Shop/>} />
				<Route path='/contact' element={<Contact/>} />
				<Route path='/signup' element={<SignUp/>} />
				<Route path='/login' element={<Login/>} />
				<Route path='/about_us' element={<AboutUs/>} />
			</Routes>
		</Router>
  	);
}

export default App;
