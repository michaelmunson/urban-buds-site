import express from "express";
import { User, Database } from "./database/database.mjs";

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index');
});

app.post("/api/signup", async (req,res) => {
    const result = await User.addUser(req.body);
    res.send(result);
});
  
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  	console.log(`Server listening on port ${PORT}...`);
});





// app.post("/signup", async (req,res)=>{
//   	// console.log("Signup Post Request Recieved");
// 	const response = await handleSignup(req.body);
// 	res.json(response);
// });

// app.post("/login", async (req,res) => {
// 	// console.log("Login Request Recieved...");
// 	const response = await handleLogin(req.body);
// 	res.json(response);
// });

// app.post("/convos", async (req,res) => {
// 	const response = await user.getConvos(req.body.user);
// 	res.json(response);
// });

// Listen to the App Engine-specified port, or 9000 otherwise
