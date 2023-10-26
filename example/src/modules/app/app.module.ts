import { Module } from '@nestjs/common'
import { HttpConfig, NodeConfig } from 'lib/config'
import { ConfigModule } from 'module/config.module'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            config: [
                NodeConfig,
                HttpConfig
            ]
        }),
        UsersModule
    ]
})
export class AppModule {}
