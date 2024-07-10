import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {resetCustomer} from "../../redux/customer/slices/customerSlice";
import {logoutCustomer, testApi} from "../../services/customer/authService";
import {useEffect} from "react";

const HomePage = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);

    const handleLogout = async () => {
        try {
            let data = await logoutCustomer(); // clear cookie
            // logoutContext(); // clear user in context
            if (data && data.EC === 0) {
                localStorage.removeItem("cus_jwt"); // clear local storage
                dispatch(resetCustomer());

                toast.success(data.EM);
                navigate('/sign-in');
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // useEffect(() => {
    //     handleTest();
    // }, []);

    const handleTest = async () => {
        let res = await testApi();
        console.log("Test API response: ", res);
    }

    return (
        <div>
            {customer && customer.isAuthenticated ?
                <>
                <h1>Welcome to the {customer.email}</h1>
                <p>This is the default page for the website.</p>
                    <img src={customer.image} alt={"image"} width={"100px"} height={"100px"}/>
                <button type="button" onClick={() => handleLogout()}>Logout</button>
                    <button type="button" onClick={() => handleTest()}>Test</button>
                </>
                :
            <button type="button" onClick={() => navigate('/sign-in')}>Login</button>
}
</div>
)
    ;
}

export default HomePage;