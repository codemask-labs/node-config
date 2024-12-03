import { NestFactory } from '@nestjs/core'
import { HttpConfig } from 'example/config'
import { AppModule } from 'example/modules'
import { useConfig } from 'lib/hooks'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)

    const { HTTP_SERVICE_HOST, HTTP_SERVICE_PORT } = useConfig(HttpConfig)

    await app.listen(HTTP_SERVICE_PORT, HTTP_SERVICE_HOST)
}

bootstrap()
