import express from "express";
import { User, Database, Product, Store, Order, Stats, Admin} from "./database/database.mjs";
import sendSMS from "./twilio/sms.js";
import sendEmail from "./mailjet/sendEmail.js";

const app = express();
app.use(express.json())

// app.get('/', (req, res) => {
//     res.render('index');
// });

app.get('/api/test', (req,res) => {
    res.send({
        status: 200
    });
});

/* AUTH */
app.post("/api/auth/store", async (req,res) => {
    const {storeId} = req.body;
    const result = await Store.isStore(storeId);
    let storeDetails = null;
    if (result){
        storeDetails = await Store.getStoreData(storeId);
    }
    res.send({
        isStore : result,
        storeDetails,
    });
});

app.post("/api/auth/verifyadmin", async (req,res) => {
    const {id,password} = req.body;
    const result = await Admin.verifyAdmin(id,password);
    res.send({
        isAuth : result,
    });
});

/* STATS */
app.post("/api/stats/addview", async (req,res) => {
    const result = await Stats.addView(req.body);
    res.send(result);
});

/* GET */
app.get("/api/get/liststores", async (req,res) => {
    res.send(await Store.listStoreData());
});

app.get("/api/get/listproducts", async (req,res) => {
    res.send(await Product.listProductData());
});

app.get("/api/get/views", async (req,res) => {
    const result = await Stats.getViews();
    res.json(result);
});

app.get("/api/get/orders", async (req,res) => {
    const result = await Order.getOrders();
    res.send(result);
})

/* CREATE */
app.post("/api/create/store", async (req,res) => {
    const result = await Store.createStore(req.body);
    res.send(result);
});

app.post("/api/create/product", async (req,res) => {
    const result = await Product.createProduct(req.body);
    res.send(result);
});

app.post("/api/create/order", async (req,res) => {
    const orderReq = req.body;
    const result = await Order.createOrder(orderReq);
    res.send(result);
});

/* REMOVE */
app.post("/api/remove/store", async (req,res) => {
    const {idArray} = req.body;
    const result = await Store.removeStore(idArray);
    res.send(result);
});

app.post("/api/remove/product", async (req,res) => {
    const {idArray} = req.body;
    const result = await Product.removeProduct(idArray);
    res.send(result);
});

/* SNS */
app.post("/api/sns/sendsms", async (req,res) => {
    const {body,number} = req.body;
    sendSMS(body,number);
    res.send({
        body,number
    });
});

app.post("/api/sns/sendemail", async (req,res) => {
    sendEmail(req.body);
});



// app.post("/api/signup", async (req,res) => {
//     const result = await User.addUser(req.body);
//     res.send(result);
// });
  
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
