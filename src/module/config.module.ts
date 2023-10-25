import { DynamicModule, Module, Provider } from '@nestjs/common'
import { ConfigModuleRootOptions, ConfigModuleFeatureOptions } from 'lib/types'
import { ConfigService } from './config.service'

@Module({})
export class ConfigModule {
    static forRoot(options: ConfigModuleRootOptions): DynamicModule {
        const { global, config } = options
        const configs = Array.isArray(config) ? config : [config]
        const configMap = new Map(configs.map(constructor => [constructor, new constructor()]))
        const provider: Provider = {
            provide: ConfigService,
            useFactory: () => new ConfigService(configMap)
        }

        return {
            global: global ?? true,
            module: ConfigModule,
            providers: [provider],
            exports: [ConfigService]
        }
    }

    static forFeature({ config }: ConfigModuleFeatureOptions) {
        const configs = Array.isArray(config) ? config : [config]
        const configMap = new Map(configs.map(constructor => [constructor, new constructor()]))
        const provider: Provider = {
            provide: ConfigService,
            inject: [
                { token: ConfigService, optional: true }
            ],
            useFactory: (configService?: ConfigService) => new ConfigService(
                configService
                    ? new Map([
                        ...Array.from(configService.getConfigMap().entries()),
                        ...Array.from(configMap.entries())
                    ])
                    : configMap
            )
        }

        return {
            module: ConfigModule,
            providers: [provider],
            exports: [ConfigService]
        }
    }
}
