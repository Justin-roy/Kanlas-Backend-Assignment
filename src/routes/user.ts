import express from 'express';   
import { adminLogin, createUser, deleteUser, getAllUsers, getOTP, getUser, loginUser, updateUser, verifyOTP } from '../controllers/user.js';
import { addQrCode, checkQrCode, createCoin } from '../controllers/coin.js';

const app = express.Router();

// Route - api/user/create-user
app.post("/create-user",createUser);

// Route - api/user/login
app.post("/login",loginUser);

// Route - api/user/all
app.get("/all",getAllUsers);

// Route - api/user/otp
app.get("/otp",getOTP);

// Route - api/user/verify-otp
app.post("/verify-otp",verifyOTP);

// Route - api/user/id -> id should be admin only 
app.route("/:id").get(getUser).put(updateUser).delete(deleteUser);


// coin , admin and qr route

// Route - api/user/admin
app.post("/admin",adminLogin);

// Route - api/user/create-coin/id -> logged in user id
app.put("/create-coin/:id",createCoin);

// Route - api/user/qr-code/id -> logged in user id
app.post("/qr-code/:id",addQrCode);

// Route - api/user/check-code/id -> logged in user id
app.get("/check-code/:id",checkQrCode);



export default app;