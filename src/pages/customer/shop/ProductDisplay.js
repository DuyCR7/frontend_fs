import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {CardSubtitle} from "react-bootstrap";
import "./productDisplay.scss";

const desc = "Energistia an deliver atactica metrcs after avsiionary Apropria trnsition enterpris an sources applications emerging psd template."

const ProductDisplay = ({item, setActiveImage}) => {

    const {name, id, price, seller, ratingsCount, quantity, img} = item;

    const [preQuantity, setQuantity] = useState(quantity + 1);
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");

    const sizes = ["S", "M", "L", "XL", "XXL"];
    const colors = [
        {
            name: "Đen",
            image: "https://fastly.picsum.photos/id/7/4728/3168.jpg?hmac=c5B5tfYFM9blHHMhuu4UKmhnbZoJqrzNOP9xjkV4w3o"
        },
        {
            name: "Xanh lam",
            image: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU"
        },
        {
            name: "Cam",
            image: "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4"
        },
    ];

    const handleSizeChange = (size) => {
        setSize(size);
    }

    const handleColorChange = (color) => {
        setColor(color);
    }

    const handleDecrease = () => {
        if(preQuantity > 1){
            setQuantity(preQuantity - 1);
        }
    }

    const handleIncrease = () => {
        setQuantity(preQuantity + 1);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const product = {
            id: id,
            img: img,
            name: name,
            price: price,
            quantity: preQuantity,
            size: size,
            color: color,
        }

        // console.log(product);
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProductIndex = existingCart.findIndex((item) => item.id === id);

        if(existingProductIndex !== -1){
            existingCart[existingProductIndex].quantity += preQuantity;
        } else {
            existingCart.push(product);
        }

        // update localStorage
        localStorage.setItem("cart", JSON.stringify(existingCart));

        // reset form page
        setQuantity(1);
        setSize("");
        setColor("")
    }

    return (
        <div>
            <div>
                <h4>{name}</h4>
                <p className="rating">
                    <i className="icofont-star"></i>
                    <i className="icofont-star"></i>
                    <i className="icofont-star"></i>
                    <i className="icofont-star"></i>
                    <i className="icofont-star"></i>
                    <span> {ratingsCount} đánh giá</span>
                </p>
                <h4>${price}</h4>
                <h6>{seller}</h6>
                <p>{desc}</p>
            </div>
            
            {/*cart components*/}
            <div className="product-display">
                <form onSubmit={handleSubmit}>
                    {/*size*/}
                    <div className="col-12">
                        <CardSubtitle className="mb-2">Sizes:</CardSubtitle>
                        <div className="sizes">
                            {
                                sizes.map((sizeOption) => (
                                    <span key={sizeOption}
                                            className={`${size === sizeOption ? "active" : ""}`}
                                            onClick={() => handleSizeChange(sizeOption)}>
                                        {sizeOption}
                                    </span>
                                ))
                            }
                        </div>
                    </div>

                    {/*color*/}
                    <div className="col-12">
                        <CardSubtitle className="mb-2">Colors:</CardSubtitle>
                        <div className="colors">
                            {
                                colors.map((colorOption) => (
                                    <div key={colorOption.name}
                                            className={`color-option d-flex align-items-center ${color === colorOption.name? "active" : ""}`}
                                            onClick={() => {
                                                handleColorChange(colorOption.name);
                                                setActiveImage(colorOption.image);
                                            }}>
                                        <img src={colorOption.image}/>
                                        <p>{colorOption.name}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/*cart plus minus*/}
                    <div className="cart-plus-minus ms-0 col-12">
                        <div className="dec qtybutton" onClick={handleDecrease}>-</div>
                        <input className="cart-plus-minus-box" type="text" name="qtybutton" id="qtybutton"
                               value={preQuantity}
                               onChange={(e) => setQuantity(parseInt(e.target.value, 10))}/>
                        <div className="inc qtybutton" onClick={handleIncrease}>+</div>
                    </div>

                    {/*button section*/}
                    <div className="col-12 mt-3">
                        <button type="submit" className="btn-add-cart btn btn-primary me-2">
                            <span>Thêm vào giỏ</span>
                        </button>
                        <Link to="/cart-page" className="btn btn-success">
                            <span style={{color: "white"}}>Mua ngay</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductDisplay;