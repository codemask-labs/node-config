import { HttpConfig, NodeConfig } from 'example/config'
import { getConfigValue } from './get-config-value'

describe('getConfigValue', () => {
    it('returns a specific value from config using a getter', () => {
        const port = getConfigValue(HttpConfig, config => config.HTTP_SERVICE_PORT)

        expect(port).toEqual(3000)
    })

    it('returns a string value from config', () => {
        const host = getConfigValue(HttpConfig, config => config.HTTP_SERVICE_HOST)

        expect(host).toEqual('0.0.0.0')
    })

    it('returns a value from a dependency config', () => {
        const env = getConfigValue(HttpConfig, config => config.node.environment)

        expect(env).toBeDefined()
    })

    it('returns a method result via getter', () => {
        const port = getConfigValue(HttpConfig, config => config.getHttpServicePort())

        expect(port).toEqual(3000)
    })

    it('works with a config that has no dependencies', () => {
        const env = getConfigValue(NodeConfig, config => config.environment)

        expect(env).toBeDefined()
    })
})
