import { IsBooleanString, IsEnum, IsInt, IsString } from 'class-validator'
import { TypeormConnection } from 'lib/enums'

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
    readonly TYPEORM_USERNAME: string

    @IsString()
    readonly TYPEORM_PASSWORD: string

    @IsBooleanString()
    readonly TYPEORM_LOGGING: boolean
}
