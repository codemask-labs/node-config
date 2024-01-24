import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from 'lib/module'
import { MailerConfig } from 'example/config'

@Injectable()
export class MailerService implements OnApplicationBootstrap {
    private readonly config: MailerConfig

    constructor(private readonly configService: ConfigService) {
        this.config = this.configService.get(MailerConfig)
    }

    onApplicationBootstrap() {
        // console.debug('mailer config:', this.config)
    }
}
