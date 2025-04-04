import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common'
import { AppService } from './app.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { Response } from 'express'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('api/file/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: './uploads' })
  }

  @Get("api/products")
  getProducts(@Query() query: {}): Promise<{}[]> {
    return this.appService.getProducts(query)
  }

  @Get("api/product/:id")
  getOneProduct(@Param('id') id: string): Promise<{}> {
    return this.appService.getOneProduct(id)
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`
          callback(null, filename)
        },
      }),
    }),
  )
  @Post("api/product/create")
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any): Promise<{}> {
    return this.appService.postProduct({ ...JSON.parse(body.data), img: file !== undefined ? `${file.filename}` : "" })
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`
          callback(null, filename)
        },
      }),
    }),
  )
  @Put("api/product/update")
  async uploadFile2(@UploadedFile() file: Express.Multer.File, @Body() body: any): Promise<{}> {
    return this.appService.postProduct({ ...JSON.parse(body.data), img: file !== undefined ? `${file.filename}` : body.img })
  }

  @Delete("api/product")
  deleteProduct(@Body() body: string[]): Promise<{}> {
    return this.appService.deleteProduct(body)
  }

  @Get("api/category")
  getCategories(@Query() query: {}): Promise<{}[]> {
    return this.appService.getCategories(query)
  }

  @Post("api/category")
  postCategory(@Body() body: {}): Promise<{}> {
    return this.appService.postCategory(body)
  }

  @Delete("api/category/:id")
  deleteCategory(@Param('id') id: string): Promise<{}> {
    return this.appService.deleteCategory(id)
  }

  @Get("api/cart")
  getCart(@Query() query: {}): Promise<{}[]> {
    return this.appService.getCart(query)
  }
  @Post("api/cart/create")
  postCart(@Body() body: {}): Promise<{}> {
    return this.appService.postCart(body)
  }
  @Put("api/cart/updateOne")
  cartUpdateOne(@Body() body: {}): Promise<{}> {
    return this.appService.cartUpdateOne(body)
  }

  @Put("api/cart/updateAll")
  cartUpdateAll(@Body() body: {}): Promise<{}> {
    return this.appService.cartUpdateAll(body)
  }

  @Delete("api/cart/delete")
  deleteCart(@Body() body: {}): Promise<{}> {
    return this.appService.deleteCart(body)
  }

  @Get("api/sales_orders")
  getSalesOrders(@Query() query: {}): Promise<{}[]> {
    return this.appService.getSalesOrders(query)
  }

  @Post("api/sales_order/create")
  postSalesOrder(@Body() body: {}): Promise<{}> {
    return this.appService.postSalesOrder(body)
  }

  @Get("api/dashboard")
  dashboard(@Query() query: {}): Promise<{}> {
    return this.appService.getDashboard(query)
  }

} 
