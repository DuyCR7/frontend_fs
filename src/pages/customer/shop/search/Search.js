import React, {useState} from 'react';
import {Link} from "react-router-dom";

const Search = ({products, GridList}) => {

    const [searchTerm, setSearchTerm] = useState("");
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="widget widget-search">
            <form className="search-wrapper mb-3">
                <input type="text" name="search" id="search" placeholder="Tìm kiếm..." defaultValue={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}/>
                <button type="submit">
                    <i className="icofont-search-2"></i>
                </button>
            </form>

            {/*showing search results*/}
            <div>
                {
                    searchTerm && filteredProducts.map((item) => {
                        return (
                            <Link key={item.id} to={`/shop/${item.id}`}>
                                <div className="d-flex gap-3 p-2">
                                    <div>
                                        <div className="pro-thumb h-25">
                                            <img src={item.img} alt="" width={70} className="flex-{grow|shrink}-0"/>
                                        </div>
                                    </div>
                                    <div className="product-content">
                                        <p>
                                            <Link to={`/shop/${item.id}`}>{item.name}</Link>
                                        </p>
                                        <h6>${item.price}</h6>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Search;