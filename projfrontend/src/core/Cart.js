import React, {useState, useEffect} from 'react';
import '../styles.css';
import {API} from '../backend';
import Base from './Base';
import Card from './Card';
import StripeCheckout from './StripeCheckout';
import {loadCart} from './helper/cartHelper';

const Cart = () => {

    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setProducts(loadCart())
    }, [reload]);

    const loadAllProducts = () => {
        return (
            <div>
                <h2>Products</h2>
                {products.map((product, index) => {
                   return ( <Card 
                     key={index}
                     product={product}  
                     removeFromCart = {true}
                     addtoCart={false}
                     setReload={setReload} 
                     reload={reload}
                    />
                   )
                })}
            </div>
        )
    };

    const loadCheckout = () => {
        return (
            <div>
                <h2>This section is for checkout</h2>
            </div>
        )
    };

    return (
        <Base title="Cart Page" description="Ready to checkout">
            <div className="row text-center">
                <div className="col-sm-6 mb-2">{loadAllProducts()}</div>
                <div className="col-sm-6">
                    <StripeCheckout
                    products={products}
                    setReload={setReload} 
                    />
                </div>
            </div>
        </Base>
    );
};

export default Cart;