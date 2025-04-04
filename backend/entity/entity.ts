import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity("product")
export class Product {
    @PrimaryColumn()
    product_id: string
    @Column({ nullable: true })
    product_name: string
    @Column({ nullable: true })
    selling_price: number
    @Column({ nullable: true })
    purchase_price: number
    @Column({ nullable: true })
    img: string
    @Column({ nullable: true })
    barcode: string
    @CreateDateColumn({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    date: Date
    @Column({ nullable: true })
    user_id: string
    @Column({ nullable: true })
    category_id: string
}

@Entity("category")
export class Category {
    @PrimaryColumn()
    category_id: string
    @Column({ nullable: true })
    category_name: string
    @Column({ nullable: true })
    user_id: string
}

@Entity("cart")
export class Cart {
    @PrimaryColumn()
    cart_id: string
    @Column({ nullable: true })
    unit_count: number
    @Column({ nullable: true })
    payment_status: string
    @CreateDateColumn({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    date: Date
    @Column({ nullable: true })
    product_id: string
    @Column({ nullable: true })
    user_id: string
    @Column({ nullable: true })
    sales_order_id: string
}

@Entity("sales_order")
export class SalesOrder {
    @PrimaryColumn()
    sales_order_id: string
    @Column({ nullable: true })
    sales_amount: string
    @CreateDateColumn({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    date: Date
    @Column({ nullable: true })
    user_id: string
}

@Entity("user")
export class User {
    @PrimaryColumn()
    user_id: string
    @Column({ nullable: true })
    password: string
    @Column({ nullable: true })
    first_name: string
    @Column({ nullable: true })
    last_name: string
    @Column({ nullable: true })
    email: string
    @Column({ nullable: true })
    phone: string
    @CreateDateColumn({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    date: Date
}