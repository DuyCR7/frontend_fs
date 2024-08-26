import { useState, useEffect } from 'react';
import {
    getWishList,
    addToWishList,
    deleteWishListItem
} from '../../../../services/customer/wishListService';
import { useSelector, useDispatch } from 'react-redux';
import {setWishList, updateWishListCount} from '../../../../redux/customer/slices/customerSlice';
import { toast } from 'react-toastify';
import {useNavigate} from "react-router-dom";

export const useWishlist = () => {
    const wishList = useSelector((state) => state.customer.wishList);
    const customer = useSelector((state) => state.customer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchWishlist = async () => {
        if (customer && customer.isAuthenticated) {
            try {
                let res = await getWishList(customer.id);
                if (res && res.EC === 0) {
                    dispatch(setWishList(res.DT));
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    useEffect(() => {
        if (customer.isAuthenticated) {
            fetchWishlist();
        } else {
            dispatch(setWishList([]));
        }
    }, [customer.isAuthenticated, dispatch]);

    const isInWishlist = (productId) => {
        return wishList.some(item => item.productId === productId);
    };

    const handleWishlistAction = async (product) => {
        if (!customer.isAuthenticated) {
            // Xử lý khi người dùng chưa đăng nhập
            navigate('/sign-in');
            return;
        }

        try {
            let res;
            if (isInWishlist(product.id)) {
                res = await deleteWishListItem(customer.id, product.id);
            } else {
                res = await addToWishList(product.id);
            }

            if (res && res.EC === 0) {
                toast.success(res.EM);
                dispatch(updateWishListCount(res.DT));
                await fetchWishlist();
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.error(e);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };

    return { wishList, isInWishlist, handleWishlistAction };
};