import { registerConfigDefaults, registerConfigTransformTranslations } from 'lib/module'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Env = (environmentPropertyName: string) => (target: any, propertyName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    registerConfigDefaults(target.constructor)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    registerConfigTransformTranslations(target.constructor, propertyName, environmentPropertyName)
}
