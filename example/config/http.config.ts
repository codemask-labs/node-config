import { IsInt, IsOptional, IsString } from 'class-validator'

export class HttpConfig {
    @IsOptional()
    @IsInt()
    readonly HTTP_SERVICE_PORT: number = 3000

    @IsOptional()
    @IsString()
    readonly HTTP_SERVICE_HOST: string = '0.0.0.0'
}
