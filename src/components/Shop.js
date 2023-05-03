import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Button, Grid, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import comingSoon from "../images/coming-soon.png";
import NavBar from './NavBar';
import "./shop.css";
import FullPageSpinner from './utils/FullPageSpinner';
import InventorySticker from './utils/InventorySticker';

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	maxWidth:"75vw",
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	borderRadius:"20px"
};

export default function Shop({setCart, cart}) {
	const navigate = useNavigate();
	const [loading,setLoading] = useState(true);
	const [products, setProducts] = useState([]);
	const [currentProduct, setCurrentProduct] = useState(null);
	const [quantity, setQuantity] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalErrorMessage,setModalErrorMessage] = useState("")
	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => setModalOpen(false);

	useEffect(()=>{
		fetch("/api/get/listproducts")
			.then(async res => {
				const prods = await res.json();
				setProducts(prods);
				setCurrentProduct(prods[0]);
				setLoading(false);
			})
			.catch(err => console.error(err));
	},[]);

	function addToCart(){
		if (quantity < currentProduct.prices[0].low){
			setModalErrorMessage(`Quantity must be greater than ${currentProduct.prices[0].low}`);
			return
		}
		setModalErrorMessage("")
		handleModalClose(); 
		const product = {
			...currentProduct,
			quantity,
		};
		setCart([...cart, product]);
	}

	if (!currentProduct) return (<div></div>)
	
	return (
    	<div className='shop-container'>
			<FullPageSpinner loading={loading}/>
			<NavBar pages={["Home", "About Us", "Contact"]}/>
			<Grid container direction={"column"} style={{padding:"10px"}}>
				<div className='header-section'>
					
					<div className='header-section-search'>
						<Button disabled={cart.length === 0} onClick={()=>{navigate('/checkout')}} variant="contained" color="success" style={{fontSize:"1.1rem", position:"fixed", zIndex:1}}><ShoppingCartIcon/>&nbsp;Checkout</Button>
					</div>
				</div>
				<div className='product-section'>
					<div className='product-grid'>
						{products.map((product,i) => {
							return (
								<div style={{position:"relative"}}>
									<InventorySticker type={product.inventory_type}/>

									<div style={{position:"relative"}} className={(product.inventory_type === "soon" || product.inventory_type === "out")?'product-card coming-soon':"product-card"} key={`key${i}`} onClick={()=>{
										setCurrentProduct(products[i]);
										if (product.inventory_type === "standard" || product.inventory_type === "low"){
											handleModalOpen();
										}
									}}>

										<img className='product-card-image' src={product.image_url}/>
										<h3 className='product-card-title'> {product.name} </h3>
										<h4 className='product-card-price'>Starting @ <b>${product.prices[0].price}/{product.per}</b></h4>
									</div>
								</div>
								
							);
						})}
					</div>
				</div>
			</Grid>
			<Modal
				open={modalOpen}
				onClose={handleModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={modalStyle}>
						<div className='modal-card'>
							<h1 className='modal-title'>{currentProduct.name}</h1>
							<p className='modal-description'>{currentProduct.strain_type}</p>
							<img className='modal-image' src={currentProduct.image_url} alt="marijuana-plant"/>
							<p className='modal-description'>{currentProduct.description}</p>
							<div className='modal-table-container'>
								<table className='modal-table'>
									<tr>
										<th>Quantity</th>
										<th>Price</th>
									</tr>
									{currentProduct.prices.map((price,i) => (
										<tr key={`key${i}`}>
											<td>
											{
												(price.high < 0)
													? `${price.low}+`
													: `${price.low} – ${price.high}`
											}
											</td>
											<td>
												${price.price}/{currentProduct.per}
											</td>
										</tr>
									))}
								</table>
							</div>
							<div style={{display:"flex"}}>
								<TextField 
									disabled={currentProduct.inventory_type !== "standard"} 
									id="outlined-basic" 
									label="Quantity" 
									variant="outlined" 
									type="number"
									error={(modalErrorMessage.length > 0)}
									helperText={modalErrorMessage}
									min={0}
									onChange={e=>{
										setQuantity(parseInt(e.target.value));
									}}
								/>
								<Button onClick={addToCart} variant="contained" color="success" style={{fontSize:"1.1rem", margin:"0px 5px"}}><AddShoppingCartIcon/></Button>
							</div>
							
						</div>
				</Box>
			</Modal>
		</div>
  	)
}
