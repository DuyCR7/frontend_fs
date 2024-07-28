import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {verifyEmail} from "../../../../services/customer/authService";
import {toast} from "react-toastify";
import {Spin} from "antd";

const EmailVerify = (props) => {

    const params = useParams();
    const [validUrl, setValidUrl] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        handleVerifyEmail();
    }, [params]);

    const handleVerifyEmail = async () => {
        setLoading(true);
        try {
            let res = await verifyEmail(params.id, params.token);
            if (res && res.EC === 0){
                setValidUrl(true);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.log(e);
            setValidUrl(false);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spin spinning={loading}/>
            </div>
        )
    }

    return (
        <>
            {
                validUrl ?
                    <div className="container">
                    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                            <img src="/admin/assets/img/kaiadmin/icons8-success.svg" alt="success" className="mb-3"/>
                            <h1 className="text-center mb-3">Email đã được xác nhận thành công!</h1>
                            <Link to="/sign-in">
                                <button className="btn btn-primary">Đăng nhập</button>
                            </Link>
                        </div>
                    </div>
                    :
                    <h1 className="container mt-3 text-center">404 Not Found</h1>
            }
        </>
    )
}

export default EmailVerify;