import { TextField, Button } from '@mui/material';
import React from 'react';
import NavBar from './NavBar';
import "./form.css"


export default function Contact() {

  	return (
		<>
			<NavBar pages={["Home", "Shop", "About Us", "Login"]}/>
			<div className='form-container'>
				<h1 className='form-header'>Send us a message</h1>
				<div className='form'>
					<div className='name-input-div'>
						<TextField label="First Name" variant='outlined' style={{width:"90%", marginRight:"5px"}}/>
						<TextField label="Last Name" variant='outlined' style={{width:"90%"}}/>
					</div>
					<div>
						<TextField label="Email" variant='outlined' style={{width:'100%'}}/>
					</div>
					<div style={{margin:"20px 0px"}}>
						<TextField label="Message" variant='outlined' style={{width:'100%', background:'white'}} multiline rows={4}/>
					</div>
				</div>
				<Button variant="contained" color='success' size='large' style={{fontSize:"1.2rem", marginTop:"30px"}}>Submit</Button>
			</div>
		</>
  	)
}
