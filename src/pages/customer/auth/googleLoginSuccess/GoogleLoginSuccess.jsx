import {useEffect, useState} from "react";
import {signInGoogleSuccess} from "../../../../services/customer/authService";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {loginCustomer, updateCartCount, updateWishListCount} from "../../../../redux/customer/slices/customerSlice";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {getCartCount, getCount} from "../../../../services/customer/cartService";
import {getWishListCount} from "../../../../services/customer/wishListService";
import {Spin} from "antd";

const GoogleLoginSuccess = (props) => {

    const navigate = useNavigate();
    const customer = useSelector((state) => state.customer);
    const { userId, tokenLoginGoogle } = useParams();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSignInGoogleSuccess();
    }, []);

    const fetchSignInGoogleSuccess = async () => {
        try {
            let res = await signInGoogleSuccess(userId, tokenLoginGoogle);
            if (res && res.EC === 0) {
                let id = res.DT.id;
                let email = res.DT.email;
                // let username = res.DT.username;
                let access_token = res.DT.access_token;
                let typeLogin = res.DT.typeLogin;
                let image = "";
                if (res.DT.image.includes("https")) {
                    image = res.DT.image;
                } else {
                    image = `${process.env.REACT_APP_URL_BACKEND}/${res.DT.image}`;
                }

                let data = {
                    isAuthenticated: true,
                    access_token,
                    id,
                    email,
                    image,
                    typeLogin
                }

                dispatch(loginCustomer(data));

                try {
                    const [resCartCount, resWishListCount] = await Promise.all([
                        getCartCount(),
                        getWishListCount()
                    ])

                    if(resCartCount && resCartCount.EC === 0) {
                        dispatch(updateCartCount(resCartCount.DT));
                    } else if (resCartCount && resCartCount.EC === 1){
                        dispatch(updateCartCount(resCartCount.DT));
                    }

                    if(resWishListCount && resWishListCount.EC === 0) {
                        dispatch(updateWishListCount(resWishListCount.DT));
                    }

                } catch (e) {
                    console.error(e);
                    dispatch(updateCartCount(0));
                    dispatch(updateWishListCount(0));
                }

                localStorage.setItem("cus_jwt", access_token);
                toast.success(res.EM);
                navigate('/');
            } else {
                navigate('/sign-in')
            }
        } catch (e) {
            navigate('/sign-in')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {
                isLoading ? (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
                        style={{zIndex: 9999}}>
                        <Spin size="large"/>
                    </div>
                ) : null
            }
        </>
    )
}

export default GoogleLoginSuccess;