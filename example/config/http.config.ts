import { IsInt, IsOptional, IsString } from 'class-validator'
import { Config } from 'lib/decorators'
import { NodeConfig } from './node.config'

@Config()
export class HttpConfig {
    @IsOptional()
    @IsInt()
    readonly HTTP_SERVICE_PORT: number = 3000

    @IsOptional()
    @IsString()
    readonly HTTP_SERVICE_HOST: string = '0.0.0.0'

    constructor(readonly node: NodeConfig) {}

    getHttpServicePort() {
        return this.HTTP_SERVICE_PORT
    }

    getNodeEnv() {
        return this.node.getNodeEnv()
    }
}
