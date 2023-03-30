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
	const [isInvalid, setIsInvalid] = useState(false);
    const navigate = useNavigate();

	function verifyAdmin(){
		setIsSubmit(true);
		fetch("/api/auth/verifyadmin",{
			method: 'POST',
			body: JSON.stringify({
				id : username,
				password,
			}),
			headers: {
			  'Content-type': 'application/json; charset=UTF-8',
			}
		})
		.then(async res => {
			const result = await res.json();
			console.log(result);
			if (result.isAuth){
				localStorage.setItem("user",username);
				navigate("/admin");
			}
			else {
				setIsInvalid(true);
				setIsSubmit(false);
			}
		})
		.catch(err=>console.log(err));
	}

  	return (
		<>
			<NavBar pages={["Home", "Shop", "About Us", "Contact"]}/>
			<div className='form-container'>
				<h1 className='form-header'>Login</h1>
				<div className='form'>
					<div>
						<TextField onChange={e=>setUsername(e.target.value)} label="Username" variant='outlined' style={{width:'100%'}}/>
					</div>
					<div style={{margin:"20px 0px"}}>
						<TextField onChange={e=>setPassword(e.target.value)} type="password" label="Password" variant='outlined' style={{width:'100%', background:'white'}}/>
					</div>
				</div>
				<p>{(isInvalid)?"Username or Password is Incorrect" : ""}</p>
				<Button disabled={isSubmit} onClick={verifyAdmin} variant="contained" color='success' size='large' style={{fontSize:"1.2rem", marginTop:"30px"}}>Submit</Button>
			</div>
		</>
  	);
}
