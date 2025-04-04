"use client"
import React, { ReactElement, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()


    const [ctime, setTime] = useState("")
    useEffect(() => {
        let time = new Date().toLocaleTimeString()
        const UpdateTime = () => {
            time = new Date().toLocaleTimeString()
            setTime(time)
        }
        setInterval(UpdateTime)
    }, [])

    const menu: { name: string, path: string, icon: ReactElement }[] = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon:
                <svg className={`h-[24px] w-[24px] ${pathname === "/dashboard" ? "text-white" : "text-black"} text-white`} viewBox="0 0 24 24"
                    strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx="12" cy="13" r="2" />
                    <line x1="13.45" y1="11.55" x2="15.5" y2="9.5" />
                    <path d="M6.4 20a9 9 0 1 1 11.2 0Z" />
                </svg>
        },
        {
            name: "POS Order",
            path: "/pos-order",
            icon:
                <svg className={`h-[24px] w-[24px] ${pathname === "/order" ? "text-white" : "text-black"} text-white`} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="2" />
                </svg>
        },
        // {
        //     name: "Customer Order",
        //     path: "/customer-order",
        //     icon:
        //         <svg className={`h-[24px] w-[24px] ${pathname === "/order" ? "text-white" : "text-black"} text-white`} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
        //             strokeLinecap="round" strokeLinejoin="round">
        //             <path stroke="none" d="M0 0h24v24H0z" />
        //             <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />
        //             <rect x="9" y="3" width="6" height="4" rx="2" />
        //         </svg>
        // },
        {
            name: "Sales Order",
            path: "/sales-order",
            icon:
                <svg className={`h-[24px] w-[24px] ${pathname === "/sales_order" ? "text-white" : "text-black"} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 
                    012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>


        },
        {
            name: "Inventory",
            path: "/inventory",
            icon:
                <svg className={`h-[24px] w-[24px] ${pathname === "/inventory" ? "text-white" : "text-black"} text-white`} viewBox="0 0 24 24"
                    strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
                    <line x1="12" y1="12" x2="20" y2="7.5" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <line x1="12" y1="12" x2="4" y2="7.5" />
                    <line x1="16" y1="5.25" x2="8" y2="9.75" />
                </svg>
        },
        {
            name: "Product List",
            path: "/product-list",
            icon:
                <svg className={`h-[24px] w-[24px] ${pathname === "/product-list" ? "text-white" : "text-black"} text-white`} viewBox="0 0 24 24"
                    strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
                    <line x1="12" y1="12" x2="20" y2="7.5" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <line x1="12" y1="12" x2="4" y2="7.5" />
                    <line x1="16" y1="5.25" x2="8" y2="9.75" />
                </svg>
        },
        {
            name: "Setting",
            path: "/setting",
            icon:
                <svg className={`h-[24px] w-[24px] ${pathname === "/setting" ? "text-white" : "text-black"} text-white`} viewBox="0 0 24 24"
                    strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 
                    3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 
                    0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 
                    1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 
                    -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 
                    2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
        }
    ]
    useEffect(() => {
        console.log("pathname", pathname);
    }, [pathname])
    return (
        <>
            {pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/pos-order") || pathname.startsWith("/sales-order") || pathname.startsWith("/product-list") || pathname.startsWith("/setting") || pathname.startsWith("/inventory")?
                <>
                    <div className="bg-blue-100 h-[52px] flex items-center justify-end px-[24px]">
                        <span className="mr-[16px]">{ctime}</span>
                        <div className="flex items-center">
                            <img className="w-[36px] h-[36px] rounded-[100%]" src="images/product.webp" />
                            <p className="pl-[6px]">Pangsagis</p>
                        </div>
                    </div>
                    <div className="flex h-[calc(100vh-52px)]">
                        <div className="bg-white min-w-[216px] p-[8px]">
                            {menu.map((menu, index) => (
                                <div key={`menu-${index}`} className={`${menu.path === pathname ? "bg-blue-500" : "bg-blue-200"} text-[20px] h-[48px] flex items-center rounded my-[4px] pl-[8px] hover:cursor-pointer`}
                                    onClick={() => { router.push(menu.path) }}>
                                    {menu.icon}
                                    <span className={`${menu.path === pathname ? "text-white" : "text-black"} pl-[16px]`}>{menu.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grow bg-neutral-100">
                            {children}
                        </div>
                    </div>
                </> :
                <>
                    {children}
                </>
            }
        </>
    )
}