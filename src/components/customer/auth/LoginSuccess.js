import {useEffect} from "react";
import {signInGoogleSuccess} from "../../../services/customer/authService";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {loginCustomer} from "../../../redux/customer/slices/customerSlice";
import {useDispatch, useSelector} from "react-redux";

const LoginSuccess = (props) => {

    const navigate = useNavigate();
    const customer = useSelector((state) => state.customer);
    const { userId, tokenLoginGoogle } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchSignInGoogleSuccess();
    }, []);

    const fetchSignInGoogleSuccess = async () => {
        let res = await  signInGoogleSuccess(userId, tokenLoginGoogle);
        if (res && res.EC === 0) {
            let email = res.DT.email;
            // let username = res.DT.username;
            let access_token = res.DT.access_token;
            let image = res.DT.image;
            let typeLogin = res.DT.typeLogin;

            let data = {
                isAuthenticated: true,
                access_token,
                // groupWithRoles,
                email,
                // username,
                image,
                typeLogin
            }

            dispatch(loginCustomer(data));

            localStorage.setItem("cus_jwt", access_token);
            navigate('/');
        } else {
            navigate('/sign-in')
        }
    }

    return (
        <>
        </>
    )
}

export default LoginSuccess;