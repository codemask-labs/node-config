import { Module } from '@nestjs/common'
import { HttpConfig, NodeConfig } from 'lib/config'
import { ConfigModule } from 'module/config.module'
import { UsersModule } from '../users'
import { MailerModule } from '../mailer'

@Module({
    imports: [
        ConfigModule.forRoot({
            config: [
                NodeConfig,
                HttpConfig
            ]
        }),
        MailerModule,
        UsersModule
    ]
})
export class AppModule {}
