import { NestFactory } from '@nestjs/core'
import { HttpConfig } from 'lib/config'
import { ConfigService } from 'module/config.service'
import { AppModule } from './modules/app'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)

    const { HTTP_SERVICE_HOST, HTTP_SERVICE_PORT } = app.get(ConfigService).get(HttpConfig)

    await app.listen(HTTP_SERVICE_PORT, HTTP_SERVICE_HOST)
}

bootstrap()
