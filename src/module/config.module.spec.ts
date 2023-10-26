import { setupNestApplication } from 'test/toolkit'
import { ConfigMock, InnerModule, NodeEnv } from './mocks'
import { ConfigService } from './config.service'
import { ConfigModule } from './config.module'

describe('ConfigModule - for root', () => {
    const { app } = setupNestApplication({
        imports: [
            ConfigModule.forRoot({
                config: ConfigMock
            })
        ]
    })

    it('expect config service to be defined', () => {
        const service = app.get(ConfigService)

        expect(service).toBeDefined()
    })

    it('expect ConfigMock to be defined', () => {
        const service = app.get(ConfigService)
        const config = service.get(ConfigMock)

        expect(config).toBeDefined()
        expect(config.NODE_ENV).toBe(NodeEnv.Test)
    })
})

describe('ConfigModule - for feature', () => {
    const { app } = setupNestApplication({
        imports: [
            ConfigModule.forRoot({
                config: ConfigMock
            }),
            InnerModule
        ]
    })

    it('expect config service to be defined', () => {
        const service = app.get(ConfigService)

        expect(service).toBeDefined()
    })
})
