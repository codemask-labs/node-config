import { randomUUID } from 'node:crypto'
import { Module, DynamicModule } from '@nestjs/common'
import { Class } from './types'
import { getEnvironmentVariables } from './utils'
import { ConfigService } from './config.service'

@Module({})
export class ConfigModule {
    static forRoot<Providers extends Array<Class>>(providers?: Providers): DynamicModule {
        return {
            global: true,
            module: ConfigModule,
            providers: [
                {
                    provide: 'GLOBAL_CONFIG_MAP',
                    useValue: new Map()
                },
                {
                    provide: 'GLOBAL_ENVIRONMENT_VARIABLES',
                    useValue: getEnvironmentVariables()
                },
                ConfigService,
                {
                    provide: randomUUID(),
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        configService.add(providers || []).validate(providers || [])
                    }
                }
            ],
            exports: [ConfigService]
        }
    }

    static forFeature<Providers extends Array<Class>>(providers: Providers): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: randomUUID(),
                    useFactory: (configService?: ConfigService) => {
                        if (!configService) {
                            throw new Error('Failed to find ConfigService. Have you registered ConfigModule.forRoot()?')
                        }

                        return configService.add(providers).validate(providers)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static forTest<Config>(provider: Class<Config>, overrides?: Partial<Config>): DynamicModule {
        return {
            global: true,
            module: ConfigModule,
            providers: [
                {
                    provide: 'GLOBAL_CONFIG_MAP',
                    useValue: new Map()
                },
                {
                    provide: 'GLOBAL_ENVIRONMENT_VARIABLES',
                    useValue: getEnvironmentVariables()
                },
                {
                    provide: 'CONFIG_PROVIDERS',
                    useValue: [provider]
                },
                ConfigService,
                {
                    provide: randomUUID(),
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        configService.add([provider])
                        configService.override(provider, overrides)
                        configService.validate([provider])
                    }
                }
            ],
            exports: [ConfigService]
        }
    }
}
