import { IsEnum, IsString } from 'class-validator'
import { NodeEnv } from 'example/enums'

export class NodeConfig {
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv

    @IsString()
    readonly RANDOM_KEY: string
}
