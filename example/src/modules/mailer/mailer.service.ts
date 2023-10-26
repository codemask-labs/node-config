import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { MailerConfig } from 'lib/config'
import { ConfigService } from 'src'

@Injectable()
export class MailerService implements OnApplicationBootstrap {
    private readonly config: MailerConfig

    constructor(private readonly configService: ConfigService) {
        this.config = this.configService.get(MailerConfig)
    }

    onApplicationBootstrap() {
        console.debug('mailer config:', this.config)
    }
}
