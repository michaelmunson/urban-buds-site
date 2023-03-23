import { TextField, Button } from '@mui/material';
import React, {useState, useEffect} from 'react';
import NavBar from './NavBar';
import "./form.css"
import { useNavigate } from 'react-router-dom';
import validate from '../utils/regexValidator';


export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();

  	return (
		<>
			<NavBar pages={["Home", "Shop", "About Us", "Contact"]}/>
			<div className='form-container'>
				<h1 className='form-header'>Login</h1>
				<div className='form'>
					<div>
						<TextField label="Email" variant='outlined' style={{width:'100%'}}/>
					</div>
					<div style={{margin:"20px 0px"}}>
						<TextField type="password" label="Password" variant='outlined' style={{width:'100%', background:'white'}}/>
					</div>
				</div>
				<Button onClick={()=>setIsSubmit(true)} variant="contained" color='success' size='large' style={{fontSize:"1.2rem", marginTop:"30px"}}>Submit</Button>
                <Button onClick={()=>navigate("/signup")} color='success' style={{marginTop:"20px"}}> Or Create an Account </Button>
			</div>
		</>
  	);
}
