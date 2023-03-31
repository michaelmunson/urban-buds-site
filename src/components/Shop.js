import React, {useEffect, useState} from 'react';
import NavBar from './NavBar';
import { Grid, TextField, Modal, Box, Typography, Button } from '@mui/material';
import "./shop.css"
import DATA from "../data.json";
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

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

const {priceTable} = DATA;
const displayPrice = ptype => priceTable[ptype][0].price;

export default function Shop({setCart, cart}) {
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [currentProduct, setCurrentProduct] = useState(null);
	const [quantity, setQuantity] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);
	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => setModalOpen(false);

	useEffect(()=>{
		fetch("/api/get/listproducts")
			.then(async res => {
				const prods = await res.json();
				setProducts(prods);
				setCurrentProduct(prods[0]);
			})
			.catch(err => console.error(err));
	},[]);

	function addToCart(){
		if (quantity < 1) return
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
			<NavBar pages={["Home", "About Us", "Contact"]}/>
			<Grid container direction={"column"} style={{padding:"10px"}}>
				<div className='header-section'>
					
					<div className='header-section-search'>
						<Button disabled={cart.length === 0} onClick={()=>{navigate('/checkout')}} variant="contained" color="success" style={{fontSize:"1.1rem", position:"fixed", zIndex:1}}><ShoppingCartIcon/>&nbsp;Checkout</Button>

						{/* <SearchIcon style={{marginTop:"20px"}} />
						<TextField id="standard-basic" label="Search" variant="standard" /> */}
					</div>
				</div>
				<div className='product-section'>
					<div className='product-grid'>
						{products.map((product,i) => {
							return (
								<div className='product-card' key={`key${i}`} onClick={()=>{
									setCurrentProduct(products[i]);
									handleModalOpen();
								}}>
									<img className='product-card-image' src={product.image_url}/>
									<h3 className='product-card-title'> {product.name} </h3>
									<h4 className='product-card-price'>Starting @ <b>${displayPrice(product.price)}</b></h4>
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
									{priceTable[currentProduct.price].map((price,i) => (
										<tr>
											<td>
											{
												(price.quantityRangeHigh < 0)
													? `${price.quantityRangeLow}+`
													: `${price.quantityRangeLow}-${price.quantityRangeHigh}`
											}
											</td>
											<td>
												${price.price}/{price.per}
											</td>
										</tr>
									))}
								</table>
							</div>
							<div style={{display:"flex"}}>
								<TextField id="outlined-basic" label="Quantity" variant="outlined" type="number"
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
