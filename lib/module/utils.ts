import { config } from 'dotenv'

config()

export const getEnvironmentVariables = <T extends Record<string, string> = Record<string, string>>(): T => process.env as T
