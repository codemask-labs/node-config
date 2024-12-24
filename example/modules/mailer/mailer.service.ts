import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { MailerConfig } from 'example/config'
import { getConfig } from 'lib/getters'

@Injectable()
export class MailerService implements OnApplicationBootstrap {
    private readonly config = getConfig(MailerConfig)

    onApplicationBootstrap() {
        console.debug('mailer config:', this.config)
    }
}
