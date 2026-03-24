import { HttpConfig, NodeConfig } from 'example/config'
import { getConfig } from './get-config'

describe('getConfig hook', () => {
    it('returns instance of http config', () => {
        const config = getConfig(HttpConfig)

        const { getNodeEnv } = config

        expect(config).toBeInstanceOf(HttpConfig)
        expect(config.node).toBeInstanceOf(NodeConfig)
        expect(config.HTTP_SERVICE_HOST).toEqual('0.0.0.0')
        expect(config.HTTP_SERVICE_PORT).toEqual(3000)
        expect(getNodeEnv()).toEqual('test')
    })
})
