import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CardProduct = ({ product }) => {
    const { _id } = product;
    const navigate = useNavigate();

    const handleToDetail = id => {
        navigate(`products/${id}`)
    }
    //////
    return (
        <div>
            <div className="card card-compact  bg-base-100 ">
                <figure><img style={{ 'width': '150px' }} src={product?.picture}

                    alt="products" /></figure>
                <div className="card-body text-left">
                    <h2 className="card-title">{product.name}</h2>
                    <p>{product.description}</p>
                    <p>price:  {product.price} </p>
                    <p> Minimum Quantity: {product.quantity} </p>
                    <p>Available: {product.avl} </p>
                    <button onClick={() => handleToDetail(_id)} className="btn btn-primary">Purchase</button>

                </div>
            </div>
        </div>
    );
};

export default CardProduct;