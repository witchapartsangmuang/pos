"use client"
import { setProductList } from "@/store/productSlice"
import { RootState } from "@/store/store"
import { ProductType, CategoryType, CartType } from "@/type"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function Page() {
    const dispatch = useDispatch()
    const productList = useSelector((state: RootState) => state.productSlice.productList)
    const [orderInCart, setorderInCart] = useState<CartType[]>([])
    const [category, setcategory] = useState<CategoryType[]>([])
    const [filterCategory, setfilterCategory] = useState<string>("All")
    const [loading, setloading] = useState<boolean>(true)
    const [errorMessage, seterrorMessage] = useState<string>("")
    const [isOpenCartModal, setisOpenCartModal] = useState<boolean>(false)
    const [isOpenOrderModal, setisOpenOrderModal] = useState<boolean>(false)
    const [selectedProduct, setselectedProduct] = useState<ProductType>({
        product_id: "",
        product_name: "",
        barcode: "",
        selling_price: 0,
        purchase_price: 0,
        img: "",
        date: "",
        user_id: "",
        category_id: ""
    })
    const [numberAddtoCart, setnumberAddtoCart] = useState<number>(0)
    const [totalPriceInCart, settotalPriceInCart] = useState<number>(0)


    async function getAllData() {
        setloading(prev => prev = true)
        seterrorMessage("")
        await axios.all([
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/product`, { params: { user_id: "pangsagis" } }),
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/category`, { params: { user_id: "pangsagis" } }),
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/cart`, { params: { payment_status: "In Payment", user_id: "pangsagis" } })
        ])
            .then(axios.spread((res1, res2, res3) => {
                dispatch(setProductList(res1.data))
                setcategory(res2.data)
                setorderInCart(res3.data)
                seterrorMessage("")
            }))
            .catch((err) => {
                seterrorMessage(String(err.request.status))
            })
        setloading(prev => prev = false)

    }
    function prepareOrder(id: string) {
        const product = productList.filter((prod) => (prod.product_id === id))[0]
        setselectedProduct(product)
        setisOpenOrderModal(true)
    }

    function addToCart() {
        SummaryCart()
        addToCartCancel()
    }

    async function SummaryCart() {
        if (orderInCart.filter((ord) => (ord.product_id === selectedProduct.product_id)).length === 0) {
            console.log("SummaryCart selectedProduct : ", selectedProduct)
            const newCart = {
                cart_id: `CT-${Date.now()}-pangsagis`,
                unit_count: numberAddtoCart,
                payment_status: "In Payment",
                date: new Date().toISOString().split('.')[0] + '.000Z',
                product_id: selectedProduct.product_id,
                user_id: selectedProduct.user_id,
                sales_order_id: ""
            }
            createToCart(newCart)
        }
        else {
            const oldCart = orderInCart.filter((ord) => (ord.product_id === selectedProduct.product_id))[0]
            const updateCart = { ...oldCart, unit_count: oldCart.unit_count + numberAddtoCart }
            updateToCart(updateCart)
        }
    }

    async function createToCart(newCart: CartType) {
        setloading(prev => prev = true)
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/cart/create`, newCart)
            .then(() => {
                setorderInCart([...orderInCart, newCart])
                seterrorMessage("")
            })
            .catch((err) => {
                seterrorMessage(String(err.request.status))
            })
        setloading(prev => prev = false)
    }

    async function updateToCart(updateCart: CartType) {
        setloading(prev => prev = true)

        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/cart/updateOne`, updateCart)
            .then(() => {
                setorderInCart(orderInCart.map((ord) => {
                    if (ord.cart_id === updateCart.cart_id) {
                        return updateCart
                    } else {
                        return ord
                    }
                }))
                seterrorMessage("")
            })
            .catch((err) => {
                seterrorMessage(String(err.request.status))
            })
        setloading(prev => prev = false)
    }



    async function removeFromCart(key: string[]) {
        setloading(prev => prev = true)
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/cart/delete`, { data: key })
            .then(() => {
                seterrorMessage("")
                setorderInCart(orderInCart.filter((ord) => (!key.includes(ord.cart_id))))
            })
            .catch((err) => {
                seterrorMessage(String(err.request.status))
            })
        setloading(prev => prev = false)
    }


    function addToCartCancel() {
        setselectedProduct({
            product_id: "",
            product_name: "",
            barcode: "",
            selling_price: 0,
            purchase_price: 0,
            img: "",
            date: "",
            user_id: "",
            category_id: ""
        })
        setnumberAddtoCart(0)
        setisOpenOrderModal(false)
    }

    async function handlePayment() {
        setloading(prev => prev = true)
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
                seterrorMessage("")
                setorderInCart([])
                setisOpenCartModal(false)
            })
            .catch((err) => {
                seterrorMessage(String(err.request.status))
            })
        setloading(prev => prev = false)
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
        console.log("selectedProduct", selectedProduct)

    }, [selectedProduct])
    return (
        <>

            <div className={`relative ${!loading && errorMessage === "" ? "block" : "hidden"}`}>
                <div className="flex h-[70px] bg-gray-100">
                    <div className="flex w-[calc(100vw-70px)] overflow-x-auto items-bottom">
                        <ul className="flex items-end">
                            <li onClick={() => { setfilterCategory("All") }} className={`flex justify-center items-center h-[42px] min-w-[100px] mr-[10px] px-[6px] border-t border-r border-l rounded-t ${filterCategory === "All" ? "bg-blue-400" : "bg-gray-300"}`}>All</li>
                            {category.map((cat, index) => (
                                <li key={`category-${index}`} onClick={() => { setfilterCategory(cat.category_id) }} className={`flex justify-center items-center h-[42px] min-w-[100px] mr-[10px] px-[6px] border-t border-r border-l rounded-t ${filterCategory === cat.category_id ? "bg-blue-400" : "bg-gray-300"}`}>{cat.category_name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-blue-100">
                        <svg onClick={() => { setisOpenCartModal(true) }} className="h-[70px] w-[70px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>
                <div className="h-[calc(100vh-70px)] overflow-y-auto">
                    <div className="flex flex-wrap">
                        {productList.map((prod, index) => (
                            (prod.category_id === filterCategory || filterCategory === "All") &&
                            <div key={`product-${index}`} className="w-[20%] p-[2px]" onClick={() => { prepareOrder(prod.product_id) }}>
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
                {isOpenCartModal &&
                    <div className="absolute w-[100%] h-[100%] top-[0]">
                        <div onClick={() => { setisOpenCartModal(false) }} className="w-[100%] h-[100vh] bg-black opacity-60">
                        </div>
                        <div className="flex justify-center mx-[20%] w-[60%] absolute top-[150px]">
                            <div className="bg-[#f5f5f5] rounded w-[100%] h-[600px] p-[8px]">
                                <div className="border-b flex justify-end py-[4px] mb-[12px]">
                                    <button onClick={() => { setisOpenCartModal(false) }} className="hover:bg-gray-100 rounded">
                                        <svg className="h-[36px] w-[36px] text-gray-400 hover:text-black" width="24" height="24"
                                            viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                            strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />
                                            <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mx-[24px] h-[456px] overflow-y-auto">
                                    <div className="flex bg-white h-[55px] p-[4px] mb-[4px]">
                                        <div className="w-[40%] flex items-center"><span className="w-[100%] text-center">สินค้า</span></div>
                                        <div className="w-[15%] flex items-center"><span className="w-[100%] text-center">ราคาต่อชิ้น</span></div>
                                        <div className="w-[15%] flex items-center"><span className="w-[100%] text-center">จำนวน</span></div>
                                        <div className="w-[20%] flex items-center"><span className="w-[100%] text-center">รวม</span></div>
                                        <div className="w-[10%] flex items-center"><span className="w-[100%] text-center">แอคชั่น</span></div>
                                    </div>
                                    {
                                        orderInCart.map((ord, index) => {
                                            const prod = productList.filter((prod) => (prod.product_id === ord.product_id))[0]
                                            return (
                                                <div key={`product-in-cart-${index}`} className="flex bg-white border-b p-[4px] mb-[4px]">
                                                    <div className="w-[40%] flex items-center">
                                                        {
                                                            prod.img !== "" && prod.img !== null ?
                                                                <img className="h-[116px] aspect-square" src={`http://localhost:8000/api/file/${prod.img}`} /> :
                                                                <img className="h-[116px] aspect-square" src={"images/noImg.png"} />
                                                        }
                                                        <span className="pl-[16px] pr-[8px] w-[100%]">{prod.product_name}</span>
                                                    </div>
                                                    <div className="w-[15%] flex items-center"><span className="w-[100%] text-center">฿{prod.selling_price}</span></div>
                                                    <div className="w-[15%] flex items-center">
                                                        <button className="border w-[25%]" disabled={ord.unit_count === 1} onClick={() => { updateToCart({ ...ord, unit_count: ord.unit_count - 1 }) }}>-</button>
                                                        <span className="w-[50%] text-center border-t border-b">{ord.unit_count}</span>
                                                        <button className="border w-[25%]" onClick={() => { updateToCart({ ...ord, unit_count: ord.unit_count + 1 }) }}>+</button>
                                                    </div>
                                                    <div className="w-[20%] flex items-center"><span className="w-[100%] text-center">฿{prod.selling_price * ord.unit_count}</span></div>
                                                    <div className="w-[10%] flex items-center">
                                                        <span className="w-[100%] text-center">
                                                            <button className="hover:bg-gray-100 rounded" onClick={() => {
                                                                removeFromCart([ord.cart_id])
                                                            }}>
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
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="mx-[24px] bg-white flex h-[50px] justify-between p-[8px]">
                                    <div className="flex items-center">
                                        <span>รวมทั้งหมด: </span>
                                        <span className="mx-[6px]">฿{totalPriceInCart}</span>
                                    </div>
                                    <button className={`px-[8px] border rounded w-[90px] ${orderInCart.length > 0 ? "block" : "hidden"}`} onClick={handlePayment}>ชำระเงิน</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    isOpenOrderModal &&
                    <div className="absolute w-[100%] h-[100%] top-[0]">
                        <div onClick={() => { setisOpenOrderModal(false) }} className="min-h-screen h-[100%] w-[100%] bg-black opacity-60">
                        </div>
                        <div className="flex justify-center mx-[25%] w-[50%] absolute top-[150px]">
                            <div className="bg-blue-100 rounded w-[100%] h-[600px] p-[8px]">
                                <div className="border-b flex justify-end py-[4px] mb-[12px]">
                                    <button onClick={() => { setisOpenOrderModal(false) }} className="hover:bg-gray-100 rounded">
                                        <svg className="h-[36px] w-[36px] text-gray-400 hover:text-black" width="24" height="24"
                                            viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                            strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />
                                            <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="w-[100%] mb-[16px]">
                                    <div className="flex justify-center mb-[16px]">
                                        <div className="w-auto mx-auto border">
                                            {
                                                selectedProduct.img !== "" && selectedProduct.img !== null ?
                                                    <img className="w-[256px] h-[256px]" src={`http://localhost:8000/api/file/${selectedProduct.img}`} /> :
                                                    <img className="w-[256px] h-[256px]" src={"images/noImg.png"} />
                                            }
                                        </div>
                                    </div>
                                    <div className="flex w-[100%] justify-center">
                                        <div className="flex h-[50px] w-[416px] justify-between">
                                            <span className="w-[200px] border p-[12px] bg-white flex items-center"><p className="truncate">{selectedProduct.product_name}</p></span>
                                            <span className="w-[200px] border p-[12px] bg-white flex items-center"><p className="truncate">฿ {selectedProduct.selling_price}</p></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-[100%] justify-center mb-[16px]">
                                    <div className="flex h-[80px] w-[416px]">
                                        <button className="border rounded-l w-[120px] bg-white" onClick={() => { setnumberAddtoCart(prev => { return prev > 0 ? prev - 1 : 0 }) }} >
                                            <span className="flex justify-center">
                                                <svg className="h-[36px] w-[36px]" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                                                    fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            </span>
                                        </button>
                                        <div className="flex border w-[160px] mx-[8px] items-center bg-white">
                                            <p className="text-center w-[100%]">{numberAddtoCart}</p>
                                        </div>
                                        <button className="border rounded-r w-[120px] text-center bg-white" onClick={() => { setnumberAddtoCart(prev => { return prev + 1 }) }} >
                                            <span className="flex justify-center">
                                                <svg className="h-[36px] w-[36px]" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                                    strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <line x1="12" y1="5" x2="12" y2="19" />  <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex w-[100%] justify-center">
                                    <div className="flex h-[80px] w-[416px]">
                                        <button className="rounded border w-[200px] mr-[8px] bg-white" onClick={addToCartCancel}>Cancel</button>
                                        <button className="rounded border w-[200px] ml-[8px] bg-blue-600" disabled={numberAddtoCart === 0} onClick={addToCart}>Add to cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div >
            <div className={`w-[100%] h-[100vh] justify-center items-center ${loading ? "flex" : "hidden"}`}>
                <svg className="animate-spin h-[64px] w-[64px] text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="text-blue-500" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
            <div className={`h-[100vh] ${!loading && errorMessage !== "" ? "block" : "hidden"}`}>
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
        </>
    )
}