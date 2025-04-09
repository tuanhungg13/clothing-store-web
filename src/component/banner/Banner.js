import React from "react";

export default function Banner({ img }) {
    return (
        <img
            src={img || "https://marketplace.canva.com/EAFoEJMTGiI/1/0/1600w/canva-beige-aesthetic-new-arrival-fashion-banner-landscape-cNjAcBMeF9s.jpg"}
            className="w-full h-[50vh] object-cover"
        />
    )
}