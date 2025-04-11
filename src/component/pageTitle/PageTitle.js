
import React from "react";

const PageTitle = (props) => {
    const {
        data = "",
        img = "https://intphcm.com/data/upload/banner-thoi-trang-nam-dep.jpg"
    } = props;

    const sectionData = data?.data;
    //    console.log("PageTitle1 sectionData", sectionData);
    //    console.log("PageTitle1 route", route);


    return (
        <div
            className="relative w-full bg-cover bg-center bg-no-repeat "
            style={{ backgroundImage: `url(${img})` }}
        >
            <div className="absolute top-0 w-full h-full bg-black/60 z-0"></div>
            <div className="relative w-full p-20 z-10 flex flex-col gap-6 items-center justify-center">
                <h2
                    className={`text-3xl font-merienda md:text-5xl text-white leading-[1.6] md:leading-[1.6] text-center font-headingFont`}>
                    {data?.sectionTitle}
                </h2>
                {data?.sectionDescription ?
                    <div className="text-lg md:text-2xl text-white text-center">
                        {data?.sectionDescription}
                    </div>
                    : null}
            </div>
        </div>
    )
}

export default PageTitle;
