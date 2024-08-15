import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import {getAllForSearch} from "../../../../services/customer/homeService";
import useDebounce from "../../../../utils/useDebounce";

const title = (
    <h2>Tìm kiếm sản phẩm</h2>
)
const desc = "Chúng tôi có bộ sưu tập sản phẩm lớn nhất";

const Search = () => {

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearchInput = useDebounce(searchInput, 500);

    const fetchAllForSearch = async (search) => {
        try {
            let res = await getAllForSearch(search.trim());
            if (res && res.EC === 0) {
                setFilteredProducts(res.DT);
            } else {
                setFilteredProducts([]);
                console.log("Error: ", res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if(debouncedSearchInput) {
            fetchAllForSearch(debouncedSearchInput);
        } else {
            setFilteredProducts([]);
        }
    }, [debouncedSearchInput]);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    }

    console.log(filteredProducts);
    return (
        <div className="banner-section style-4">
            <div className="container-fluid ps-5 pe-5">
                <div className="banner-content">
                    {title}
                    <form>
                        <input type="text" className="fs-5" value={searchInput} placeholder="Tìm kiếm..."
                        onChange={handleSearch}/>
                        <button type="button">
                            <IoIosSearch size={24} />
                        </button>
                    </form>
                    <p>{desc}</p>
                    <ul className="lab-ul">
                        {
                            filteredProducts && filteredProducts.length > 0 && filteredProducts.map((product, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={`/shop/${product.slug}`} className="d-flex align-items-center p-3">
                                            <img src={`${process.env.REACT_APP_URL_BACKEND}/${product.Product_Images[0].image}`}
                                            alt={`${process.env.REACT_APP_URL_BACKEND}/${product.Product_Images[0].image}`}
                                            style={{ width: "30px", height: "30px" }} className="me-3"/>
                                            {product.name}
                                        </Link>
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

export default Search;