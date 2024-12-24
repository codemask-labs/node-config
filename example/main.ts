import { NestFactory } from '@nestjs/core'
import { HttpConfig } from 'example/config'
import { AppModule } from 'example/modules'
import { getConfig } from 'lib/getters'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)

    const { HTTP_SERVICE_HOST, HTTP_SERVICE_PORT } = getConfig(HttpConfig)

    await app.listen(HTTP_SERVICE_PORT, HTTP_SERVICE_HOST)
}

bootstrap()
