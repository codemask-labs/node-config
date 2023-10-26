import { IsBooleanString, IsInt, IsString } from 'class-validator'

export class MailerConfig {
    @IsString()
    readonly MAILER_HOST: string

    @IsInt()
    readonly MAILER_PORT: number

    @IsString()
    readonly MAILER_FROM: string

    @IsBooleanString()
    readonly MAILER_SECURE: boolean

    @IsString()
    readonly MAILER_AUTH_EMAIL: string

    @IsString()
    readonly MAILER_AUTH_PASSWORD: string
}
