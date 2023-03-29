import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import NavBar from './NavBar';
import "./home.css"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import LockIcon from '@mui/icons-material/Lock';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import data from "../data.json";

const imageData = data.products;

export default function Home() {
	const navigate = useNavigate(); 

	// function getUsers(){
		// fetch("/api/users",{
		// 	method: 'POST',
		// 	body: JSON.stringify({
		// 		"test":"test",
		// 	}),
		// 	headers: {
		// 	  'Content-type': 'application/json; charset=UTF-8',
		// 	}
		// })
		// .then(async res => {
		// 	const result = await res.json();
		// 	console.log(result)
		// })
		// .catch(err=>console.log(err));
	// }

	// getUsers();

	return (
		<>
			<NavBar pages={['Shop','About Us', 'Contact', 'Login']}/>
			<Grid container direction={"column"}>
				<div className='landing-page-section-1'>
					<h1 className='main-header'>New Items, Great Deals</h1>
					<div className='landing-page-section-1-button-div'>
						<Button onClick={()=>navigate('/shop')} className="main-shop-now-button" variant="contained" size="large" style={{fontSize:"1.5rem", fontFamily: "'Farsan', cursive",lineHeight:"2", background: "white", color: "green", paddingBottom: "0px", fontWeight: "bold"}} color={"secondary"}>
							Shop Now
						</Button>
					</div>
				</div>
				<div className='landing-page-section-2'>
					<div className='basic-card'>
						<AttachMoneyIcon style={{fontSize:"4rem"}}/>
						<h2>Great Deals</h2>
						<p>We provide the best deals on the market – in terms of both quality and price. </p>
					</div>
					<div className='basic-card'>
						<SpeedIcon style={{fontSize:"4rem"}}/>
						<h2>Speedy Delivery</h2>
						<p>Quick deliveries ensure you never have to worry about going without product. </p>
					</div>
					<div className='basic-card'>
						<LockIcon style={{fontSize:"4rem"}}/>
						<h2>Security</h2>
						<p>Privacy is our #1 concern at Urban Buds. When you order with us, you're secure. </p>
					</div>
				</div>
				<div className='landing-page-section-3'>
					<h2 style={{fontFamily: "'Farsan', cursive", fontSize:"3rem"}}> Check out our products! </h2>
					<ImageList sx={{ width: "75%"}} cols={3}>
						{imageData.map((item) => (
							<ImageListItem 
								key={item.img} 
								className="weed-image-list-item"
								onClick={()=>navigate("/shop")}>
							<img
								src={`${item.img}`}
								alt={item.title}
								loading="lazy"
								className='weed-image'
							/>
							<ImageListItemBar
								title={item.title}
								className="weed-image-list-item-bar"
							/>
							</ImageListItem>
						))}
					</ImageList>
				</div>
				<div className='landing-page-section-4'>
					<button onClick={()=>navigate("/contact")} className='questions-button'>Got Any Questions?</button>
					<p>Feel free to contact us, we're always happy to help!</p>
				</div>
				<div className='landing-page-footer'>
					<p className='landing-page-footer-text'>©2023 by Urban Buds</p>
				</div>
			</Grid>
		</>
	)
}
