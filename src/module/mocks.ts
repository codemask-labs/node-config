/* eslint-disable max-classes-per-file */
import { Injectable, Module } from '@nestjs/common'
import { IsEnum, IsNumber, IsString } from 'class-validator'
import { ConfigModule, ConfigService } from '.'

export enum NodeEnv {
    Test = 'test',
}

export class ConfigMock {
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv
}

export class ServicePortConfigMock {
    @IsNumber()
    readonly SERVICE_PORT: number
}

export class ServiceHostConfigMock {
    @IsNumber()
    readonly SERVICE_HOST: number
}

export class OtherConfigMock {
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv

    @IsString()
    readonly HELLO_WORLD: string = 'foo'
}

@Injectable()
export class InnerService {
    constructor(configService: ConfigService) {
        const config = configService.get(OtherConfigMock)

        console.log(config)
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
