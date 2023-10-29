import { setupNestApplication } from 'lib/test'
import { ConfigModule } from './config.module'
import { HttpConfig, NodeConfig } from 'example/config'
import { NodeEnv } from 'example/enums'
import { ConfigService } from '.'

describe('ConfigModule', () => {
    describe('forRoot', () => {
        const { app } = setupNestApplication({
            imports: [
                ConfigModule.forRoot({
                    provides: [HttpConfig, NodeConfig],
                    overrides: {
                        NODE_ENV: NodeEnv.Production,
                        HTTP_SERVICE_HOST: 'localhost',
                        HTTP_SERVICE_PORT: 3000
                    }
                })
            ]
        })

        it('registering valid configs', () => {
            const nodeConfig = app.get(ConfigService).get(NodeConfig)
            const httpConfig = app.get(ConfigService).get(HttpConfig)

            expect(nodeConfig).toEqual({ NODE_ENV: NodeEnv.Production })
            expect(httpConfig).toEqual({ HTTP_SERVICE_HOST: 'localhost', HTTP_SERVICE_PORT: 3000 })
        })
    })

    describe('forFeature', () => {
        const { app } = setupNestApplication({
            imports: [
                ConfigModule.forFeature({
                    provides: [HttpConfig, NodeConfig],
                    overrides: {
                        NODE_ENV: NodeEnv.Production,
                        HTTP_SERVICE_HOST: 'localhost',
                        HTTP_SERVICE_PORT: 3000
                    }
                })
            ]
        })

        it('registering valid configs', () => {
            const nodeConfig = app.get(ConfigService).get(NodeConfig)
            const httpConfig = app.get(ConfigService).get(HttpConfig)

            expect(nodeConfig).toEqual({ NODE_ENV: NodeEnv.Production })
            expect(httpConfig).toEqual({ HTTP_SERVICE_HOST: 'localhost', HTTP_SERVICE_PORT: 3000 })
        })
    })
})
