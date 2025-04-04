import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Product, Cart, SalesOrder, Category, User } from 'entity/entity'
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Product) private readonly ProductRepository: Repository<Product>,
    @InjectRepository(Cart) private readonly CartRepository: Repository<Cart>,
    @InjectRepository(SalesOrder) private readonly SalesOrderRepository: Repository<SalesOrder>,
    @InjectRepository(Category) private readonly CategoryRepository: Repository<Category>
  ) { }

  async getProducts(query: any): Promise<{}[]> {
    const { user_id } = query
    const sqlQuery = `SELECT * FROM product WHERE product.user_id = '${user_id}'`
    return await this.ProductRepository.query(sqlQuery)
  }

  async getOneProduct(id: string): Promise<{}> {
    return await this.ProductRepository.findOne({ where: { product_id: id } })
  }

  async postProduct(data: any): Promise<{}> {
    const { product_id, product_name, barcode, selling_price, purchase_price, img, date, user_id, category_id } = data
    return await this.ProductRepository.save({ product_id, product_name, barcode, selling_price: Number(selling_price), purchase_price: Number(purchase_price), img, date, user_id, category_id })
  }

  async putProduct(body: any): Promise<{}> {
    const { product_id, product_name, barcode, selling_price, purchase_price, img, user_id, category_id } = body
    return await this.ProductRepository.update(product_id, { product_name, barcode, selling_price: Number(selling_price), purchase_price: Number(purchase_price), img, user_id, category_id })
  }

  async deleteProduct(body: string[]): Promise<{}> {
    return await this.ProductRepository.createQueryBuilder().delete().from(Product).whereInIds(body).execute()
  }

  async getCategories(query: any): Promise<{}[]> {
    const { user_id } = query
    const sqlQuery = `SELECT * FROM category WHERE category.user_id = '${user_id}'`
    const data = await this.CategoryRepository.query(sqlQuery)
    return data
  }

  async postCategory(data: any): Promise<{}> {
    const { category_id, category_name, user_id } = data
    return await this.CategoryRepository.save({ category_id, category_name, user_id })
  }

  async deleteCategory(id: string): Promise<{}> {
    return this.CategoryRepository.delete({ category_id: id })
  }

  async getCart(query: any): Promise<{}[]> {
    const { payment_status } = query
    const sqlQuery = `select * from cart join product on cart.product_id = product.product_id where cart.payment_status = '${payment_status}'`
    return await this.CartRepository.query(sqlQuery)
  }


  async postCart(body: any): Promise<{}> {
    const { cart_id, unit_count, payment_status, date, product_id, user_id, sales_order_id } = body
    const data = await this.CartRepository.save({ cart_id, unit_count, payment_status, date, product_id, user_id, sales_order_id })
    return data
  }
  async cartUpdateOne(body: any): Promise<{}> {
    const { cart_id, unit_count } = body
    return await this.CartRepository.update(cart_id, { unit_count })
  }

  async cartUpdateAll(body: any): Promise<{}> {
    const { cartIdList, salesOrderId, payment_status } = body
    return await this.CartRepository.createQueryBuilder()
      .update(Cart)
      .set({ sales_order_id: salesOrderId, payment_status })
      .where("cart.cart_id IN (:...cartIdList)", { cartIdList })
      .execute()
  }

  async deleteCart(body: any): Promise<{}> {
    return await this.CartRepository.delete({ cart_id: In(body) })
  }

  async getSalesOrders(query: any): Promise<{}[]> {
    const { startDate, endDate } = query
    const sqlQuery = `SELECT * FROM sales_order WHERE CAST("date" as date) BETWEEN '${startDate}' AND '${endDate}'`
    return await this.SalesOrderRepository.query(sqlQuery)
  }

  async postSalesOrder(body: any): Promise<{}> {
    const { sales_order_id, sales_amount, date, user_id } = body
    return await this.SalesOrderRepository.save({ sales_order_id, sales_amount, date, user_id })
  }


  async getDashboard(query: any): Promise<{}> {
    const { startDate, endDate } = query
    const sqlQuerySalesCost = `
    SELECT SUM(product.purchase_price * cart.unit_count) as "cost",SUM(product.selling_price * cart.unit_count) as "sales"
    FROM cart JOIN product ON cart.product_id = product.product_id WHERE cart.payment_status = 'Paid' AND CAST(cart.date AS date) BETWEEN '${startDate}' AND '${endDate}'
    `
    const sqlQuerytopTenProduct = `
      SELECT p.product_id, p.product_name, CAST(c.value as float) FROM product "p"
      JOIN (
        SELECT product_id, SUM(unit_count) AS "value"  FROM cart
        WHERE payment_status = 'Paid' AND CAST("date" AS date) BETWEEN '${startDate}' AND '${endDate}'
        GROUP BY product_id
      ) "c" ON p.product_id = c.product_id ORDER BY c.value DESC LIMIT 10
     `
    const SalesCost = await this.CartRepository.query(sqlQuerySalesCost)
    const topTenProduct = await this.CartRepository.query(sqlQuerytopTenProduct)
    return { SalesCost, topTenProduct }
  }

}
