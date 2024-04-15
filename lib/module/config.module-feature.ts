import { Module } from '@nestjs/common'

@Module({})
export class ConfigModuleFeature {
    get [Symbol.name]() {
        return 'test'
    }
}
