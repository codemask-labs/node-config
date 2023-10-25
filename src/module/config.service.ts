import { Injectable } from '@nestjs/common'
import { ClassConstructor } from 'lib/types'

@Injectable()
export class ConfigService {
    constructor(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private readonly configMap: Map<ClassConstructor<any>, any>
    ) {}

    get<TConfigClass>(config: ClassConstructor<TConfigClass>): TConfigClass {
        if (!this.configMap.has(config)) {
            throw new Error(`Config (${config}) is not found or has not been registered correctly using ConfigModule.forRoot() or ConfigModule.forFeature()`)
        }

        return this.configMap.get(config)
    }

    getConfigMap() {
        return this.configMap
    }
}
