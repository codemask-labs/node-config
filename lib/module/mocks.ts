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
    @IsString()
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
    private readonly config: OtherConfigMock

    constructor(configService: ConfigService) {
        this.config = configService.get(OtherConfigMock)
    }

    throwErrorIfNotInTest() {
        if (this.config.NODE_ENV !== NodeEnv.Test) {
            throw new Error('Undefined Behaviour')
        }
    }
}

@Module({
    imports: [
        ConfigModule.forFeature({
            provides: [OtherConfigMock]
        })
    ],
    providers: [InnerService]
})
export class InnerModule {}

@Module({
    imports: [
        ConfigModule.forFeature({
            provides: [OtherConfigMock, ServiceHostConfigMock, ServicePortConfigMock]
        })
    ],
    providers: [InnerService]
})
export class AllModule {}
