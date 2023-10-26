import { Injectable } from '@nestjs/common'
import { ConfigService } from 'module/config.service'

@Injectable()
export class UsersService {
    constructor(configService: ConfigService) {
        console.log('users service:', configService)
    }
}
