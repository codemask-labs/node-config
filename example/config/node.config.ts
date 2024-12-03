import { IsEnum } from 'class-validator'
import { Config, Env } from 'lib/decorators'
import { NodeEnv } from 'example/enums'

@Config()
export class NodeConfig {
    @IsEnum(NodeEnv)
    @Env('NODE_ENV')
    readonly nodeEnv: NodeEnv

    getHelloWorld() {
        return 'hello world'
    }
}
