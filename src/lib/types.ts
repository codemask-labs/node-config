/* eslint-disable @typescript-eslint/no-explicit-any */
export type ClassConstructor<TConstructor = any> = new (...args: Array<any>) => TConstructor
export type ConfigMap = Map<ClassConstructor, any>

export type ConfigModuleRootOptions = {
    /**
     * @description when set to `true` config (or configs) are registered globally
     * @default true
     */
    global?: boolean

    /**
     * @description config class constructor or array of config class constructors
     */
    config: ClassConstructor<any> | Array<ClassConstructor<any>>
}

export type ConfigModuleFeatureOptions = {
    /**
     * @description config class constructor or array of config class constructors
     */
    config: ClassConstructor<any> | Array<ClassConstructor<any>>
}
