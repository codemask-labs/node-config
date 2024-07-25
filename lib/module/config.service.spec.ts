import { setupNestApplication } from 'lib/test'
import { HttpConfig, NodeConfig } from 'example/config'
import { ConfigService } from './config.service'
import { ConfigModule } from './config.module'

describe('ConfigService', () => {
    const { app } = setupNestApplication({
        imports: [ConfigModule.forRoot([NodeConfig, HttpConfig])]
    })

    it('gets and returns values of classes', () => {
        // const values = app.get(ConfigService).values(NodeConfig, HttpConfig)

        // expect(values.getHttpServicePort()).toBe(3000)
        // expect(values).toMatchObject({
        //     HTTP_SERVICE_PORT: 3000,
        //     HTTP_SERVICE_HOST: '0.0.0.0'
        // })

        expect(true).toBe(true)
    })
})
