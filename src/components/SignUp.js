import { TextField, Button } from '@mui/material';
import React from 'react';
import NavBar from './NavBar';
import "./form.css"
import { useNavigate } from 'react-router-dom';


export default function SignUp() {
    const navigate = useNavigate();
  	return (
		<>
			<NavBar pages={["Home", "Shop", "About Us", "Contact"]}/>
			<div className='form-container'>
				<h1 className='form-header'>Create an Account</h1>
				<div className='form'>
					<div className='name-input-div'>
						<TextField label="First Name" variant='outlined' style={{width:"90%", marginRight:"5px"}}/>
						<TextField label="Last Name" variant='outlined' style={{width:"90%"}}/>
					</div>
					<div>
						<TextField label="Email" variant='outlined' style={{width:'100%'}}/>
					</div>
					<div style={{margin:"20px 0px"}}>
						<TextField type="password" label="Password" variant='outlined' style={{width:'100%', background:'white'}}/>
					</div>
                    <div style={{margin:"20px 0px"}}>
						<TextField type="password" label="Confirm Password" variant='outlined' style={{width:'100%', background:'white'}}/>
					</div>
				</div>
				<Button variant="contained" color='success' size='large' style={{fontSize:"1.2rem", marginTop:"30px"}}>Submit</Button>
                <Button onClick={()=>navigate("/login")} color='success' style={{marginTop:"20px"}}> Already have an account? Login </Button>
			</div>
		</>
  	);
}
