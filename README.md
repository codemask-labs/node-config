# Node Config

A utility library designed to simplify configuration management in TypeScript and Node.js applications. This library includes powerful decorators, validation features, and the `getConfig` function to effortlessly integrate and validate application configurations.

## Features

### 1. Simplified Configuration Management
- Define configurations as strongly typed classes with decorators for validation and transformation.
- Centralize configuration logic, making it easy to maintain and extend.

### 2. Type-Safe Configurations
- The `getConfig` function ensures type safety by mapping environment variables directly to configuration class properties.
- Automatically parses and validates properties against the defined class structure.

### 3. Validation with `class-validator`
- Use decorators like `@IsString`, `@IsEnum`, `@IsInt`, and `@IsBoolean` to enforce rules on configuration values.
- Validation errors provide meaningful feedback during development or runtime.

### 4. Dynamic Transformation with `class-transformer`
- Apply transformations (e.g., converting strings to booleans) seamlessly using decorators like `@Transform`.

### 5. Integration with Frameworks
- Built to integrate easily with frameworks like [NestJS](https://nestjs.com), enabling configuration classes to power dynamic module setups (e.g., database connections).

### 6. Environment Variable Handling
- Map environment variables to class properties effortlessly.
- Enforces clean and predictable configuration values from the environment.

### 7. Dependency injection between config classes
- Define constructor based injections, similiar to `Injectables` in Nestjs modules
- Synchronized resolve of dependent configurations within one class

### 8. Reads environment variables from .env files using dotenv
- Out-of-the-box integration with [dotenv](https://github.com/motdotla/dotenv) library for reading environment variables

## Installation

### yarn

```bash
yarn add @codemask-labs/node-config class-validator class-transformer
```

### npm

```bash
npm install @codemask-labs/node-config class-validator class-transformer
```

## API

### getConfig

```typescript
declare function getConfig(configClass: ClassType): ConfigInstance
```

Retrieves and validates an instance of the configuration class.

#### Parameters
- configClass: The configuration class with `@Config` and validation decorators applied.

#### Returns
- An instance of the validated configuration class.

### getConfigValue

```typescript
declare function getConfigValue<T extends ClassType, U>(configClass: T, getter: (config: T) => U): U
```

Retrieves and validates an instance of the configuration class, and passed through a `getter` to return a value.

#### Parameters
- configClass: The configuration class with `@Config` and validation decorators applied.
- getter: The getter function that runs synchronously on

#### Returns
- An value constructed by  of the validated configuration class.

### Env decorator

```typescript
declare function Env(propertyName: string): MethodDecorator
```

Maps process environment to class property by name, useful when you need to validate or transform environment variable and map it to other casing.

#### Parameters
- propertyName: The usually `process.env` key to a value

#### Retruns
- An class property decorator that can be used within a @Config decorated class.

## Usage

### Define a Configuration Class
Use decorators to define and validate configuration properties.

```typescript
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsString, MaxLength } from 'class-validator';
import { Config } from '@codemask-labs/node-config';
import { TypeormConnection } from 'example/enums';

@Config()
export class TypeormConfig {
    @IsEnum(TypeormConnection)
    readonly TYPEORM_CONNECTION: TypeormConnection;

    @IsString()
    readonly TYPEORM_HOST: string;

    @IsInt()
    readonly TYPEORM_PORT: number;

    @IsString()
    readonly TYPEORM_DATABASE: string;

    @IsString()
    @MaxLength(100)
    readonly TYPEORM_USERNAME: string;

    @IsString()
    readonly TYPEORM_PASSWORD: string;

    @IsBoolean()
    readonly TYPEORM_LOGGING: boolean;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly TYPEORM_DEBUG: boolean;
}

```

### Access Configuration in Code

Use the `getConfig` function to access and validate the configuration class.

```typescript
import { getConfig } from '@codemask-labs/node-config';
import { TypeormConfig } from 'example/config';

const config = getConfig(TypeormConfig);

console.log(config.TYPEORM_HOST); // Outputs the validated host value
```

### Example Integration with NestJS

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '@codemask-labs/node-config';
import { TypeormConfig } from 'example/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => {
                const {
                    TYPEORM_CONNECTION,
                    TYPEORM_HOST,
                    TYPEORM_PORT,
                    TYPEORM_USERNAME,
                    TYPEORM_PASSWORD,
                    TYPEORM_DATABASE,
                    TYPEORM_LOGGING,
                } = getConfig(TypeormConfig);

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
                    logging: TYPEORM_LOGGING ? 'all' : undefined,
                };
            },
        }),
    ],
})
export class UsersModule {}
```

### Injecting other configurations to a single class

```typescript
import { NodeEnv } from 'example/enums';

export class NodeConfig {
    @IsEnum(NodeEnv)
    @Env('NODE_ENV') // reads it from `process.env`, and maps it to your class property `environment`
    readonly environment: NodeEnv;
}
```

```typescript
import { NodeConfig } from 'example/config';

export class TypeormConfig {
    constructor(readonly nodeConfig: NodeConfig) {}
}
```

```typescript
import { TypeormConfig } from 'example/config';

const config = getConfig(TypeormConfig); // Transforms and validates `NodeConfig` as dependency, then transforms and validates `TypeormConfig`, returns instance.

console.log(config.nodeConfig.environment); // Outputs the value of `NODE_ENV`

```

## License

This project is licensed under the MIT License.
