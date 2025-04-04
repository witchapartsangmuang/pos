export default function Modal({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-[100vh] absolute left-0 top-0">
            <div className="w-full h-full bg-slate-600 opacity-50"></div>
            <div className="absolute left-0 top-0 w-full h-full" >
                {children}
            </div>
        </div>
    )
}