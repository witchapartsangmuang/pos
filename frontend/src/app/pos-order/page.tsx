"use client"
import { setProductList } from "@/store/productSlice"
import { RootState } from "@/store/store"
import { CartType, CategoryType, ProductType } from "@/type"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function Page() {
    const dispatch = useDispatch()
    const productList = useSelector((state: RootState) => state.productSlice.productList)
    const [orderInCart, setorderInCart] = useState<CartType[]>([])
    const [category, setcategory] = useState<CategoryType[]>([])
    const [filterCategory, setfilterCategory] = useState<string>("All")
    const [allLoading, setallLoading] = useState<boolean>(true)
    const [errorAllMessage, seterrorAllMessage] = useState<string>("")
    const [totalPriceInCart, settotalPriceInCart] = useState<number>(0)
    const [inputBarcode, setinputBarcode] = useState<string>("")
    const [cartLoading, setcartLoading] = useState<boolean>(false)

    function barcodeReader(key: string) {
        if (key === "Enter") {
            const selectedProduct = productList.filter((prod) => (prod.barcode === inputBarcode))[0]
            if (selectedProduct !== undefined) {
                SummaryCart(selectedProduct)
            }
            setinputBarcode("")
        }
    }

    async function getAllData() {
        setallLoading(prev => prev = true)
        seterrorAllMessage("")
        await axios.all([
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/product`, { params: { user_id: "pangsagis" } }),
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/category`, { params: { user_id: "pangsagis" } }),
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/cart`, { params: { payment_status: "In Payment", user_id: "pangsagis" } })
        ])
            .then(axios.spread((res1, res2, res3) => {
                dispatch(setProductList(res1.data))
                setcategory(res2.data)
                setorderInCart(res3.data)
                seterrorAllMessage("")
            }))
            .catch((err) => {
                seterrorAllMessage(String(err.request.status))
            })
        setallLoading(prev => prev = false)

    }

    async function SummaryCart(prod: ProductType) {
        if (orderInCart.filter((ord) => (ord.product_id === prod.product_id)).length === 0) {
            const newCart = {
                cart_id: `CT-${Date.now()}-pangsagis`,
                unit_count: 1,
                payment_status: "In Payment",
                date: new Date().toISOString().split('.')[0] + '.000Z',
                product_id: prod.product_id,
                user_id: prod.user_id,
                sales_order_id: ""
            }
            createToCart(newCart)
        }
        else {
            const oldCart = orderInCart.filter((ord) => (ord.product_id === prod.product_id))[0]
            const updateCart = { ...oldCart, unit_count: oldCart.unit_count + 1 }
            updateToCart(updateCart)
        }
    }

    async function createToCart(newCart: CartType) {
        setcartLoading(prev => prev = true)
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/cart/create`, newCart)
            .then(() => {
                setorderInCart([...orderInCart, newCart])
                seterrorAllMessage("")
            })
            .catch((err) => {
                seterrorAllMessage(String(err.request.status))
            })
        setcartLoading(prev => prev = false)
    }

    async function updateToCart(updateCart: CartType) {
        setcartLoading(prev => prev = true)
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/cart/updateOne`, updateCart)
            .then(() => {
                setorderInCart(orderInCart.map((ord) => {
                    if (ord.cart_id === updateCart.cart_id) {
                        return updateCart
                    } else {
                        return ord
                    }
                }))
                seterrorAllMessage("")
            })
            .catch((err) => {
                seterrorAllMessage(String(err.request.status))
            })
        setcartLoading(prev => prev = false)
    }



    async function removeFromCart(key: string[]) {
        setcartLoading(prev => prev = true)
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/cart/delete`, { data: key })
            .then(() => {
                seterrorAllMessage("")
                setorderInCart(orderInCart.filter((ord) => (!key.includes(ord.cart_id))))
            })
            .catch((err) => {
                seterrorAllMessage(String(err.request.status))
            })
        setcartLoading(prev => prev = false)
    }

    async function handlePayment() {
        setcartLoading(prev => prev = true)
        const salesOrderId = `SO-${Date.now()}`
        const salesOrder = {
            sales_order_id: salesOrderId,
            sales_amount: orderInCart.reduce((acc, rec) => acc + rec.unit_count * productList.filter((prod) => (prod.product_id === rec.product_id))[0].selling_price, 0),
            date: `${dateFormat(new Date)} ${timeFormat(new Date)}`,
            user_id: "pangsagis"
        }
        const cartIdList = orderInCart.map((ord) => {
            return ord.cart_id
        })
        await axios.all([
            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/sales_order/create`, salesOrder),
            axios.put(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/cart/updateAll`, { cartIdList, salesOrderId, payment_status: 'Paid' })
        ])
            .then(() => {
                seterrorAllMessage("")
                setorderInCart([])
            })
            .catch((err) => {
                seterrorAllMessage(String(err.request.status))
            })
            setcartLoading(prev => prev = false)
    }

    function dateFormat(date: Date) {
        const year: number = date.getFullYear()
        const month: string = String(date.getMonth() + 1).padStart(2, '0')
        const day: string = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    function timeFormat(date: Date) {
        const hours: string = String(date.getHours()).padStart(2, '0')
        const minutes: string = String(date.getMinutes()).padStart(2, '0')
        const seconds: string = String(date.getSeconds()).padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    }

    useEffect(() => {
        getAllData()
    }, [])


    useEffect(() => {
        settotalPriceInCart(orderInCart.reduce((acc, rec) => acc + rec.unit_count * productList.filter((prod) => (prod.product_id === rec.product_id))[0].selling_price, 0))
    }, [orderInCart])

    return (
        <>
            <div className={`relative ${!allLoading && errorAllMessage === "" ? "block" : "hidden"}`}>
                <div className="h-[calc(100vh-52px)] overflow-y-auto">
                    <div className="flex w-[100%] h-[100%] ">
                        <div className="h-[100%] grow bg-white">
                            <div className="flex max-w-[calc(100vw-640px)] overflow-x-auto items-bottom">
                                <ul className="flex items-end">
                                    <li onClick={() => { setfilterCategory("All") }} className={`flex justify-center items-center h-[42px] min-w-[100px] mx-[5px] px-[6px] border-t border-r border-l rounded-t ${filterCategory === "All" ? "bg-blue-400" : "bg-gray-300"}`}>All</li>
                                    {category.map((cat, index) => (
                                        <li key={`category-${index}`} onClick={() => { setfilterCategory(cat.category_id) }} className={`flex justify-center items-center h-[42px] min-w-[100px] mx-[5px] px-[6px] border-t border-r border-l rounded-t ${filterCategory === cat.category_id ? "bg-blue-400" : "bg-gray-300"}`}>{cat.category_name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-wrap">
                                {productList.map((prod, index) => (
                                    (prod.category_id === filterCategory || filterCategory === "All") &&
                                    <div key={`product-${index}`} className="w-[20%] p-[2px]"
                                        onClick={() => { SummaryCart(prod) }}
                                    >
                                        <div className="border rounded w-[100%] bg-white">
                                            {prod.img !== "" && prod.img !== null ?
                                                <img className="w-[100%] h-[100%] rounded-t aspect-square" src={`http://localhost:8000/api/file/${prod.img}`} /> :
                                                <img className="w-[100%] h-[100%] rounded-t aspect-square" src={"images/noImg.png"} />
                                            }
                                            <div className="flex w-[100%] justify-between py-[6px] px-[12px]">
                                                <span className="truncate">{prod.product_name}</span>
                                                <span className="min-w-[54px] text-end">{prod.selling_price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-[100%] min-w-[424px] shadow">
                            <div className="flex bg-white h-[54px] px-[6px]">
                                <input type="text" value={inputBarcode} onKeyDown={(e) => { barcodeReader(e.key) }} onChange={(e) => { setinputBarcode(e.target.value) }} className="border my-auto pl-[6px] h-[36px]" />
                            </div>
                            {
                                !cartLoading ?
                                    <>
                                        <div className="h-[calc(100vh-164px)] overflow-x-hidden pt-[6px] overflow-y-auto">
                                            {
                                                orderInCart.map((ord, index) => {
                                                    const prod = productList.filter((prod) => (prod.product_id === ord.product_id))[0]
                                                    return (
                                                        <div key={`product-in-cart-${index}`} className="flex justify-center bg-white border-b p-[6px] mb-[4px]">
                                                            <div className="w-[264px]">
                                                                <span className="w-[100%] block text-[28px] truncate">{prod.product_name}</span>
                                                                <div className="flex">
                                                                    <span className="w-[106px] text-[20px] pl-[6px]">฿{prod.selling_price}</span>

                                                                    <div className="flex w-[142px] justify-center">
                                                                        <button className="border w-[42px]" disabled={ord.unit_count === 1} onClick={() => { updateToCart({ ...ord, unit_count: ord.unit_count - 1 }) }}>-</button>
                                                                        <span className="w-[32px] mx-[6px] text-center">{ord.unit_count}</span>
                                                                        <button className="border w-[42px]" onClick={() => { updateToCart({ ...ord, unit_count: ord.unit_count + 1 }) }}>+</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span className="w-[92px] flex items-center text-[26px] pl-[6px]">฿{prod.selling_price * ord.unit_count}</span>
                                                            <div className="flex items-center justify-center w-[52px]">
                                                                <button className="hover:bg-gray-100 rounded" onClick={() => {
                                                                    removeFromCart([ord.cart_id])
                                                                }}>
                                                                    <svg className="h-[42px] w-[42px] text-gray-400 hover:text-black" width="24" height="24" viewBox="0 0 24 24"
                                                                        strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path stroke="none" d="M0 0h24v24H0z" />
                                                                        <line x1="4" y1="7" x2="20" y2="7" />
                                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="bg-white flex h-[58px] w-[100%] justify-between p-[8px]">
                                            <div className="flex items-center">
                                                <span>รวมทั้งหมด: </span>
                                                <span className="mx-[6px]">฿{totalPriceInCart}</span>
                                            </div>
                                            <button className={`px-[8px] border rounded w-[90px] ${orderInCart.length > 0 ? "block" : "hidden"}`} onClick={handlePayment}>ชำระเงิน</button>
                                        </div>
                                    </>
                                    :
                                    <div className="h-[calc(100vh-106px)] flex items-center justify-center pt-[6px]">
                                        <svg className="animate-spin h-[64px] w-[64px] text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="text-blue-500" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
            <div className={`w-[100%] h-[100vh] justify-center items-center ${allLoading ? "flex" : "hidden"}`}>
                <svg className="animate-spin h-[64px] w-[64px] text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="text-blue-500" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
            <div className={`h-[100vh] ${!allLoading && errorAllMessage !== "" ? "block" : "hidden"}`}>
                <div className="flex justify-center items-center bg-white h-[100%] w-[100%]">
                    <span className={`${errorAllMessage === "404" ? "flex items-center" : "hidden"}`}>
                        Not Found!
                    </span>
                    <button className={`${errorAllMessage === "0" ? "flex items-center" : "hidden"}`} onClick={getAllData}>
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
        </>
    )
}