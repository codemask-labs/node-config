import { DynamicModule, Module, Provider } from '@nestjs/common'
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
            exports: providers
        }
    }

    static forFeature(options: ConfigModuleFeatureOptions) {
        const providers = this.createConfigProvidersForFeature(options)

        return {
            module: ConfigModule,
            providers,
            exports: providers
        }
    }

    private static createConfigProvidersForRoot({ config }: ConfigModuleRootOptions): Array<Provider> {
        const service = new ConfigService(config)

        return [
            {
                provide: GLOBAL_CONFIG_SERVICE_TOKEN,
                useValue: service
            },
            {
                provide: ConfigService,
                useValue: service
            }
        ]
    }

    private static createConfigProvidersForFeature({ config }: ConfigModuleFeatureOptions): Array<Provider> {
        return [
            {
                provide: ConfigService,
                useFactory: (parent?: ConfigService) => new ConfigService(config, { parent }),
                inject: [
                    {
                        optional: true,
                        token: GLOBAL_CONFIG_SERVICE_TOKEN
                    }
                ]
            }
        ]
    }
}
