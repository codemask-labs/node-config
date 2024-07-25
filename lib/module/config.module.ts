import { randomUUID } from 'node:crypto'
import { Module, DynamicModule, OnModuleInit, Logger } from '@nestjs/common'
import { Class } from './types'
import { GLOBAL_CONFIG_MAP } from './constants'
import { ConfigService } from './config.service'
import { ConfigRegistry } from './config.registry'

@Module({})
export class ConfigModule implements OnModuleInit {
    static logger = new Logger(ConfigModule.name)

    static forRoot<Features extends Array<Class>>(features: Features): DynamicModule {
        const instances = ConfigRegistry.getInstances(features)

        return {
            global: true,
            module: ConfigModule,
            providers: [
                {
                    provide: GLOBAL_CONFIG_MAP,
                    useValue: new Map()
                },
                ConfigService,
                {
                    provide: randomUUID(),
                    inject: [GLOBAL_CONFIG_MAP, ConfigService],
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    useFactory: (configMap?: Map<Class, any>, configService?: ConfigService) => {
                        if (!configService || !configMap) {
                            throw new Error(
                                'Failed to find ConfigService. Have you registered ConfigModule.forRoot() or ConfigModule.forRootAsync()?'
                            )
                        }

                        instances.pipe(configMap)
                    }
                }
            ],
            exports: [GLOBAL_CONFIG_MAP, ConfigService]
        }
    }

    static forRootAsync<Features extends Array<Class>>({ features }: { features: Features }): DynamicModule {
        const configInstances = features.map(config => ({ config, instance: {} }))

        return {
            global: true,
            module: ConfigModule,
            providers: [
                {
                    provide: GLOBAL_CONFIG_MAP,
                    useValue: new Map()
                },
                {
                    provide: ConfigService,
                    inject: [GLOBAL_CONFIG_MAP],
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    useFactory: (configMap: Map<Class, any>) => {
                        configInstances.forEach(({ config, instance }) => {
                            configMap.set(config, instance)
                        })

                        return new ConfigService(configMap)
                    }
                }
            ]
        }
    }

    static forFeature<Configs extends Array<Class>>(configs: Configs): DynamicModule {
        const configInstances = configs.map(config => ({ config, instance: {} }))

        return {
            module: ConfigModule,
            providers: [
                {
                    provide: randomUUID(),
                    inject: [
                        { optional: true, token: GLOBAL_CONFIG_MAP },
                        { optional: true, token: ConfigService }
                    ],
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    useFactory: (configMap?: Map<Class, any>, configService?: ConfigService) => {
                        if (!configService || !configMap) {
                            throw new Error(
                                'Failed to find ConfigService. Have you registered ConfigModule.forRoot() or ConfigModule.forRootAsync()?'
                            )
                        }

                        configInstances.forEach(({ config, instance }) => {
                            configMap.set(config, instance)
                        })
                    }
                }
            ]
        }
    }

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // static forTest<Config>(provider: Class<Config>, overrides?: Partial<Config>): DynamicModule {
    //     return {
    //         global: true,
    //         module: ConfigModule,
    //         providers: [
    //             {
    //                 provide: GLOBAL_CONFIG_MAP,
    //                 useValue: new Map()
    //             },
    //             {
    //                 provide: 'GLOBAL_ENVIRONMENT_VARIABLES',
    //                 useValue: getEnvironmentVariables()
    //             },
    //             {
    //                 provide: 'CONFIG_PROVIDERS',
    //                 useValue: [provider]
    //             },
    //             ConfigService,
    //             {
    //                 provide: randomUUID(),
    //                 inject: [ConfigService],
    //                 useFactory: (configService: ConfigService) => {
    //                     configService.add([provider])
    //                     configService.override(provider, overrides)
    //                     configService.validate([provider])
    //                 }
    //             }
    //         ],
    //         exports: [ConfigService]
    //     }
    // }

    async onModuleInit() {
        console.log('on module init')

        throw new Error('debug')

        // const validations = providers.map(provider => {
        //     const config = this.features.get(provider)

        //     if (!config) {
        //         throw new ConfigServiceException(`${ConfigServiceError.CONFIG_NOT_FOUND}: [class ${provider.name}]`)
        //     }

        //     return {
        //         provider,
        //         errors: validateSync(config)
        //     }
        // })

        // if (validations.some(config => config.errors.length)) {
        //     validations.forEach(config => {
        //         if (!config.errors.length) {
        //             return
        //         }

        //         this.logger.error(`Failed to validate config [class ${config.provider.name}]:`)

        //         config.errors.forEach(error =>
        //             Object.entries(error.constraints || {}).forEach(
        //                 // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //                 ([_, message]) => {
        //                     this.logger.error(`\x1b[31m└─ \x1b[90m${message} (found: ${error.value})\x1b[0m`)
        //                 }
        //             )
        //         )
        //     })

        //     throw new ConfigServiceException(ConfigServiceError.CONFIG_VALIDATION_ERRORS)
        // }
    }
}
