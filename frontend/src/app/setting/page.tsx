"use client"
import { create, getAll, removeAll, removeOne } from "@/service/api"
import { useEffect, useState } from "react"
import { CategoryType } from "@/type"
export default function Page() {
  const [categoryList, setcategoryList] = useState<CategoryType[]>([])
  async function getAllData() {
    const res = await getAll(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/category`, { user_id: "pangsagis" })
    setcategoryList(res.data)
  }
  useEffect(() => {
    getAllData()
  }, [])
  const [categoryDetail, setcategoryDetail] = useState<CategoryType>({
    category_id: "",
    category_name: "",
    user_id: ""
  })

  async function handleSave() {
    const newCategory = {
      ...categoryDetail,
      category_id: `CAT-${Date.now()}`,
      user_id: "pangsagis"
    }
    const res = await create(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/category`, newCategory)
    setcategoryList([...categoryList, newCategory])
    console.log("res", res)
  }

  async function handleDelete(id: string) {
    const res = await removeOne(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/category/${id}`)
    setcategoryList(categoryList.filter((cat) => (cat.category_id !== id)))
  }

  return (
    <div className="mt-[6px] px-[6px]">
      <div className="flex mb-[6px]">
        <input className="border rounded h-[36px] pl-[12px] mr-[6px]" type="text" onChange={(e) => { setcategoryDetail({ ...categoryDetail, category_name: e.target.value }) }} /><button className="border px-[16px] h-[36px]" onClick={handleSave}>Add</button>
      </div>
      <div className="flex bg-white h-[55px] mb-[4px]">
        <div className="w-[35%] flex items-center"><span className="w-[100%] text-center">รหัสหมวดหมู่</span></div>
        <div className="w-[35%] flex items-center"><span className="w-[100%] text-center">ชื่อหมวดหมู่</span></div>
        <div className="w-[30%] flex items-center"><span className="w-[100%] text-center">Action</span></div>
      </div>
      {categoryList.map((cat) => (
        <div className="flex bg-white h-[55px] mb-[4px]">
          <div className="w-[35%] flex items-center"><span className="w-[100%] text-center">{cat.category_id}</span></div>
          <div className="w-[35%] flex items-center"><span className="w-[100%] text-center">{cat.category_name}</span></div>
          <div className="w-[30%] flex items-center">
            <span className="w-[100%] text-center">
              <button className="hover:bg-gray-100 rounded" disabled onClick={() => { handleDelete(cat.category_id) }}>
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
      ))}
    </div>
  )
}
