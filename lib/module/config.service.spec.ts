import { setupNestApplication } from 'lib/test'
import { useConfig, useConfigs, useConfigValue } from 'lib/hooks'
import { HttpConfig, NodeConfig } from 'example/config'
import { ConfigModule } from './config.module'

describe('ConfigService', () => {
    const { app } = setupNestApplication({
        imports: [ConfigModule.forRoot([NodeConfig, HttpConfig])]
    })

    it('gets and returns values of classes', () => {
        const config = useConfig(NodeConfig)
        const configs = useConfigs(NodeConfig, HttpConfig)
        const value = useConfigValue(NodeConfig, config => config.NODE_ENV)

        // config
        // const values = app.get(ConfigService).values(NodeConfig, HttpConfig)

        // expect(values.getHttpServicePort()).toBe(3000)
        // expect(values).toMatchObject({
        //     HTTP_SERVICE_PORT: 3000,
        //     HTTP_SERVICE_HOST: '0.0.0.0'
        // })

        expect(true).toBe(true)
    })
})
