import { v4 } from 'uuid'
import { Module, DynamicModule, FactoryProvider, ValueProvider } from '@nestjs/common'
import { ConfigModuleRootOptions, ConfigModuleFeatureOptions } from './types'
import { ConfigService } from './config.service'
import { GLOBAL_CONFIG_SERVICE_TOKEN } from './constants'

@Module({})
export class ConfigModule {
    static forRoot({ global, ...options }: ConfigModuleRootOptions): DynamicModule {
        const providers = this.createConfigProvidersForRoot(options)

        return {
            global: global ?? true,
            module: ConfigModule,
            providers,
            exports: providers.map(({ provide }) => provide)
        }
    }

    static forFeature(options: ConfigModuleFeatureOptions): DynamicModule {
        const providers = this.createConfigProvidersForFeature(options)

        return {
            module: ConfigModule,
            providers,
            exports: providers.map(({ provide }) => provide)
        }
    }

    private static createConfigProvidersForRoot({ config }: ConfigModuleRootOptions): Array<ValueProvider | FactoryProvider> {
        return [
            {
                provide: GLOBAL_CONFIG_SERVICE_TOKEN,
                useValue: new ConfigService(config)
            },
            {
                provide: ConfigService,
                useFactory: (service: ConfigService) => service,
                inject: [GLOBAL_CONFIG_SERVICE_TOKEN]
            }
        ]
    }

    private static createConfigProvidersForFeature({ config }: ConfigModuleFeatureOptions): Array<ValueProvider | FactoryProvider> {
        const configMapToken = v4()

        return [
            {
                provide: configMapToken,
                useFactory: (parent?: ConfigService) => new ConfigService(config, { parentConfigMap: parent }),
                inject: [
                    {
                        optional: true,
                        token: GLOBAL_CONFIG_SERVICE_TOKEN
                    }
                ]
            },
            {
                provide: ConfigService,
                useFactory: (service: ConfigService) => service,
                inject: [configMapToken]
            }
        ]
    }
}
