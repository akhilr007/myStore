import React, {useState, useEffect} from 'react';
import {isAuthenticated} from '../auth/helper';
import {emptyCart, loadCart} from './helper/cartHelper';
import {Link} from 'react-router-dom';
import StripeCheckoutButton from 'react-stripe-checkout';
import {API} from '../backend';
import {createOrder} from './helper/orderHelper';

const StripeCheckout = ({products, setReload = f => f, reload = undefined}) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    });

    const token = isAuthenticated() && isAuthenticated().token;
    const userId = isAuthenticated() && isAuthenticated().user._id;

    const getFinalAmount = () => {
        let amount = 0;
        products.map(p => {
            amount = amount + p.price;
        })
        return amount;
    };

    const makePayment = (token) => {
        const body = {
            token,
            products
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        })
        .then(response => {
            console.log(response);

            // const orderData ={
            //     products : products,
            //     transaction_id: response.id,
            //     amount : response.price
            // };
            // createOrder(userId, token, orderData);
            //console.log(orderData);

            emptyCart(() => {
                console.log("crash");
            });

            setReload(!reload);
            
        })
        .catch(err => console.log(err));
    };

    const showStripeButton = () => {
        return isAuthenticated() ? 
        <StripeCheckoutButton
        stripeKey="pk_test_51K1aUuSDPsnWbyOjGnC5d0sxaigwWtHcGvMm9eTlYg6fS5HcIhk5R1Kv6J18G5bGQDEoaLLpdFQlf2pBJwltSW6P009qanPYv8"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy Tshirts"
        shippingAddress
        billingAddress
        >
            <button className="btn btn-success">Pay with stripe</button>
        </StripeCheckoutButton>
         :
         <Link to="/signin"><button className="btn btn-warning">Sign in</button></Link>
    };

    return(
        <div>
            <h3 className="text-white">Stripe checkout {getFinalAmount()}</h3>
            {showStripeButton()}
        </div>
    )
};

export default StripeCheckout;