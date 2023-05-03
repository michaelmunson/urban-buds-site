import { useEffect, useState } from 'react';
import {
	Route,
	BrowserRouter as Router,
	Routes
} from "react-router-dom";
import './App.css';
import AboutUs from './components/AboutUs';
import Checkout from './components/Checkout';
import Contact from './components/Contact';
import Home from './components/Home';
import Login from './components/Login';
import Shop from './components/Shop';
import SignUp from './components/SignUp';
import Admin from './components/admin/Admin';
import AdminStats from './components/admin/AdminStats';
import DatabaseManager from './components/admin/DatabaseManager';
import { httpsRedirect } from './utils/location';
import { addViewStat } from './utils/stats';
import Dashboard from './components/admin/Dashboard';

function App() {
	const [cart,setCart] = useState([]);

	useEffect(()=>{
		httpsRedirect();
		addViewStat({localhost:false});
	},[]);

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
				<Route path="/admin" element={<Admin/>}/>
				<Route path="/admin/dashboard" element={<Dashboard/>}/>
				<Route path="/admin/stats" element={<AdminStats/>}/>
				<Route path="/admin/dbmanager" element={<DatabaseManager/>}/>
			</Routes>
		</Router>
  	);
}

export default App;
