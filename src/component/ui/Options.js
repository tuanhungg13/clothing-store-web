
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
const Options = (props) => {

    const {
        className = "",
        dropdownClassName = "",
        options = [],
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Đóng menu khi nhấn bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const onClick = (option) => {
        setIsOpen(false);
        option?.onClick?.();
    }

    const itemClassName = "flex gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer";

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={toggleDropdown} className={`cursor-pointer ${className}`}>
                {props?.children}
            </div>
            {isOpen ?
                <div className={`absolute w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 ${dropdownClassName}`}>
                    <div className="p-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options?.map((option, index) =>
                            option?.href ?
                                <Link onClick={() => setIsOpen(false)} href={option?.href} key={`fsjf-${index}`} className={itemClassName} role="menuitem">
                                    {option?.icon}
                                    <p>{option?.label}</p>
                                </Link>
                                :
                                <div onClick={() => onClick(option)} className={itemClassName} key={`fsjf-${index}`} role="menuitem">
                                    {option?.icon}
                                    <p>{option?.label}</p>
                                </div>
                        )}
                    </div>
                </div>
                : null}
        </div>

    )
}

export default Options;
