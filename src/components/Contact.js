import { TextField, Button } from '@mui/material';
import React, {useState} from 'react';
import NavBar from './NavBar';
import "./form.css"
import validate from '../utils/regexValidator';

export default function Contact() {
	const [firstName, setFirstName] = useState("");
	const [isFirstNameValid, setIsFirstNameValid] = useState(true);
	const [lastName, setLastName] = useState("");
	const [isLastNameValid, setIsLastNameValid] = useState(true);
	const [email, setEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(true);
	const [message, setMessage] = useState("");
	const [isMessageValid, setIsMessageValid] = useState(true);
	

	const handleSubmit = () => {
		setIsFirstNameValid(validate("name", firstName));
		setIsLastNameValid(validate("name", lastName));
		setIsEmailValid(validate("email", email));
		setIsMessageValid(message.length > 0);
	}

  	return (
		<>
			<NavBar pages={["Home", "Shop", "About Us", "Login"]}/>
			<div className='form-container'>
				<h1 className='form-header'>Send us a message</h1>
				<div className='form'>
					<div className='name-input-div'>
						<TextField error={!isFirstNameValid} onChange={(e)=>setFirstName(e.target.value)} label="First Name" variant='outlined' style={{width:"90%", marginRight:"5px"}}/>
						<TextField error={!isLastNameValid} onChange={(e)=>setLastName(e.target.value)} label="Last Name" variant='outlined' style={{width:"90%"}}/>
					</div>
					<div>
						<TextField error={!isEmailValid} onChange={(e)=>setEmail(e.target.value)} label="Email" variant='outlined' style={{width:'100%'}}/>
					</div>
					<div style={{margin:"20px 0px"}}>
						<TextField error={!isMessageValid} onChange={e=>setMessage(e.target.value)} label="Message" variant='outlined' style={{width:'100%', background:'white'}} multiline rows={4}/>
					</div>
				</div>
				<Button onClick={handleSubmit} variant="contained" color='success' size='large' style={{fontSize:"1.2rem", marginTop:"30px"}}>Submit</Button>
			</div>
		</>
  	)
}
