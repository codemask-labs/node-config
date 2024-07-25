// import { config as dotenv } from 'dotenv'
import { ClassTransformOptions } from 'class-transformer'
import { Class } from './types'
import { CONFIG_WATERMARK } from './constants'

type RegisteredConfig = {
    dependencies: Array<Class>
    transformOptions?: ClassTransformOptions
}

export class ConfigRegistry {
    static registered = new Map<Class, RegisteredConfig>()

    static register(config: Class, transformOptions?: ClassTransformOptions) {
        if (this.registered.has(config)) {
            return
        }

        const dependencies: Array<Class> = Reflect.getMetadata('design:paramtypes', config) || []

        console.log('params:', dependencies)

        Reflect.defineMetadata(CONFIG_WATERMARK, true, config)

        this.registered.set(config, {
            dependencies,
            transformOptions
        })

        // const { parsed = {} } = dotenv({
        //     processEnv: {}
        // })

        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const injected = [] as Array<any>

        // const config = new config(...injected)
        // const properties = Object.getOwnPropertyNames(config)
        // const variables = { ...process.env, ...parsed }

        // console.log('parsed:', parsed)
        // console.log('properties:', properties)

        // const instanceVariables = !properties.length
        //     ? variables
        //     : properties.reduce(
        //           (result, key) => ({
        //               ...result,
        //               [key]: variables[key]
        //           }),
        //           {}
        //       )

        // console.log('instance variables:', instanceVariables)

        // const instance = plainToClass(config, instanceVariables, {
        //     enableImplicitConversion: true,
        //     exposeDefaultValues: true,
        //     ...options
        // })

        // this.instances.set(config, instance)
    }

    static getInstances(features: Array<Class>) {}
}
