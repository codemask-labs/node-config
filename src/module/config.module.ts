import { DynamicModule, Module, Provider } from '@nestjs/common'
import { ConfigModuleRootOptions, ConfigModuleFeatureOptions } from 'lib/types'
import { ConfigService } from './config.service'

@Module({})
export class ConfigModule {
    static forRoot(options: ConfigModuleRootOptions): DynamicModule {
        const { global, config } = options
        const provider: Provider = {
            provide: ConfigService,
            useFactory: () => new ConfigService(config)
        }

        return {
            global: global ?? true,
            module: ConfigModule,
            providers: [provider],
            exports: [ConfigService]
        }
    }

    static forFeature({ config }: ConfigModuleFeatureOptions) {
        const provider: Provider = {
            provide: ConfigService,
            inject: [{ token: ConfigService, optional: true }],
            useFactory: (parent?: ConfigService) => new ConfigService(config, { parent })
        }

        return {
            module: ConfigModule,
            providers: [provider],
            exports: [ConfigService]
        }
    }
}
