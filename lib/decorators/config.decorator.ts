import { TransformOptions } from 'class-transformer'
import { Class } from 'lib/common'
import { ConfigRegistry } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Config = (transformOptions?: TransformOptions) => (constructor: Class<any>) => {
    ConfigRegistry.registerConfigDefaults(constructor)
    ConfigRegistry.registerConfigTransformOptions(constructor, transformOptions)
}
