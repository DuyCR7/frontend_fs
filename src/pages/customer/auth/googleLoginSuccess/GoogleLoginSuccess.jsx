import {useEffect} from "react";
import {signInGoogleSuccess} from "../../../../services/customer/authService";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {loginCustomer, updateCartCount} from "../../../../redux/customer/slices/customerSlice";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {getCount} from "../../../../services/customer/cartService";

const GoogleLoginSuccess = (props) => {

    const navigate = useNavigate();
    const customer = useSelector((state) => state.customer);
    const { userId, tokenLoginGoogle } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchSignInGoogleSuccess();
    }, []);

    const fetchSignInGoogleSuccess = async () => {
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
                let resCartCount = await getCount(id);
                if(resCartCount && resCartCount.EC === 0) {
                    dispatch(updateCartCount(resCartCount.DT));
                } else if (resCartCount && resCartCount.EC === 1){
                    dispatch(updateCartCount(resCartCount.DT));
                }
            } catch (e) {
                console.error(e);
                dispatch(updateCartCount(0));
            }

            localStorage.setItem("cus_jwt", access_token);
            toast.success(res.EM);
            navigate('/');
        } else {
            toast.error(res.EM);
            navigate('/sign-in')
        }
    }

    return (
        <>
        </>
    )
}

export default GoogleLoginSuccess;