import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const NotFoundProduct = (props) => {

    return (
        <div className="h-60 flex flex-col justify-center items-center text-xl text-gray4">
            <FaBoxOpen size={80} />
            <div>Không có sản phẩm</div>
        </div>
    )
}

export default NotFoundProduct;