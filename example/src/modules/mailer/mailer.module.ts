import { Module } from '@nestjs/common'
import { MailerConfig } from 'lib/config'
import { ConfigModule } from 'module/config.module'

@Module({
    imports: [
        ConfigModule.forFeature({
            config: MailerConfig
        })
    ]
})
export class MailerModule {}
