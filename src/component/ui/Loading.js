import { Spin } from "antd";
import React from "react";
const Loading = () => {
    return (
        <div className="h-40 flex justify-center items-center">
            <Spin spinning={true} />
        </div>
    )
}

export default Loading