/* eslint-disable max-classes-per-file */
import { Injectable, Module } from '@nestjs/common'
import { IsEnum, IsNumber } from 'class-validator'
import { ConfigModule, ConfigService } from '.'

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

@Injectable()
export class InnerService {
    constructor(configService: ConfigService) {
        console.log('inner service:', configService)
    }
}

@Module({
    imports: [
        ConfigModule.forFeature({
            config: OtherConfigMock
        })
    ],
    providers: [InnerService]
})
export class InnerModule {}
