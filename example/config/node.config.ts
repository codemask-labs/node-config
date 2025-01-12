import { IsEnum } from 'class-validator'
import { NodeEnv } from 'example/enums'
import { Config, Env } from 'lib/decorators'

@Config()
export class NodeConfig {
    @IsEnum(NodeEnv)
    @Env('NODE_ENV')
    readonly environment: NodeEnv

    getNodeEnv() {
        return this.environment
    }
}
