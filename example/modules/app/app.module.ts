import { Module } from '@nestjs/common'
import { ConfigModule } from 'lib/module'
import { HttpConfig, NodeConfig } from 'example/config'
import { UsersModule } from '../users'
import { MailerModule } from '../mailer'

@Module({
    imports: [
        ConfigModule.forRoot({
            provides: [
                NodeConfig,
                HttpConfig
            ]
        }),
        MailerModule,
        UsersModule
    ]
})
export class AppModule {}
