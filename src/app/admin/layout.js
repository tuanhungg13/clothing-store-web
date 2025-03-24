import React from "react";
import LeftMenu from "./LeftMenu";
const AdminLayout = ({ children }) => {
    return (
        <div className="flex bg-bgSecondary gap-6 pt-6 pr-4">
            <LeftMenu />
            {children}
        </div>
    )
}

export default AdminLayout