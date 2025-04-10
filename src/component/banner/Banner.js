import React from "react";
import { banner } from "@/assets";
export default function Banner({ img }) {
    return (
        <img
            src={img || banner?.src}
            className="w-full h-[50vh] object-cover"
        />
    )
}