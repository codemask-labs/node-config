import { Module } from '@nestjs/common'
import { UsersModule } from '../users'
import { MailerModule } from '../mailer'

@Module({
    imports: [MailerModule, UsersModule]
})
export class AppModule {}
