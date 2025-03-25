"use client"
import { Button, Checkbox, Col, Row, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Categories = (props) => {

    // const {
    //     categories,
    //     loading,
    //     page,
    //     updateCategories = () => { },
    // } = CategoryController(props);

    const columnsCategory = [
        {
            title: '#',
            dataIndex: 'stt',
            key: 'stt',
            align: 'center',
            width: "100px",
        },
        {
            title: "Tên danh mục",
            dataIndex: 'cateName',
            key: 'cateName',
        }
    ]

    return (
        <Row gutter={[12, 12]} className="p-4 bg-background rounded-lg w-full min-h-screen">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} className='!pr-4'>
                <div className="text-xl flex justify-between">
                    Danh mục sản phẩm
                    <Button className='btn-green-color' type='primary'>Thêm danh mục</Button>
                </div>
                <Table
                    // dataSource={productCategories.map((c, index) => ({
                    //     ...c,
                    //     stt: index + 1
                    // }))}
                    columns={columnsCategory}
                    // loading={loading}
                    pagination={false}
                    className="mt-4"
                />
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} className='!ps-4'>
                <div className="text-xl flex justify-between">
                    Bộ sưu tập
                    <Button className='btn-green-color' type='primary'>Thêm bộ sưu tập</Button>
                </div>
                <Table
                    // dataSource={serviceCategories.map((c, index) => ({
                    //     ...c,
                    //     stt: index + 1
                    // }))}
                    columns={columnsCategory}
                    // loading={loading}
                    pagination={false}
                    className="mt-4"
                />
            </Col>
        </Row>

    )
}

export default Categories;
