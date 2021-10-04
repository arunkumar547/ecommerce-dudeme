import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'

import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { createOrder, clearErrors } from '../../actions/orderActions'

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

const __DEV__ = document.domain === 'localhost'

const ConfirmOrder = ({ history }) => {

    // const [keyId,setKeyId] =useState('')
    const [name, setName] = useState('')

    const dispatch = useDispatch();

    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.auth)
    const { error } = useSelector(state => state.newOrder)

    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 25
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data))

        console.log(user)
        async function getKeyId() {
            await axios.get('/api/payment/stripeapi')
            // setKeyId(data.keyId)
            // console.log(data.keyId)
        }

        getKeyId()
        displayRazorpay()
        async function displayRazorpay() {
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?')
                return
            }

            // const data = await fetch('/api/payment/razorpay',{ method: 'POST' }).then((t) =>
            //     t.json()
            // )

            const config = {
                headers: {
                    'content-type': 'application/json'
                }
            }

            const { data } = await axios.post('/api/payment/razorpay', { totalPrice }, config)

            const options = {
                key: __DEV__ ? 'rzp_test_qDotvwo5V0dUew' : 'PRODUCTION_KEY',
                currency: data.currency,
                amount: data.amount.toString(),
                order_id: data.id,
                name: 'Pay Now',
                description: 'Enjoy Online Shopping',
                image: '/images/logo.png',
                handler: function (response) {
                    // alert(response.razorpay_payment_id)
                    // alert(response.razorpay_order_id)
                    // alert(response.razorpay_signature)

                    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
                    if (orderInfo) {
                        order.itemsPrice = orderInfo.itemsPrice
                        order.shippingPrice = orderInfo.shippingPrice
                        order.taxPrice = orderInfo.taxPrice
                        order.totalPrice = orderInfo.totalPrice
                    }

                    order.paymentInfo = {
                        id: options.order_id,
                        status: "captured"
                    }
                    dispatch(createOrder(order))
                    history.push("/success")
                },
                prefill: {
                    name,
                    email: user.email,
                    contact: ""
                }
            }
            const paymentObject = new window.Razorpay(options)
            paymentObject.open()
        }

    }

    useEffect(() => {

        // async function getKeyId(){
        //   const {data} = await axios.get('/api/payment/stripeapi')
        //   setKeyId(data.keyId)
        //   console.log(data.keyId)
        // }

        // getKeyId()

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

    }, [dispatch, error])

    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    return (
        <Fragment>

            <MetaData title={'Confirm Order'} />

            <CheckoutSteps shipping confirmOrder />

            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">

                    <h4 className="mb-3">Shipping Info</h4>
                    <p><b>Name:</b> {user && user.name}</p>
                    <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>

                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>

                    {cartItems.map(item => (
                        <Fragment>
                            <hr />
                            <div className="cart-item my-1" key={item.product}>
                                <div className="row">
                                    <div className="col-4 col-lg-2">
                                        <img src={item.image} alt="Laptop" height="45" width="65" />
                                    </div>

                                    <div className="col-5 col-lg-6">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>


                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p>{item.quantity} x ${item.price} = <b>${(item.quantity * item.price).toFixed(2)}</b></p>
                                    </div>

                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}



                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">${itemsPrice}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                        <hr />
                        <button id="checkout_btn" className="btn btn-primary btn-block" onClick={processToPayment}>Proceed to Payment</button>
                    </div>
                </div>


            </div>

        </Fragment>
    )
}

export default ConfirmOrder