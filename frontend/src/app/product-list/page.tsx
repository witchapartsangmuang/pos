"use client"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { RootState } from "@/store/store"
import axios from "axios"
import { setProductList } from "@/store/productSlice"
import { ProductType } from "@/type"
import ControlPanel from "@/components/ControlPanel"

export default function Page() {
    const dispatch = useDispatch()
    const rounter = useRouter()
    const productList = useSelector((state: RootState) => state.productSlice.productList)
    const [productFilterList, setproductFilterList] = useState<ProductType[]>([])
    const [filter, setfilter] = useState({ search: "" })
    const [loading, setloading] = useState<boolean>(true)
    const [errorMessage, seterrorMessage] = useState<string>("")

    async function getAllData() {
        // setloading(prev => prev = true)
        // await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/product`, { params: { user_id: "pangsagis" } })
        //     .then((response) => {
        //         dispatch(setProductList(response.data))
        //         setproductFilterList(response.data)
        //         seterrorMessage("")
        //     })
        //     .catch((err) => {
        //         seterrorMessage(String(err.request.status))
        //     })
        // setloading(prev => prev = false)

        setloading(prev => prev = true)
        const element = []
        for (let i = 0; i < 50; i++) {
            element.push({
                product_id: "string",
                product_name: "string",
                barcode: "string",
                selling_price: "number",
                purchase_price: "number",
                img: null,
                date: null,
                user_id: "string",
                category_id: "string"
            })
        }
        dispatch(setProductList(element))
        setproductFilterList(element)
        setloading(prev => prev = false)
    }

    function handleFilter() {
        let text = filter.search.toLowerCase()
        setproductFilterList(productList.filter((prod) => (prod.product_id.toLocaleLowerCase().indexOf(text) >= 0 || prod.product_name.toLocaleLowerCase().indexOf(text) >= 0)))
    }

    useEffect(() => {
        getAllData()




    }, [])
    useEffect(() => {
        console.log("productList", productList);
    }, [])
    return (
        <>
            <ControlPanel>
                <div className="flex w-[30%]">
                    <button onClick={() => { rounter.push("/product-list/product-create") }} className="bg-white w-[64px] px-[6px] py-[4px] rounded">New</button>
                </div>
                <div className="flex w-[40%]">
                    <div className="flex items-center">
                        <svg className="text-gray-500 h-[32px] w-[32px]" viewBox="0 0 24 24"
                            strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <circle cx="10" cy="10" r="7" />  <line x1="21" y1="21" x2="15" y2="15" />
                        </svg>
                    </div>
                    <input className="border rounded grow mx-[6px]" type="text" value={filter.search} onChange={(e) => { setfilter({ ...filter, search: e.target.value }) }} />
                    <button className="border w-[84px] rounded-r bg-blue-200" onClick={handleFilter}>search</button>
                </div>
                <div className="flex w-[30%] justify-end">
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
            </ControlPanel>
            <div className="h-[calc(100vh-104px)] overflow-y-auto">
                <div className={`flex-wrap w-[100%]  ${!loading && errorMessage === "" ? "flex" : "hidden"}`}>
                    {
                        productFilterList.map((prod, index) => (
                            <div key={`product-${index}`} className="flex h-[150px] w-[25%] p-[6px]" onClick={() => { rounter.push(`/product-list/${prod.product_id}`) }}>
                                <div className="flex w-[100%] border p-[6px] hover:bg-gray-100 bg-white">
                                    <div className="w-[70%]">
                                        <p className="font-bold mb-[4px] pl-[4px] truncate">{prod.product_name}</p>
                                        <p className="mb-[2px]"><span className="font-semibold">บาร์โค้ต :</span>{prod.barcode}</p>
                                        <p className="mb-[2px]"><span className="font-semibold">ราคาขาย :</span>{prod.selling_price} ฿</p>
                                        <p className="mb-[2px]"><span className="font-semibold">ราคาซื้อ :</span>{prod.purchase_price} ฿</p>
                                    </div>
                                    <div className="w-[30%]">
                                        {prod.img !== "" && prod.img !== null ?
                                            <img className="object-cover w-[100%] h-[100%]" src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/file/${prod.img}`} /> :
                                            <img className="object-cover w-[100%] h-[100%]" src={`images/noImg.png`} />
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
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