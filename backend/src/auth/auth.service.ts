import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, User } from 'entity/entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Product) private readonly ProductRepository: Repository<Product>,
        @InjectRepository(User) private readonly UserRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async login(username: string, password: string): Promise<{}> {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await this.UserRepository.findOne({ where: { user_id: username } })
        if (user !== null) {
            const comparePassword = bcrypt.compare(user.password, hashedPassword)
            if (comparePassword) {
                const token = await this.generateToken(user.user_id, user.password)
                return { access_token: token }
            } else {
                return { message: "Password Not Match!" }
            }
        } else {
            return { message: "Invalid User!" }
        }
    }

    async generateToken(username: string, password: string): Promise<{}> {
        return this.jwtService.sign({ username, password })
    }

    async validateToken(token:string): Promise<{}> {
        console.log("test",this.jwtService.verify(token))
        return
    }
}
