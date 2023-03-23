import { TextField, Button } from '@mui/material';
import React, {useState, useEffect} from 'react';
import NavBar from './NavBar';
import "./form.css"
import { useNavigate } from 'react-router-dom';
import validate from '../utils/regexValidator';


export default function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [isFirstNameValid, setIsFirstNameValid] = useState(true);
	const [lastName, setLastName] = useState("");
	const [isLastNameValid, setIsLastNameValid] = useState(true);
	const [email, setEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(true);
	const [password, setPassword] = useState("");
	const [isPasswordValid, setIsPasswordValid] = useState(true);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

	const handleSubmit = () => {
		setIsFirstNameValid(validate("name", firstName));
		setIsLastNameValid(validate("name", lastName));
		setIsEmailValid(validate("email", email));
		setIsPasswordValid(validate("password", password));
		setIsConfirmPasswordValid(password === confirmPassword && confirmPassword.length > 0);
	}

    const navigate = useNavigate();
  	return (
		<>
			<NavBar pages={["Home", "Shop", "About Us", "Contact"]}/>
			<div className='form-container'>
				<h1 className='form-header'>Create an Account</h1>
				<div className='form'>
					<div className='name-input-div'>
						<TextField error={!isFirstNameValid} onChange={(e)=>setFirstName(e.target.value)} label="First Name" variant='outlined' style={{width:"90%", marginRight:"5px"}}/>

						<TextField error={!isLastNameValid} onChange={(e)=>setLastName(e.target.value)} label="Last Name" variant='outlined' style={{width:"90%"}}/>
					</div>
					<div>
						<TextField error={!isEmailValid} onChange={(e)=>setEmail(e.target.value)} label="Email" variant='outlined' style={{width:'100%'}}/>
					</div>
					<div style={{margin:"20px 0px"}}>
						<TextField 
							helperText={(!isPasswordValid)?"Use 8 or more characters with a mix of upper & lower case letters, numbers & symbols":""}
							error={!isPasswordValid} onChange={(e)=>setPassword(e.target.value)} type="password" label="Password" variant='outlined' style={{width:'100%', background:'white'}}/>
					</div>
                    <div style={{margin:"20px 0px"}}>
						<TextField 
							helperText={(!isConfirmPasswordValid)?"Passwords must match":""}
							error={!isConfirmPasswordValid} onChange={(e)=>setConfirmPassword(e.target.value)} type="password" label="Confirm Password" variant='outlined' style={{width:'100%', background:'white'}}/>
					</div>
				</div>
				<Button onClick={handleSubmit} variant="contained" color='success' size='large' style={{fontSize:"1.2rem", marginTop:"30px"}}>Submit</Button>
                <Button onClick={()=>navigate("/login")} color='success' style={{marginTop:"20px"}}> Already have an account? Login </Button>
			</div>
		</>
  	);
}
