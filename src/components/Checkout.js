import React, {useEffect, useState} from 'react';
import NavBar from './NavBar';
import { Grid, TextField, Modal, Box, Typography, Button } from '@mui/material';
import "./checkout.css";
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {sendSMS, sendEmail} from '../utils/sns';
import DeleteIcon from '@mui/icons-material/Delete';
import DATA from "../data.json";

// const {priceTable} = DATA;
// const getPrice = (ptype, quantity) => {
// 	const ptable = priceTable[ptype];
// 	let price;
// 	for (const opt of ptable){
// 		if (quantity >= opt.quantityRangeLow && quantity <= opt.quantityRangeHigh){
// 			price = opt.price;
// 			return price;
// 		}
// 	}
// }
const getPrice = (item) => {
	const {quantity,prices} = item;
	let price = 0;
	for (const p of prices){
		if (quantity > p.low && (quantity < p.high || p.high < 0)){
			price = p.price;
		}
	}
	return Math.round(((quantity * parseFloat(price)) + Number.EPSILON) * 100) / 100
}

function AuthorizerModal({modalOpen, setModalOpen, setStoreDetails}){
	const [storeId,setStoreId] = useState("");
	const [isError, setIsError] = useState(false);

	function handleStoreAuth(){
		fetch("/api/auth/store",{
			method: 'POST',
			body: JSON.stringify({
				storeId,
			}),
			headers: {
			  'Content-type': 'application/json; charset=UTF-8',
			}
		})
		.then(async res => {
			const result = await res.json();
			if (result.isStore){
				setModalOpen(false);
				setStoreDetails(result.storeDetails);
			}
			else {
				setIsError(true);
			}
		})
		.catch(err=>console.log(err));
	}

	return (
		<div className={(modalOpen)?'authorizer-modal-container open':'authorizer-modal-container'}>
			<div className='authorizer-modal'>
				<h1 className='authorizer-modal-header'>Store Verification</h1>
				<TextField error={(isError)} id="outlined-basic" label="Shop Code" variant="outlined" helperText={(isError)?"Incorrect Store Code":"Enter Your Store Code To Continue"}
					onChange={e=>{
						setStoreId(e.target.value);
					}}
				/>
				<Button disabled={storeId.length === 0} onClick={handleStoreAuth} variant="contained" color="success" style={{fontSize:"1.1rem", marginTop:"25px"}}>Submit</Button>
			</div>
		</div>
	)
}

