import { IsBoolean, IsEnum, IsInt, IsString, MaxLength } from 'class-validator'
import { TypeormConnection } from 'example/enums'
import { Config } from 'lib/decorators'
import { NodeConfig } from './node.config'
import { Transform } from 'class-transformer'

@Config()
export class TypeormConfig {
    @IsEnum(TypeormConnection)
    readonly TYPEORM_CONNECTION: TypeormConnection

    @IsString()
    readonly TYPEORM_HOST: string

    @IsInt()
    readonly TYPEORM_PORT: number

    @IsString()
    readonly TYPEORM_DATABASE: string

    @IsString()
    @MaxLength(100)
    readonly TYPEORM_USERNAME: string

    @IsString()
    readonly TYPEORM_PASSWORD: string

    @IsBoolean()
    readonly TYPEORM_LOGGING: boolean

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly TYPEORM_DEBUG: boolean

    constructor(readonly nodeConfig: NodeConfig) {
        console.log('node config:', nodeConfig)
    }
}
