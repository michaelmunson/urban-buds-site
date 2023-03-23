
const validRegex = {
	name : /[A-Za-z]+$/,
	email : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
	/* Username Reqs:
		- between 4 & 20 characters long
		- can contain:
			- upper case
			- lower case
			- numbers
			- dash (-) & underscore (_)
	*/
	username : /^[a-zA-Z0-9_\-.]{4,20}$/,
	/* Password Reqs: 
		- 8-33 chars long
		- contains a lower case letter
		- contains an upper case letter
		- contains a special charachter 
	*/
	password : /^(?=.*[0-9])(?=.*[?!@#$%^&*])[a-zA-Z0-9!@#$%^&?*]{8,33}$/,
}

export default function validate(type,str){
    return validRegex[type].test(str);
}


