import React from 'react';
import { Navigate } from "react-router-dom";
import {useSelector} from "react-redux";

const PrivateRoute = (props) => {

    const user = useSelector((state) => state.user);

    if (!user.isAuthenticated) {
        return <Navigate to="/admin/sign-in" />;
    }

    return (
        <>
            {props.children}
        </>
    );
};

export default PrivateRoute;