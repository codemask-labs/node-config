import { IsEnum } from 'class-validator'

export enum NodeEnv {
    Test = 'test',
}

export class ConfigMock {
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv
}
