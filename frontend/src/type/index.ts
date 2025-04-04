export type ProductType = {
    product_id: string
    product_name: string
    barcode: string
    selling_price: number
    purchase_price: number
    img: string
    date: string
    user_id:string
    category_id:string
}
export type CategoryType = {
    category_id: string
    category_name: string
    user_id: string
}
export type CartType = {
    cart_id: string
    unit_count: number
    payment_status: string
    date: string
    product_id: string
    user_id: string
    sales_order_id: string
}
export type SalesOrderType = {
    sales_order_id: string
    sales_amount: string
    date: string
    user_id: string
}