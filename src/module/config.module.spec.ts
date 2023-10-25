import { setupNestApplication } from 'test/toolkit'
import { ConfigMock, InnerModule, InvalidServiceHostConfigMock, InvalidServicePortConfigMock, NodeEnv } from './mocks'
import { ConfigService } from './config.service'
import { ConfigModule } from './config.module'
import { Test, TestingModuleBuilder } from '@nestjs/testing'

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
    // eslint-disable-next-line functional/no-let
    let builder: TestingModuleBuilder

    beforeEach(() => {
        builder = Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    config: ConfigMock
                })
            ]
        })
    })

    it('expects to compile and init application', async () => {
        const instance = await builder.compile()
        const app = instance.createNestApplication()
        const result = await app.init().catch(error => error)

        expect(result).not.toBeInstanceOf(Error)
    })

    it('expects to compile and fail to init application', async () => {
        builder = Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    config: ConfigMock
                }),
                ConfigModule.forFeature({
                    config: [InvalidServiceHostConfigMock, InvalidServicePortConfigMock]
                })
            ]
        })

        const instance = await builder.compile()
        const app = instance.createNestApplication()
        const result = await app.init().catch(error => error)

        expect(result).toBeInstanceOf(Error)
    })

    it('expects to compile and init application', async () => {
        builder = Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    config: ConfigMock
                }),
                InnerModule
            ]
        })

        const instance = await builder.compile()
        const app = instance.createNestApplication()
        const result = await app.init().catch(error => error)

        expect(result).not.toBeInstanceOf(Error)
    })
})
