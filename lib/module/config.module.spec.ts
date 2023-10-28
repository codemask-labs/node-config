import { setupNestApplication } from 'lib/test'
import { ConfigModule } from './config.module'
import { HttpConfig, NodeConfig } from 'example/config'
import { NodeEnv } from 'example/enums'
import { ConfigService } from '.'

describe('ConfigModule', () => {
    const { app } = setupNestApplication({
        imports: [
            ConfigModule.forRoot({
                provides: [NodeConfig],
                overrides: {
                    NODE_ENV: NodeEnv.Production
                    // HTTP_SERVICE_HOST: 'localhost',
                    // HTTP_SERVICE_PORT: 3000
                }
            })
        ]
    })

    test.todo('registering module config is validated')

    it('test', () => {
        console.log(app.get(ConfigService).get(NodeConfig))
        console.log(app.get(ConfigService).get(HttpConfig))
    })
})
