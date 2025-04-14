"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { about } from "@/assets";
export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
            <div className="max-w-5xl mx-auto space-y-12">
                <motion.h1
                    className="text-4xl font-bold text-center text-gray-900"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Giới thiệu về cửa hàng
                </motion.h1>

                <motion.div
                    className="flex flex-col md:flex-row gap-10 items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Image
                        src={about.src}
                        alt="Clothing store"
                        width={500}
                        height={350}
                        className="rounded-2xl shadow-lg object-cover"
                    />
                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Thời trang là phong cách sống</h2>
                        <p>
                            Chúng tôi là một cửa hàng thời trang trực tuyến chuyên cung cấp các sản phẩm quần áo chất lượng cao, phong cách hiện đại và giá cả hợp lý.
                        </p>
                        <p>
                            Với sứ mệnh đem lại trải nghiệm mua sắm tốt nhất cho khách hàng, chúng tôi liên tục cập nhật xu hướng mới và nâng cao chất lượng dịch vụ.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="bg-gray-100 rounded-xl p-6 text-center shadow-md">
                        <h3 className="text-xl font-bold text-gray-700">Sản phẩm chất lượng</h3>
                        <p className="mt-2 text-sm text-gray-600">Chúng tôi lựa chọn kỹ càng từng mẫu vải và thiết kế để đảm bảo sự hài lòng của bạn.</p>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 text-center shadow-md">
                        <h3 className="text-xl font-bold text-gray-700">Dịch vụ tận tâm</h3>
                        <p className="mt-2 text-sm text-gray-600">Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7.</p>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 text-center shadow-md">
                        <h3 className="text-xl font-bold text-gray-700">Giao hàng nhanh chóng</h3>
                        <p className="mt-2 text-sm text-gray-600">Chúng tôi hợp tác với các đơn vị vận chuyển uy tín để giao hàng nhanh nhất đến bạn.</p>
                    </div>
                </motion.div>

                <div className="text-center mt-10">
                    <p className="text-gray-700">
                        Cảm ơn bạn đã tin tưởng và đồng hành cùng chúng tôi trên hành trình thời trang đầy cảm hứng!
                    </p>
                </div>
            </div>
        </div>
    );
}
