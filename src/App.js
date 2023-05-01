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
import Checkout from './components/Checkout';
import Admin from './components/admin/Admin';
import {addViewStat,getViewStats} from './utils/stats';
import { useEffect, useState } from 'react';


function App() {
	const [cart,setCart] = useState([]);

	useEffect(()=>{
		redirect();
		addViewStat();
	},[]);

	function redirect(){
		const {href,protocol} = window.location;
		if (protocol === "http:" && !href.includes("localhost")){
			window.location.href = href.replace("http:","https:");
		}
	}

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home/>} />
				<Route path="/home" element={<Home/>} />
				<Route path='/shop' element={<Shop setCart={setCart} cart={cart}/>} />
				<Route path='/contact' element={<Contact/>} />
				<Route path='/signup' element={<SignUp/>} />
				<Route path='/login' element={<Login/>} />
				<Route path='/about_us' element={<AboutUs/>} />
				<Route path='/checkout' element={<Checkout cart={cart} setCart={setCart}/>} />
				<Route path="/admin" element={<Admin/>} />
			</Routes>
		</Router>
  	);
}

export default App;