export default function Checkout({cart, setCart}) {
	const navigate = useNavigate();
	const [modalOpen, setModalOpen] = useState(true);
	const [isPlaceOrder, setIsPlaceOrder] = useState(false);
	const [isPlaceOrderSuccess, setIsPlaceOrderSuccess] = useState(false);
	const [orderId, setOrderId] = useState(""); 
	const [storeDetails, setStoreDetails] = useState("");
	const [total, setTotal] = useState(0);
	const [version, setVersion] = useState(0);

	useEffect(()=>{
		if (cart.length === 0) navigate("/shop");
		else {
			let t = 0; 
			for (const item of cart){
				t += getPrice(item);
			}
			setTotal(t);
		}
	},[version]);

	function handlePlaceOrder(){
		setIsPlaceOrder(true);
		fetch("/api/create/order",{
			method: 'POST',
			body: JSON.stringify({
				order:cart,
				storeDetails,
			}),
			headers: {
			  'Content-type': 'application/json; charset=UTF-8',
			}
		})
		.then(async res => {
			const result = await res.json();
			setOrderId(result.orderId)
			if (!result.error){
				sendEmail([
					{
						email : "michael.s.munson@outlook.com",
						subject : "NEW ORDER",
						body : `
							<style>
								table {
								font-family: arial, sans-serif;
								border-collapse: collapse;
								width: 100%;
								}

								td, th {
								border: 1px solid #dddddd;
								text-align: left;
								padding: 8px;
								}

								tr:nth-child(even) {
								background-color: #dddddd;
								}
							</style>
							<h1>NEW ORDER PLACED</h1>
							<h2>Order – #${result.orderId}</h2>
							<hr/>
							<h3>Customer</h3>
							<p>ID: <b>${storeDetails.store_id}</b></p>
							<p>Address: <b>${storeDetails.address}</b></p>
							<p>Phone: <b>${storeDetails.phone}</b></p>
							<hr/>
							<h3>Order Details</h3>
							<table>
								<tr>
									<th>Strain</th>
									<th>Quantity (oz)</th>
								</tr>
								${cart.map(item => (
									`
									<tr>
										<td> ${item.name} </td>
										<td> ${item.quantity} </td>
									</tr>
									`
								))}
							</table>
						`
					},
					{
						email: storeDetails.email,
						subject: "Urban Buds Order Reciept",
						body : `
							<style>
								table {
								font-family: arial, sans-serif;
								border-collapse: collapse;
								width: 100%;
								}

								td, th {
								border: 1px solid #dddddd;
								text-align: left;
								padding: 8px;
								}

								tr:nth-child(even) {
								background-color: #dddddd;
								}
							</style>
							<h1>ORDER RECEIPT</h1>
							<p>Thanks for shopping with Urban Buds!</p>
							<p>You will recieve a text by the end of the business day regarding the estimated delivery time of your order.</p>
							<h2>Order – #${result.orderId}</h2>
							<hr/>
							<h3>Order Details</h3>
							<table>
								<tr>
									<th>Strain</th>
									<th>Quantity (oz)</th>
								</tr>
								${cart.map(item => (
									`
									<tr>
										<td> ${item.name} </td>
										<td> ${item.quantity} </td>
									</tr>
									`
								))}
							</table>
						`
					}
				])
				sendSMS(`ORDER PLACED — ${orderId}`,'6313180947');
				setIsPlaceOrderSuccess(true);
				setCart([]);
			}
		})
		.catch(err=>console.log(err));
	}

	function handleRemoveItem(itemName){
		const newCart = cart.filter(item => item.name !== itemName);
		setCart(newCart);
		setVersion(version+1);
		if (newCart.length < 1) navigate("/shop");
	}

	if (isPlaceOrderSuccess){
		return (
			<>
				<NavBar pages={["Home", "About Us", "Contact"]}/>
				<div className='checkout-success-container'>
					<CheckCircleIcon style={{color:"green",fontSize:"4rem"}}/>
					<h1 className='checkout-success-header'>Order Placed</h1>
					<h2 className='checkout-success-orderid'>Order #{orderId}</h2>
					<p style={{textAlign:"center",fontWeight:"bold"}}>Your order has been successfully placed. <br/> You should recieve an email containing your receipt shortly. </p>
					<Button onClick={()=>navigate("/shop")} variant="contained" color="success" style={{fontSize:"1.1rem", marginTop:"25px"}}>Back to Shop</Button>
				</div>
			</>
		)
	}

  	return (
		<>
			<NavBar pages={["Home", "About Us", "Contact", "Login"]}/>
			<div className='checkout-container'>
				<h1 className='checkout-header'>Your Cart</h1>
				<div className='checkout-item-container'>
					{cart.map((item,index) => (
						<div className='checkout-item' key={"key#"+index}>
							<div>
								<img className='checkout-item-image' src={item.image_url}/>
							</div>
							<div className='checkout-item-details'>
								<p>Strain: <b>{item.name}</b></p>
								<p>Quantity: <b>{item.quantity} oz</b></p>
								<p>Subtotal: <b>${getPrice(item)}</b></p>
							</div>
							<div className='checkout-delete-item'>
								<Button variant="text" size={"large"} color="error"
									onClick={() => handleRemoveItem(item.name)}
								><DeleteIcon/></Button>
							</div>
						</div>
					))}
				</div>
				<h2 style={{textAlign:"right",fontWeight:"normal"}}>Total: <b>${total}</b></h2>
				<Button disabled={isPlaceOrder} onClick={handlePlaceOrder} variant="contained" color="success" style={{fontSize:"1.1rem", marginTop:"25px"}}>Place Order</Button>
			</div>
			<AuthorizerModal modalOpen={modalOpen} setModalOpen={setModalOpen} setStoreDetails={setStoreDetails}/>
		</>
		
  	)
}
