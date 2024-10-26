import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../../services/admin/authService";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import { Spin } from 'antd';
import {resetUser} from "../../../redux/admin/slices/userSlice";
import {useState} from "react";
import {CgLogOut, CgProfile} from "react-icons/cg";
import {useSocket} from "../../../context/SocketContext";

const AdNavbarHeader = (props) => {

    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { disconnectSocket } = useSocket();

    const handleLogout = async () => {
        setLoading(true);
        try {
            let data = await logoutUser(); // clear cookie
            if (data && data.EC === 0) {
                disconnectSocket();
                localStorage.removeItem("jwt"); // clear local storage
                dispatch(resetUser());

                toast.success(data.EM);
                navigate('/admin/sign-in');
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/*Navbar Header*/}
            <nav
                className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom"
            >
                <div className="container-fluid">
                    <nav
                        className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex"
                    >
                        <div>
                            <h3>Quản Trị</h3>
                        </div>
                    </nav>

                    <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
                        <li className="nav-item topbar-user dropdown hidden-caret">

                            <div
                                className="dropdown-toggle profile-pic"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{cursor: "pointer"}}
                            >
                                <div className="avatar-sm">
                                    <img
                                        src={user?.image ? user?.image : ""}
                                        alt="avatar"
                                        className="avatar-img rounded-circle"
                                    />
                                </div>
                                <span className="profile-username">
                                  <span className="op-7">Xin chào, </span>
                                  <span className="fw-bold">{user?.username ? user?.username : "User"}</span>
                                </span>
                            </div>
                            <ul className="dropdown-menu dropdown-user animated fadeIn">
                                <div className="dropdown-user-scroll scrollbar-outer">
                                    <li>
                                        <div className="user-box">
                                            <div className="avatar-lg">
                                                <img
                                                    src={user?.image ? user?.image : ""}
                                                    alt="image profile"
                                                    className="avatar-img rounded"
                                                />
                                            </div>
                                            <div className="u-text">
                                                <h4>{user?.username ? user?.username : "User"}</h4>
                                                <p className="text-muted">{user?.email ? user?.email : "Email"}</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dropdown-divider"></div>
                                        <Link
                                            to={`/admin/profiles`}
                                            className="dropdown-item"
                                        ><CgProfile size={20}/> Thông tin</Link>
                                        <div className="dropdown-divider"></div>
                                        <Spin spinning={loading}>
                                            <button
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() => handleLogout()}
                                                disabled={loading}
                                            ><CgLogOut size={20}/> Đăng xuất
                                            </button>
                                        </Spin>
                                    </li>
                                </div>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            {/*End Navbar*/}
        </>
    )
}

export default AdNavbarHeader;