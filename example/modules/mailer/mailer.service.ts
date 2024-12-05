import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { MailerConfig } from 'example/config'
import { useConfig } from 'lib/hooks'

@Injectable()
export class MailerService implements OnApplicationBootstrap {
    private readonly config = useConfig(MailerConfig)

    onApplicationBootstrap() {
        console.debug('mailer config:', this.config)
    }
}
