import { Module } from '@nestjs/common'
import { ConfigModule } from 'lib/module'
import { MailerConfig } from 'example/config'
import { MailerService } from './mailer.service'

@Module({
    providers: [MailerService],
    imports: [
        ConfigModule.forFeature([MailerConfig])
    ]
})
export class MailerModule {}
