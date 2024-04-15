import { randomUUID } from 'node:crypto'
import { Module, DynamicModule, OnModuleInit } from '@nestjs/common'
import { Class } from './types'
import { getEnvironmentVariables } from './utils'
import { ConfigService } from './config.service'
import { ConfigFeatureModule } from './config.feature-module'

@Module({})
export class ConfigModule implements OnModuleInit {
    constructor(private readonly configService: ConfigService) {}

    static forRoot<Providers extends Array<Class>>(providers?: Providers): DynamicModule {
        const configMap = new Map()
        const environmentVariables = getEnvironmentVariables()
        const service = new ConfigService(configMap, environmentVariables).add(providers ?? [])

        return {
            global: true,
            module: ConfigModule,
            providers: [
                {
                    provide: 'GLOBAL_CONFIG_MAP',
                    useValue: configMap
                },
                {
                    provide: 'GLOBAL_ENVIRONMENT_VARIABLES',
                    useValue: environmentVariables
                },
                {
                    provide: ConfigService,
                    useValue: service
                }
            ],
            exports: [ConfigService]
        }
    }

    static forFeature<Providers extends Array<Class>>(providers: Providers): DynamicModule {
        return {
            module: ConfigFeatureModule,
            providers: [
                {
                    provide: randomUUID(),
                    useFactory: (configService?: ConfigService) => {
                        if (!configService) {
                            throw new Error('Failed to find ConfigService. Have you registered ConfigModule.forRoot()?')
                        }

                        return configService.add(providers)
                    },
                    inject: [
                        {
                            optional: true,
                            token: ConfigService
                        }
                    ]
                }
            ]
        }
    }

    onModuleInit() {
        const providers = this.configService.getProviders()

        this.configService.validate(providers)
    }
}
