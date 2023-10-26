import { IsEnum } from 'class-validator'
import { NodeEnv } from 'lib/enums'

export class NodeConfig {
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv
}
