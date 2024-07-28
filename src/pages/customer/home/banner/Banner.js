import React, {useState} from 'react';
import productData from "../../../../products.json";
import {Link} from "react-router-dom";
import SelectedCategory from "../../components/selectedCategory/SelectedCategory.js";

const title = (
    <h2>Tìm kiếm sản phẩm</h2>
)
const desc = "Chúng tôi có bộ sưu tập sản phẩm lớn nhất";

const Banner = () => {

    const [searchInput, setSearchInput] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(productData);

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setSearchInput(searchTerm);

        // filter products based on search
        const filtered = productData.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }

    return (
        <div className="banner-section style-4">
            <div className="container-fluid ps-5 pe-5">
                <div className="banner-content">
                    {title}
                    <form>
                        <SelectedCategory select={"all"}/>
                        <input type="text" name="search" value={searchInput} id="search" placeholder="Tìm kiếm..."
                        onChange={handleSearch}/>
                        <button type="submit">
                            <i className="icofont-search"></i>
                        </button>
                    </form>
                    <p>{desc}</p>
                    <ul className="lab-ul">
                        {
                            searchInput && filteredProducts.map((product, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={`/shop/${product.id}`}>{product.name}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Banner;