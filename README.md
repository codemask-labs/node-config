# Codemask Nestjs Config Module

## How to Install

### Installing peer dependencies

> [!NOTE]
> If your project already uses @nestjs/common, class-validator and/or class-transformer - then skip installing mentioned peer dependencies.

```bash
$ yarn add @nestjs/common class-validator class-transformer
```

### Installing Package
```bash
$ yarn add @codemaskjs/nestjs-config
```

## Configuration

### Configuring ConfigModule for root

For adding globally available configs, use the example from below:

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@codemaskjs/nestjs-config'

@Module({
    imports: [
        ConfigModule.forFeature({
            config: <your config class>
        })
    ]
})
export class MailerModule {}
```

## Examples

1. Config Class

The `ConfigModule` allows to register classes only and are being mapped during runtime with `process.env` and `dotenv` variables.

> [!NOTE]
> Config classes supports `class-transformer` and `class-validator` decorators internally, allowing to shape configs to your needs.

```typescript
import { IsInt, IsOptional, IsString } from 'class-validator'

export class HttpConfig {
    @IsOptional()
    @IsInt()
    readonly HTTP_SERVICE_PORT: number = 3000

    @IsOptional()
    @IsString()
    readonly HTTP_SERVICE_HOST: string = '0.0.0.0'
}
```

2. Config Module

### Using `forRoot`

The `ConfigModule.forRoot(options)` requires `config` as an option to globally register `Config Class` or array of `Config Classes` (optioned, and true by default) - for use within Nestjs injection on runtime. The `Config Class` is then shared across other modules and treated as a base for scoped `forFeature` (you can read more about `forFeature` below).

```typescript
ConfigModule.forRoot({
    config: HttpConfig // or [HttpConfig, OtherConfig, ...]
})
```

### Using `forFeature`

The `ConfigModule.forFeature(options)` requires `config` as an option to extend the `base for root configurations` and provides isolated config accessible with `ConfigService.get(<Class>)`.

> [!NOTE]
> Registered configurations with `for feature` are only available within the import scope of your module.

```typescript
ConfigModule.forFeature({
    config: ScopedDatabaseConfig // or [ScopedDatabaseConfig, ExampleConfig, ...]
})
```

### Using `forFeature` with `TypeOrm`

#### lib/config/typeorm.config.ts
```typescript
import { IsBoolean, IsEnum, IsInt, IsString } from 'class-validator'
import { TypeormConnection } from 'lib/enums'

export class TypeOrmConfig {
    @IsEnum(TypeormConnection)
    readonly TYPEORM_CONNECTION: TypeormConnection

    @IsString()
    readonly TYPEORM_HOST: string

    @IsInt()
    readonly TYPEORM_PORT: number

    @IsString()
    readonly TYPEORM_DATABASE: string

    @IsString()
    readonly TYPEORM_USERNAME: string

    @IsString()
    readonly TYPEORM_PASSWORD: string

    @IsBoolean()
    readonly TYPEORM_LOGGING: boolean
}
```

#### database.module.ts

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@codemaskjs/nestjs-config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfig } from 'lib/config'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [
                ConfigModule.forFeature({
                    config: TypeOrmConfig
                })
            ],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const { TYPEORM_CONNECTION, TYPEORM_HOST, TYPEORM_PORT, TYPEORM_USERNAME, TYPEORM_PASSWORD, TYPEORM_DATABASE, TYPEORM_LOGGING } = configService.get(TypeOrmConfig)

                return {
                    type: TYPEORM_CONNECTION,
                    host: TYPEORM_HOST,
                    port: TYPEORM_PORT,
                    username: TYPEORM_USERNAME,
                    password: TYPEORM_PASSWORD,
                    database: TYPEORM_DATABASE,
                    entities: Object.values({}),
                    migrations: Object.values({}),
                    synchronize: false,
                    migrationsRun: true,
                    autoLoadEntities: true,
                    logging: TYPEORM_LOGGING ? 'all' : undefined
                }
            }
        })
    ]
})
export class DatabaseModule {}
```

3. Config Service

The `ConfigService` is a injectable service for accessing config classes within respectable scope.

```typescript
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@codemaskjs/nestjs-config'

@Injectable()
export class MyService {
    constructor(private readonly configService: ConfigService) {
        this.configService.get(HttpConfig)
        // or, if `for feature` has additionally provided `ExampleConfig` within this service module, then we can as well use the following:
        this.configService.get(ExampleConfig)
    }
}

```
