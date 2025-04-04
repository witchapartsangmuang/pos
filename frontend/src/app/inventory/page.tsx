"use client"
import ControlPanel from "@/components/ControlPanel"
import Modal from "@/components/Modal"
import { useEffect, useState } from "react"

export default function Page() {
    const [inventory, setinventory] = useState([])
    useEffect(() => {
        const inv = []
        for (let i = 0; i < 100; i++) {
            inv.push({
                product_no: `${i}`,
                product_name: `product - ${i}`,
                barcode: `${i}${i}${i}${i}${i}${i}`,
                quantity: 0,
                min_stock: 2,
                max_stock: 5
            })
        }
        setinventory(inv)
    }, [])
    return (
        <>
            <div className="h-[calc(100vh-52px)] overflow-y-auto">
                <div className="flex w-[100%] h-[100%]">
                    <div className="w-[100%]">
                        <ControlPanel>
                            <button>Inventory Adjustment</button>
                        </ControlPanel>
                        <div className="relative overflow-x-auto w-[100%]">
                            <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th>Product No.</th>
                                        <th>Product Name</th>
                                        <th>Barcode</th>
                                        <th>Quantity</th>
                                        <th>Min Stock</th>
                                        <th>Max Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        inventory.map((inv, index) => (
                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                                <td>{inv.product_no}</td>
                                                <td>{inv.product_name}</td>
                                                <td>{inv.barcode}</td>
                                                <td>{inv.quantity}</td>
                                                <td>{inv.min_stock}</td>
                                                <td>{inv.max_stock}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
            <Modal>
                <div className="bg-white w-[500px] h-[500px] mt-[200px] mx-[auto] rounded">
                    <div className="w-full h-[42px] py-[8px] px-[16px] border-b text-end">
                        <button>X</button>
                    </div>
                    <div className="w-[100%] h-[calc(100%-84px)] px-[16px]">
                        <div className="w-[100%] mb-[6px] p-[6px]">
                            <label className="mb-[8px]">รหัสสินค้า</label>
                            <input className="border rounded w-[100%] h-[36px] pl-[12px]" type="text" value="" onChange={(e) => { }} />
                        </div>
                        <div className="w-[100%] mb-[6px] p-[6px]">
                            <label className="mb-[8px]">ชื่อสินค้า</label>
                            <input className="border rounded w-[100%] h-[36px] pl-[12px]" type="text" value="" onChange={(e) => { }} />
                        </div>
                        <div className="w-[100%] mb-[6px] p-[6px]">
                            <label className="mb-[8px]">Quantity</label>
                            <input className="border rounded w-[100%] h-[36px] pl-[12px]" type="text" value="" onChange={(e) => { }} />
                        </div>
                        <div className="w-[100%] mb-[6px] p-[6px]">
                            <label className="mb-[8px]">Min Stock</label>
                            <input className="border rounded w-[100%] h-[36px] pl-[12px]" type="text" value="" onChange={(e) => { }} />
                        </div>
                        <div className="w-[100%] mb-[6px] p-[6px]">
                            <label className="mb-[8px]">Max Stock</label>
                            <input className="border rounded w-[100%] h-[36px] pl-[12px]" type="text" value="" onChange={(e) => { }} />
                        </div>
                    </div>
                    <div className="w-full h-[42px] py-[8px] px-[16px] border-t text-end">
                        <button>Save</button>
                    </div>
                </div>
            </Modal>
        </>

    )
}