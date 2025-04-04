"use client"
import { useEffect, useState } from "react"
type ProductType = {
    [key: string]: string | number | undefined
    productId: string
    productImg: string
    productName: string
    productPrice: number
    productCategory: string
    unitCount?: number
}
type OrderType = {
    orderDate: string
    productId: string
    productImg: string
    productName: string
    orderId: string
    unitCount: number
    status: string
}
export default function Page() {
    const [order, setorder] = useState<OrderType[]>([])
    const [status, setstatus] = useState<string[]>(["To Do", "In Progress", "Completed"])
    const [filterCategory, setfilterCategory] = useState<string>("All")
    const category = ["a", "b", "c"]
    useEffect(() => {
        const productArr: OrderType[] = []
        for (var i = 0; i < 10; i++) {
            productArr.push({
                orderDate:"2024-07-24T09:55:32Z",
                productId: `${i}`,
                productName: `Product ${i}`,
                productImg: 'images/product.webp',
                orderId: "OD-0001",
                unitCount: 5,
                status: "To Do"
            })
        }
        console.log(productArr)
        setorder(productArr)
    }, [])
    return (
        <div>
            <div className="h-[72px] bg-red-200">
                <button>All</button>
                <button>In Progress</button>
                <button>Completed</button>
            </div>
            <li onClick={() => { setfilterCategory("All") }} className={`flex justify-center items-center w-[100px] mr-[10px] px-[4px] border-t border-r border-l rounded-t ${filterCategory === "All" ? "bg-blue-400" : "bg-gray-100"}`}>All</li>
            {status.map((status, index) => (
                <li key={index} onClick={() => { setfilterCategory(status) }} className={`flex justify-center items-center w-[100px] mr-[10px] px-[4px] border-t border-r border-l rounded-t ${filterCategory === status ? "bg-blue-400" : "bg-gray-100"}`}>{status}</li>
            ))}
            <div className=" bg-[#f0f0f0]">
                <div className="flex bg-white h-[55px] mb-[4px]">
                    <div className="w-[45%] flex items-center"><span className="w-[100%] text-center">สินค้า</span></div>
                    <div className="w-[15%] flex items-center"><span className="w-[100%] text-center">เลขคำสั่งซื้อ</span></div>
                    <div className="w-[10%] flex items-center"><span className="w-[100%] text-center">จำนวน</span></div>
                    <div className="w-[15%] flex items-center"><span className="w-[100%] text-center">สถานะ</span></div>
                    <div className="w-[15%] flex items-center"><span className="w-[100%] text-center">วันและเวลา</span></div>
                </div>
                {
                    order.map((ord) => (
                        <div className="flex bg-white border-b  mb-[4px]">
                            <div className="w-[45%] flex items-center">
                                <img className="w-[200px] h-[200px]" src={ord.productImg} />
                                <span className="pl-[16px] pr-[8px] w-[100%]">{ord.productName}</span>
                            </div>
                            <div className="w-[15%] flex items-center"><span className="w-[100%] text-center">{ord.orderId}</span></div>
                            <div className="w-[10%] flex items-center"><span className="w-[100%] text-center">{ord.unitCount}</span></div>
                            <div className="w-[15%] flex items-center"><span className="w-[100%] text-center">{ord.status}</span></div>
                            <div className="w-[15%] flex items-center"><span className="w-[100%] text-center">{ord.orderDate}</span></div>
                            {/* <div className="w-[10%] flex items-center">
                                                <span className="w-[100%] text-center">
                                                    <button className="hover:bg-gray-100 rounded" onClick={() => { removeFromCart(ord.productId) }}>
                                                        <svg className="h-[28px] w-[28px] text-gray-400 hover:text-black" width="24" height="24" viewBox="0 0 24 24"
                                                            strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" />
                                                            <line x1="4" y1="7" x2="20" y2="7" />
                                                            <line x1="10" y1="11" x2="10" y2="17" />
                                                            <line x1="14" y1="11" x2="14" y2="17" />
                                                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </div> */}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}