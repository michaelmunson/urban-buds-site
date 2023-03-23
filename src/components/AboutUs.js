import { TextField, Button } from '@mui/material';
import React from 'react';
import NavBar from './NavBar';
import "./aboutus.css"
import { useNavigate } from 'react-router-dom';


export default function AboutUs() {
    const navigate = useNavigate();
  	return (
		<>
			<NavBar pages={["Home", "Shop", "Contact", "Login"]}/>
			<div className='about-us-container'>
				<h1 className='about-us-header'>About Us</h1>
                <p className='about-us-text'>
                    My business partner and I have recently started this venture with the goal of providing our customers with the best quality products at unbeatable prices. We believe that our prices are highly competitive and our quality is superior to that of our competitors. As we continue to grow our business, we aim to only improve our prices and product offerings, making it a valuable partnership for your shop.
                </p>
			</div>
		</>
  	);
}
