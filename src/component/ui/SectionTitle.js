import Link from "next/link";
import React from "react";

const SectionTitle = (props) => {
    const {
        data
    } = props

    return (
        <div className="mb-10">
            {data?.sectionTitle ?
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl md:text-4xl font-semibold">{data?.sectionTitle}</h2>
                    <Link href="/products">
                        <small className="text-gray3 hover:text-primary">Xem thêm</small>
                    </Link>
                </div>
                : null}
            {data?.sectionDescription ?
                <p className="text-xl font-medium leading-relaxed text-textSecondary mt-4 lg:mt-6">{data?.sectionDescription}</p>
                : null}
        </div>
    )

}

export default SectionTitle;