import { TransformOptions } from 'class-transformer'
import { Class, registerConfigDefaults, registerConfigTransformOptions } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Config = (transformOptions?: TransformOptions) => (constructor: Class<any>) => {
    registerConfigDefaults(constructor)
    registerConfigTransformOptions(constructor, transformOptions)
}
