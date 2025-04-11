'use client'

import React from "react";
import { Upload, Image } from "antd";
import { LuPlus } from "react-icons/lu";
import { getBase64 } from "@/utils/helper/appCommon";
import { noImg } from "@/assets";
const UploadCustom = (props) => {
    const {
        fileList = [],
        fileListUpdate = [],
        setFileList = () => { },
        setFileListUpdate = () => { },
        isAddMulti = true
    } = props

    const propsUpload = {
        name: "files",
        showUploadList: false,
        multiple: true,
        maxCount: 20,
        fileList: fileList,
        accept: "image/*",
        beforeUpload: async (file) => {
            const fileType = file.type;
            const isJpgOrPng = fileType.includes("image");
            console.log(file)
            if (!isJpgOrPng) {
                message.error(texts?.ASSERT_IMAGE || "Không đúng định dạng ảnh");
                return false;
            }

            const isLt20M = file.size / 1024 / 1024 < 0.8;
            if (!isLt20M) {
                message.error(texts?.UPLOAD_IMAGE_800KB || "Kích thước ảnh quá lớn");
                return false
            }
            if (!file.url && !file.imgData) {
                file.imgData = await getBase64(file);
            }
            if (isJpgOrPng && isLt20M) {
                setFileListUpdate([])
                if (isAddMulti) {
                    setFileList((prev) => [...prev, file])
                }
                else {
                    setFileList([file])
                }
            }

            return false;
        },
    };
    return (
        <div className="flex gap-4 items-start">
            {[...fileList, ...fileListUpdate]?.map((item, index) => (
                <div className="upload-list-item relative" key={index}>
                    <div className="ant-upload-list-item-info">
                        <span className="ant-upload-span rounded-lg">
                            <Image src={item?.imgData || noImg?.src} alt={item?.name} width={100} height={100}
                                className="ant-upload-list-item-image object-contain rounded-lg" />
                        </span>
                    </div>
                </div>
            ))}
            <Upload
                listType="picture-card"
                {...propsUpload}

            >
                <div className="flex flex-col justify-center items-center">
                    <LuPlus />
                    <div>Thêm ảnh</div>
                </div>
            </Upload>
        </div>
    )
}

export default UploadCustom