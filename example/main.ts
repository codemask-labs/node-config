import { NestFactory } from '@nestjs/core'
import { ConfigService } from 'lib/module'
import { HttpConfig } from 'example/config'
import { AppModule } from 'example/modules'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)

    const { HTTP_SERVICE_HOST, HTTP_SERVICE_PORT } = app.get(ConfigService).get(HttpConfig)

    await app.listen(HTTP_SERVICE_PORT, HTTP_SERVICE_HOST)
}

bootstrap()
