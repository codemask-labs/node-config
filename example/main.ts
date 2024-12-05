import { NestFactory } from '@nestjs/core'
import { HttpConfig, NodeConfig } from 'example/config'
import { AppModule } from 'example/modules'
import { useConfig, useConfigs, useConfigValue } from 'lib/hooks'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)

    const { HTTP_SERVICE_HOST, HTTP_SERVICE_PORT } = useConfig(HttpConfig)

    const test = useConfigs(HttpConfig, NodeConfig)

    console.log(test.getHttpServicePort())

    const port = useConfigValue(HttpConfig, config => config.getHttpServicePort())

    console.log('port:', port)

    await app.listen(HTTP_SERVICE_PORT, HTTP_SERVICE_HOST)
}

bootstrap()
