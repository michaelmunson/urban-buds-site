import React, {useState} from 'react';
import NavBar from './NavBar';
import { Grid, TextField, Modal, Box, Typography, Button } from '@mui/material';
import "./checkout.css";
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const modalStyle = {
	pointerEvents:"none",
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

function AuthorizerModal({modalOpen, setModalOpen}){
	const [storeId,setStoreId] = useState(null);
	const [isError, setIsError] = useState(false);

	function handleStoreAuth(){
		fetch("/api/storeauth",{
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
				<Button onClick={handleStoreAuth} variant="contained" color="success" style={{fontSize:"1.1rem", marginTop:"25px"}}>Submit</Button>
			</div>
		</div>
	)
}

export default function Checkout({cart, setCart}) {
	const navigate = useNavigate();
	const [modalOpen, setModalOpen] = useState(false);
	const [isPlaceOrder, setIsPlaceOrder] = useState(false);
	const [isPlaceOrderSuccess, setIsPlaceOrderSuccess] = useState(false);
	const [orderId, setOrderId] = useState(""); 

	function handlePlaceOrder(){
		setIsPlaceOrder(true)
		fetch("/api/createorder",{
			method: 'POST',
			body: JSON.stringify({
				order:cart,
			}),
			headers: {
			  'Content-type': 'application/json; charset=UTF-8',
			}
		})
		.then(async res => {
			const result = await res.json();
			console.log(result);
			setOrderId(result.orderId)
			if (!result.error){
				setIsPlaceOrderSuccess(true);
				setCart([]);
			}
		})
		.catch(err=>console.log(err));
	}


	if (isPlaceOrderSuccess){
		return (
			<>
				<NavBar pages={["Home", "About Us", "Contact", "Login"]}/>
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
				{cart.map((item,index) => (
					<div className='checkout-item' key={"key#"+index}>
						<div>
							<img className='checkout-item-image' src={item.img}/>
						</div>
						<div className='checkout-item-details'>
							<p>Strain: <b>{item.title}</b></p>
							<p>Quantity: <b>{item.quantity} oz</b></p>
							<p>Subtotal: <b>${Math.round(((item.quantity * parseFloat(item.price)) + Number.EPSILON) * 100) / 100}</b></p>
						</div>
					</div>
				))}
				<Button disabled={isPlaceOrder} onClick={handlePlaceOrder} variant="contained" color="success" style={{fontSize:"1.1rem", marginTop:"25px"}}>Place Order</Button>
			</div>
			<AuthorizerModal modalOpen={modalOpen} setModalOpen={setModalOpen}/>
		</>
		
  	)
}
