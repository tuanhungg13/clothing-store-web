
import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";

const RatingStar = (props) => {

    const {
        star = 5,
        style = {},
        color = "#E2B93B",
        className = ""
    } = props;

    const res = [];
    for (let i = 1; i <= star; i++) {
        res.push(<FaStar color={color} />)
        if (i >= 5) break;
    }

    const decimalPart = star % 1;
    if (decimalPart && decimalPart >= 0.5) {
        res.push(<FaRegStarHalfStroke color={color} />)
    }

    for (let i = res?.length; i < 5; i++) {
        res.push(<FaRegStar color={color} />)
    }

    return (
        <div className={`flex gap-1 ${className}`} style={style}>
            {res}
        </div>
    )
}

export default RatingStar;
