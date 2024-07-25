import { IsEnum } from 'class-validator'
import { Config } from 'lib/decorators'
import { NodeEnv } from 'example/enums'

@Config()
export class NodeConfig {
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv

    getTest() {
        return 'hello world'
    }
}
