import { ConfigRegistry } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Env = (environmentPropertyName: string) => (target: any, propertyName: string) => {
    ConfigRegistry.registerConfigDefaults(target.constructor)
    ConfigRegistry.registerConfigTransformTranslations(target.constructor, propertyName, environmentPropertyName)
}
