import { HttpConfig } from 'example/config'
import { useConfig } from './use-config'

describe('useConfig hook', () => {
    it('returns instance of http config', () => {
        const config = useConfig(HttpConfig)

        expect(config).toBeInstanceOf(HttpConfig)
        expect(config).toEqual({
            HTTP_SERVICE_HOST: '0.0.0.0',
            HTTP_SERVICE_PORT: 3000,
            node: {
                environment: 'test'
            }
        })
    })
})
