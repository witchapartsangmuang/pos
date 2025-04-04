import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("api/login")
    async login(@Body() body: any): Promise<{}> {
        const { username, password } = body.body
        return await this.authService.login(username, password)
    }
    @Post("api/verify")
    async verify(@Body() body: any): Promise<{}> {
        return await this.authService.validateToken(body.body)
    }
}
