"use client"
import { ChangeEvent, useEffect, useState } from "react"
import { SalesOrderType } from "@/type"
import axios from "axios"

export default function Page() {
    const [salesOrderList, setsalesOrderList] = useState<SalesOrderType[]>([])
    const [salesAmount, setsalesAmount] = useState<number>(0)
    const [filter, setfilter] = useState({
        startDate: dateFormat(new Date),
        endDate: dateFormat(new Date)
    })
    const [loading, setloading] = useState<boolean>(true)
    const [errorMessage, seterrorMessage] = useState<string>("")

    function dateFormat(date: Date) {
        const year: number = date.getFullYear()
        const month: string = String(date.getMonth() + 1).padStart(2, '0')
        const day: string = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    async function getAllData() {
        setloading(prev => prev = true)
        seterrorMessage("")
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/sales_orders`, { params: filter })
            .then((response) => {
                console.log("response : ", response)
                setsalesOrderList(response.data)
            }).catch((err) => {
                console.log("err : ", err)
                seterrorMessage(String(err.request.status))
            })
        setloading(prev => prev = false)
    }
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        let { name, value } = e.target
        if (value === "") {
            value = dateFormat(new Date)
        }
        setfilter({
            ...filter,
            [name]: value,
        })
    }
    useEffect(() => {
        getAllData()
    }, [])
    useEffect(() => {
        setsalesAmount(salesOrderList.reduce((acc, rec) => acc + Number(rec.sales_amount), 0))
    }, [salesOrderList])

    return (
        <>
            <div className="flex justify-between h-[36px] my-[16px] mx-[24px]">
                <div className="flex">
                    <input className="border rounded w-[144px] px-[12px] mr-[12px]" value={filter.startDate} type="date" name="startDate" onChange={handleChange} />
                    <input className="border rounded w-[144px] px-[12px] mr-[12px]" value={filter.endDate} type="date" name="endDate" onChange={handleChange} />
                    <button className="border rounded w-[84px] bg-blue-200" onClick={getAllData}>search</button>
                </div>
                <button onClick={getAllData} className="flex items-center bg-white px-[6px] py-[4px] rounded">
                    <span>Refresh</span>
                    <span className="ml-[4px]">
                        <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                    </span>
                </button>
            </div>
            <div className="h-[calc(100vh-120px)] overflow-y-auto mx-[6px]">
                <div className={`${!loading && errorMessage === "" ? "block" : "hidden"}`}>
                    <div className="flex bg-white h-[55px] mb-[4px]">
                        <div className="w-[30%] flex items-center"><span className="w-[100%] text-center">เลขที่ใบสั่งซื้อ</span></div>
                        <div className="w-[20%] flex items-center"><span className="w-[100%] text-center">จำนวนเงิน</span></div>
                        <div className="w-[30%] flex items-center"><span className="w-[100%] text-center">วันที่และเวลา</span></div>
                        <div className="w-[20%] flex items-center"><span className="w-[100%] text-center">แอคชั่น</span></div>
                    </div>
                    {salesOrderList.map((sod, index) => (
                        <div key={`SOD-${index}`} className="flex bg-white h-[55px] mb-[4px]">
                            <div className="w-[30%] flex items-center"><span className="w-[100%] text-center">{sod.sales_order_id}</span></div>
                            <div className="w-[20%] flex items-center"><span className="w-[100%] text-center">{sod.sales_amount}</span></div>
                            <div className="w-[30%] flex items-center"><span className="w-[100%] text-center">
                                {sod.date.split("T")[0]}
                                / {sod.date.split("T")[1].split(".")[0]}
                            </span></div>
                            <div className="w-[20%] flex items-center">
                                {/* <span className="w-[100%] text-center">
                                <button className="hover:bg-gray-100 rounded" onClick={() => { }}>
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
                            </span> */}
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center bg-white h-[55px] px-[24px]">
                        <span className="text-center mr-[12px]">รวม :</span>
                        <span className="text-center">{salesAmount} (บาท)</span>
                    </div>
                </div>
                <div className={`w-[100%] h-[100%] justify-center items-center ${loading ? "flex" : "hidden"}`}>
                    <svg className="animate-spin h-[64px] w-[64px] text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="text-blue-500" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
                <div className={`h-[100%] p-[6px] ${!loading && errorMessage !== "" ? "block" : "hidden"}`}>
                    <div className="flex justify-center items-center bg-white h-[100%] w-[100%]">
                        <span className={`${errorMessage === "404" ? "flex items-center" : "hidden"}`}>
                            Not Found!
                        </span>
                        <button className={`${errorMessage === "0" ? "flex items-center" : "hidden"}`} onClick={getAllData}>
                            <span>
                                Network Error!
                            </span>
                            <span className="ml-[4px]">
                                <svg className="h-[28px] w-[28px] text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10" />
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}