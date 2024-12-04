import { Class } from 'lib/common'
import { ConfigRegistry } from 'lib/module'

export const Config =
    <T>() =>
    (config: Class<T>) =>
        ConfigRegistry.register(config)
