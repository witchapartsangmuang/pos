"use client"
import { FocusEvent, useEffect, useState } from "react"
import { RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { ProductType } from "@/type"
import { setCategoryList } from "@/store/categorySlice"

export default function Page() {
    const dispatch = useDispatch()
    const rounter = useRouter()
    const categoryList = useSelector((state: RootState) => state.categorySlice.categoryList)
    const [productDetail, setproductDetail] = useState<ProductType>({
        product_id: "",
        product_name: "",
        img: "",
        barcode: "",
        selling_price: 0,
        purchase_price: 0,
        date: "",
        user_id: "pangsagis",
        category_id: ""
    })
    const [fileUpload, setfileUpload] = useState<File>()
    const [loading, setloading] = useState<boolean>(true)
    const [errorMessage, seterrorMessage] = useState<string>("")

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader()
        const file = e.target.files![0]
        reader.onloadend = () => {
            setproductDetail({ ...productDetail, img: String(reader.result) })
        }
        if (file) {
            setfileUpload(file)
            reader.readAsDataURL(file)
        }
    }
    function handleChange(name: string, value: string) {
        setproductDetail({
            ...productDetail,
            [name]: value,
        })
    }

    async function handleSubmit() {
        setloading(prev => prev = true)
        const formData = new FormData()
        formData.append("data", JSON.stringify({
            product_id: `PD-${Date.now()}`,
            product_name: productDetail.product_name,
            barcode: productDetail.barcode,
            selling_price: productDetail.selling_price,
            purchase_price: productDetail.purchase_price,
            date: `${dateFormat(new Date)} ${timeFormat(new Date)}`,
            user_id: productDetail.user_id,
            category_id: productDetail.category_id
        }))
        if (fileUpload !== undefined) {
            formData.append("file", fileUpload)
        }
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/product/create`, formData)
            .then((response) => { return response })
            .catch((err) => { return err })
        if (res.status === 201) {
            rounter.push(`/product-list/${res.data.product_id}`)
            seterrorMessage("")
        } else {
            seterrorMessage(String(res.request.status))
        }
        setloading(prev => prev = false)
    }

    function validdateNumber(e: FocusEvent<HTMLInputElement>) {
        const { name, value } = e.target
        let regex = /^-?\d*\.?\d+$/
        if (regex.test(value)) {
            setproductDetail({
                ...productDetail,
                [name]: Number(value),
            })
        } else {
            setproductDetail({
                ...productDetail,
                [name]: 0,
            })
        }
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

    async function getAllData() {
        setloading(prev => prev = true)
        seterrorMessage("")
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/category`, { params: { user_id: "pangsagis" } })
            .then((response) => {
                dispatch(setCategoryList(response.data))
            })
            .catch((err) => {
                seterrorMessage(String(err.request.status))
            })
        setloading(prev => prev = false)
    }
    useEffect(() => {
        getAllData()
    }, [])
    return (
        <>
            <div className="flex justify-between h-[36px] my-[16px] mx-[24px]">
                <button onClick={() => { rounter.push("/product-list") }} className="h-[100%] px-[16px] bg-white border rounded">Back</button>
                <button className="px-[16px] bg-blue-600 text-white border rounded" disabled={errorMessage !== ""} onClick={handleSubmit}>Save</button>
            </div>
            <div className="bg-white flex h-[calc(100vh-120px)] overflow-y-auto mx-[6px]">
                <div className={`mx-auto w-[50%] mt-[48px] ${!loading && errorMessage === "" ? "block" : "hidden"}`}>
                    <div className="flex w-[100%] mb-[24px]">
                        {productDetail.img !== null && productDetail.img !== "" ? <img className="h-[216px] w-[216px] rounded" src={productDetail.img} /> :
                            <div className="flex border rounded h-[216px] w-[216px] items-center justify-center bg-gray-200">
                                <svg className="h-[72px] w-[72px] text-gray-500"
                                    viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                    strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />
                                    <circle cx="12" cy="13" r="3" />
                                    <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                    <line x1="15" y1="6" x2="21" y2="6" />
                                    <line x1="18" y1="3" x2="18" y2="9" />
                                </svg>
                            </div>}

                        <div className="grow ml-[24px] h-[216px] rounded border-[2px] border-dashed bg-gray-100">
                            <label htmlFor="img_upload" className="flex w-[100%] h-[100%] items-center justify-center">
                                <span>Upload</span>
                            </label>
                        </div>
                    </div>
                    <input className="opacity-0 absolute left-0 top-[-30px]" id="img_upload" name="file" type="file" accept="image/*" onChange={(e) => {
                        handleFile(e)
                    }} />
                    <div className="w-[100%]">
                        <div className="w-[100%] mb-[24px] p-[6px]">
                            <p className="mb-[8px]">ชื่อสินค้า</p>
                            <input className="border rounded w-[100%] h-[36px] pl-[12px]" type="text" value={productDetail.product_name} onChange={(e) => { handleChange("product_name", e.target.value) }} />
                        </div>
                        <div className="w-[100%] mb-[24px] p-[6px]">
                            <p className="mb-[8px]">รหัสสินค้า (Barcode)</p>
                            <input className="border rounded w-[100%] h-[36px] pl-[12px]" type="text" value={productDetail.barcode} onChange={(e) => { handleChange("barcode", e.target.value) }} />
                        </div>
                        <div className="w-[100%] mb-[24px] p-[6px]">
                            <p className="mb-[8px]">ราคาขาย</p>
                            <input className="border rounded w-[100%] h-[36px] pl-[12px]" type="text" name="selling_price" value={productDetail.selling_price} onBlur={(e) => { validdateNumber(e) }} onChange={(e) => { handleChange("selling_price", e.target.value) }} />
                        </div>
                        <div className="w-[100%] mb-[24px] p-[6px]">
                            <p className="mb-[8px]">ราคาซื้อ</p>
                            <input className="border rounded w-[100%] h-[36px] pl-[12px]" type="text" name="purchase_price" value={productDetail.purchase_price} onBlur={(e) => { validdateNumber(e) }} onChange={(e) => { handleChange("purchase_price", e.target.value) }} />
                        </div>
                        <div className="w-[100%] mb-[24px] p-[6px]">
                            <p className="mb-[8px]">หมวดหมู่สินค้า</p>
                            <select className="border rounded w-[100%] h-[36px] pl-[12px]" value={productDetail.category_id} onChange={(e) => { handleChange("category_id", e.target.value) }}>
                                <option value="">เลือกหมวดหมู่สินค้า</option>
                                {categoryList.map((cat, index) => (
                                    <option key={`${cat}-${index}`} value={cat.category_id}>{cat.category_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className={`w-[100%] h-[100%] justify-center items-center ${loading ? "flex" : "hidden"}`}>
                    <svg className="animate-spin h-[64px] w-[64px] text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="text-blue-500" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
                <div className={`w-[100%] h-[100%] p-[6px] ${!loading && errorMessage !== "" ? "block" : "hidden"}`}>
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