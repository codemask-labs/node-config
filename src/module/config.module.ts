import { DynamicModule, Module, OptionalFactoryDependency, Provider } from '@nestjs/common'
import { ConfigModuleRootOptions, ConfigModuleFeatureOptions } from './types'
import { ConfigService } from './config.service'

@Module({})
export class ConfigModule {
    constructor() {
        console.log('constructing config module')
    }

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
            exports: [provider]
        }
    }

    static forFeature({ config }: ConfigModuleFeatureOptions) {
        const parent: OptionalFactoryDependency = {
            token: ConfigService,
            optional: true
        }
        const provider: Provider = {
            provide: ConfigService,
            useFactory: (parent?: ConfigService) => new ConfigService(config, { parent }),
            inject: [parent]
        }

        return {
            module: ConfigModule,
            providers: [provider],
            exports: [provider]
        }
    }
}
