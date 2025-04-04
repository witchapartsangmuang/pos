export default function ControlPanel({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex h-[36px] my-[8px] mx-[16px]">
            {children}
        </div>
    )
}