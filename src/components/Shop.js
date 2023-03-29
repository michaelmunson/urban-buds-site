import React, {useState} from 'react';
import NavBar from './NavBar';
import { Grid, TextField, Modal, Box, Typography, Button } from '@mui/material';
import "./shop.css"
import data from "../data.json";
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const modalStyle = {
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

const {products} = data;

export default function Shop({setCart, cart}) {
	const navigate = useNavigate();
	const [currentProduct, setCurrentProduct] = useState(products[0]);
	const [quantity, setQuantity] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);
	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => setModalOpen(false);


	function addToCart(){
		handleModalClose(); 
		const product = {
			...currentProduct,
			quantity,
		};
		setCart([...cart, product]);
		console.log(cart);
	}

	function goToCheckout(){

	}
	
	return (
    	<div className='shop-container'>
			<NavBar pages={["Home", "About Us", "Contact", "Login"]}/>
			<Grid container direction={"column"} style={{padding:"10px"}}>
				<div className='header-section'>
					
					<div className='header-section-search'>
						<Button onClick={()=>{navigate('/checkout')}} variant="contained" color="success" style={{fontSize:"1.1rem", position:"fixed", zIndex:1}}><ShoppingCartIcon/>&nbsp;Checkout</Button>

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
									<img className='product-card-image' src={product.img}/>
									<h3 className='product-card-title'> {product.title} </h3>
									<h4 className='product-card-price'>{product.price}</h4>
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
							<h1 className='modal-title'>{currentProduct.title}</h1>
							<img className='modal-image' src={currentProduct.img} alt="marijuana-plant"/>
							<h3 className='modal-price'>${currentProduct.price}/gram</h3>
							<TextField id="outlined-basic" label="Quantity" variant="outlined" type="number"
								onChange={e=>{
									setQuantity(parseInt(e.target.value));
								}}
							 />
							<Button onClick={addToCart} variant="contained" color="success" style={{fontSize:"1.1rem", marginTop:"25px"}}><AddShoppingCartIcon/>&nbsp;Add to Cart</Button>
						</div>
				</Box>
			</Modal>
		</div>
  	)
}
