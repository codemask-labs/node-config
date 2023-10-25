/* eslint-disable max-classes-per-file */
import { Module } from '@nestjs/common'
import { IsEnum, IsNumber } from 'class-validator'
import { ConfigModule } from '.'

export enum NodeEnv {
    Test = 'test',
}

export class ConfigMock {
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv
}

export class InvalidServicePortConfigMock {
    @IsNumber()
    readonly SERVICE_PORT: number
}

export class InvalidServiceHostConfigMock {
    @IsNumber()
    readonly SERVICE_HOST: number
}

export class OtherConfigMock {
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv
}

@Module({
    imports: [
        ConfigModule.forFeature({
            config: OtherConfigMock
        })
    ]
})
export class InnerModule {}
