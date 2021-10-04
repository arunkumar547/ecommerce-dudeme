const express = require('express')
const router=express.Router();
const catchAsyncErrors=require('../../middlewares/catchAsyncErrors')
const {isAuthenticatedUser} = require('../../middlewares/auth')
const shortid = require('shortid')
const Razorpay = require('razorpay')


const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_SECRET_KEY
})

// payment razorpay payments  =>api/v1/razorpay
router.post('/razorpay',isAuthenticatedUser, catchAsyncErrors(async (req,res)=>{
console.log(req.body)
    const payment_capture = 1
	const amount = req.body.totalPrice
	const currency = 'INR'
console.log(amount)
	const options = {
		amount: amount*100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		// console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
    
}))

// send razorpay key id  =>api/v1/stripeapi
router.get('/stripeapi',isAuthenticatedUser, catchAsyncErrors(async (req,res)=>{

		res.status(200).json({
            keyId:process.env.RAZORPAY_KEY_ID
		})
	
}))

module.exports=router