"use client"
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import axios from 'axios'
export default function Page() {
    const rounter = useRouter()
    const [loginInfo, setloginInfo] = useState<{ [key: string]: string, username: string, password: string }>({
        username: "",
        password: ""
    })
    const [validateData, setvalidateData] = useState<{ username: boolean, password: boolean }>({
        username: true,
        password: true
    })
    const [loading, setloading] = useState<boolean>(false)

    async function handleLogin() {
        setloading(true)
        Object.keys(loginInfo).forEach(function (key) {
            if (loginInfo[key] !== "") {
                setvalidateData(prev => { return { ...prev, [key]: true } })
            } else {
                setvalidateData(prev => { return { ...prev, [key]: false } })
            }
        })
        if (loginInfo.username !== "" && loginInfo.password !== "") {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/login`, {
                headers: { "Content-Type": "application/json" },
                body: loginInfo
            }).then(async (response) => {
                console.log("response", response.data.access_token)
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/verify`, {
                    headers: { "Content-Type": "application/json" },
                    body: response.data.access_token
                }).then(()=>{
                    console.log("verify");
                })
            }).catch((err) => {
                console.log("response", err);
                // String(err.request.status)
            })


            // const res = await create(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/login`, {
            //     headers: { "Content-Type": "application/json" },
            //     body: { email, password }
            // })
            // if (res.status === 201) {
            //     localStorage.setItem('access_token', res.data.access_token)
            //     // rounter.push('/dashboard')
            //     const res2 = await create(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/validateToken`, {
            //         headers: {
            //             "Content-Type": "application/json",
            //             "Authorization": `Bearer ${res.data.access_token}`
            //         }
            //     })
            //     console.log("res2", res2)
            // } else {
            //     console.log("login failed")
            // }
        } else {

        }
        setloading(false)
    }
    useEffect(() => {
        console.log(loginInfo, validateData)

    }, [loginInfo, validateData])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <div>
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700">User</label>
                    <input
                        id="user"
                        type="text"
                        value={loginInfo.user}
                        onChange={(e) => setloginInfo({ ...loginInfo, username: e.target.value })}
                        className={`mt-1 block w-full px-3 py-2 ${loginInfo.username === "" && !validateData.username ? "border border-red-300" : "border border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={loginInfo.password}
                        onChange={(e) => setloginInfo({ ...loginInfo, password: e.target.value })}
                        className={`mt-1 block w-full px-3 py-2 ${loginInfo.password === "" && !validateData.password ? "border border-red-300" : "border border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="********"
                    />
                </div>
                <button
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleLogin}
                >
                    {!loading ?
                        <span>Log In</span> :
                        <span className="flex justify-center">
                            <svg className="animate-spin h-[24px] w-[24px] text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="text-blue-500" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </span>

                    }
                </button>
            </div>
        </div>
    )
}

