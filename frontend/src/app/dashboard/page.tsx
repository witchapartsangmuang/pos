"use client"
import { ChangeEvent, useEffect, useState } from "react"
import CountUp from 'react-countup'
import React from 'react'
import { getAll } from "@/service/api"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function Page() {
    const [sales, setsales] = useState(0)
    const [cost, setcost] = useState(0)
    const [profit, setprofit] = useState(0)
    const [filter, setfilter] = useState({
        startDate: dateFormat(new Date),
        endDate: dateFormat(new Date)
    })

    const [toptenProduct, settoptenProduct] = useState([
        { name: "abcdefg", value: 100 }, { name: "abcdefg", value: 90 }, { name: "abcdefg", value: 80 },
        { name: "abcdefg", value: 100 }, { name: "abcdefg", value: 90 }, { name: "abcdefg", value: 80 },
        { name: "abcdefg", value: 100 }, { name: "abcdefg", value: 90 }, { name: "abcdefg", value: 80 },
        { name: "abcdefg", value: 100 }
    ])

    function dateFormat(date: Date) {
        let year: number = date.getFullYear()
        let month: number = date.getMonth() + 1
        let day: number = date.getDate()
        return `${year}-${month < 10 ? "0" + String(month) : month}-${day < 10 ? "0" + String(day) : day}`
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
    async function getDashboard() {
        const res = await getAll(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/dashboard`, filter)
        console.log("red", res.data);

        setsales(res.data.SalesCost[0].sales)
        setcost(res.data.SalesCost[0].cost)
        setprofit(res.data.SalesCost[0].sales - res.data.SalesCost[0].cost)
        settoptenProduct(res.data.topTenProduct)
    }
    useEffect(() => {
        getDashboard()
    }, [])
    useEffect(() => {
        console.log(filter);
    }, [filter])

    return (
        <div className="px-[6px] mt-[6px]">
            <div className="my-[6px]">
                <input className="border rounded h-[36px] w-[144px] pl-[12px] mr-[12px]" value={filter.startDate} type="date" name="startDate" onChange={handleChange} />
                <input className="border rounded h-[36px] w-[144px] pl-[12px] mr-[12px]" value={filter.endDate} type="date" name="endDate" onChange={handleChange} />
                <button className="border rounded h-[36px] w-[84px] bg-blue-200" onClick={getDashboard}>set/refresh</button>
            </div>
            <div className="flex justify-between bg-white p-[6px] w-[512px] mb-[8px]">
                <div className="border rounded w-[144px] h-[112px] p-[8px] bg-red-200 ">
                    <div className="mb-[6px]">
                        <svg className="h-[32px] w-[32px] text-red-500" viewBox="0 0 24 24"
                            strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <circle cx="12" cy="11" r="3" />
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                        </svg>
                    </div>
                    <p className="mb-[4px]">ยอดขาย</p>
                    <p><CountUp end={sales as number} separator="," /><span className="ml-[4px]">(บาท)</span></p>
                </div>
                <div className="border rounded w-[144px] h-[112px] p-[6px] bg-red-200 ">
                    <div className="mb-[6px]">
                        <svg className="h-[32px] w-[32px] text-red-500" viewBox="0 0 24 24"
                            strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <circle cx="12" cy="11" r="3" />
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                        </svg>
                    </div>
                    <p className="mb-[4px]">ต้นทุน</p>
                    <p><CountUp end={cost as number} separator="," /><span className="ml-[4px]">(บาท)</span></p>

                </div>
                <div className="border rounded w-[144px] h-[112px] p-[8px] bg-red-200 ">
                    <div className="mb-[6px]">
                        <svg className="h-[32px] w-[32px] text-red-500" viewBox="0 0 24 24"
                            strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <circle cx="12" cy="11" r="3" />
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                        </svg>
                    </div>
                    <p className="mb-[4px]">กำไร</p>
                    <p><CountUp end={profit as number} separator="," /><span className="ml-[4px]">(บาท)</span></p>
                </div>
            </div>
            <div className="w-[100%] bg-white rounded">
                <div className="border-b mx-[12px] px-[8px] py-[8px]">
                    <p>สินค้าที่มีการขายมากที่สุด 10 อันดับ</p>
                </div>
                <div className="mt-[12px] p-[24px] w-[100%] h-[500px]">
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <BarChart data={toptenProduct} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="product_name" height={70} label={{ value: "สินค้า", dy: 20 }} tick={(props) => (
                                <g transform={`translate(${props.x},${props.y})`}>
                                    <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-15)">
                                        {props.payload.value}
                                    </text>
                                </g>
                            )} />
                            <YAxis label={{ value: 'จำนวนสินค้า', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
