import { Module } from '@nestjs/common'
import { MailerConfig } from 'lib/config'
import { ConfigModule } from 'module/config.module'
import { MailerService } from './mailer.service'

@Module({
    providers: [MailerService],
    imports: [
        ConfigModule.forFeature({
            config: MailerConfig
        })
    ]
})
export class MailerModule {}
