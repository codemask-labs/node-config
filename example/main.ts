import { NestFactory } from '@nestjs/core'
import { HttpConfig, NodeConfig } from 'example/config'
import { AppModule } from 'example/modules'
import { ConfigService } from 'lib/module'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)

    const { HTTP_SERVICE_HOST, HTTP_SERVICE_PORT } = app.get(ConfigService).get(HttpConfig)

    console.log(app.get(ConfigService).value(NodeConfig, 'RANDOM_KEY'))

    await app.listen(HTTP_SERVICE_PORT, HTTP_SERVICE_HOST)
}

bootstrap()
