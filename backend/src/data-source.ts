import { DataSource } from 'typeorm'
import { Product } from './entity/Product'
import { CreateProduct1730000000000 } from './migrations/1730000000000-CreateProduct'

// The URL API percent-encodes userinfo but does not decode it, and a bare '%'
// is not a valid escape sequence, so decodeURIComponent would throw. Treat a
// '%' that does not start a valid escape as a literal, so a password
// containing one works whether or not it was percent-encoded.
const decodeUserinfo = (value: string) =>
    decodeURIComponent(value.replace(/%(?![0-9a-fA-F]{2})/g, '%25'))

type Connection = {
    host: string
    port: number
    username: string
    password: string
    database: string
}

// Parsed here rather than by handing TypeORM `url`, because TypeORM forwards
// `url` to node-postgres as a connectionString, where pg-connection-string
// re-parses it and throws on a password containing a bare '%' or a space.
// Supplying the fields explicitly avoids that second parse entirely.
const parseDatabaseUrl = (raw: string): Connection => {
    const socketForm =
        /^postgres(?:ql)?:\/\/([^@/]*)@\/([^?]*)(?:\?(.*))?$/.exec(raw)

    if (socketForm) {
        // postgresql://user:password@/dbname?host=/var/run/postgresql
        const [, userinfo, database, query] = socketForm
        const params = new URLSearchParams(query ?? '')
        const separator = userinfo.indexOf(':')
        return {
            host: params.get('host') ?? '/var/run/postgresql',
            port: Number(params.get('port') ?? 5432),
            username:
                separator === -1
                    ? decodeUserinfo(userinfo)
                    : decodeUserinfo(userinfo.slice(0, separator)),
            password:
                separator === -1
                    ? ''
                    : decodeUserinfo(userinfo.slice(separator + 1)),
            database: params.get('db') ?? database,
        }
    }

    const url = new URL(raw)

    if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
        throw new Error(
            `DATABASE_URL must use postgres:// or postgresql://, got ${url.protocol}`
        )
    }

    const database = url.pathname.replace(/^\//, '')
    if (!database) {
        throw new Error('DATABASE_URL is missing a database name')
    }

    return {
        host: url.hostname,
        port: url.port ? Number(url.port) : 5432,
        username: decodeUserinfo(url.username),
        password: decodeUserinfo(url.password),
        database,
    }
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
}

const connection = parseDatabaseUrl(databaseUrl)

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: connection.host,
    port: connection.port,
    username: connection.username,
    password: connection.password,
    database: connection.database,
    synchronize: false,
    migrationsRun: true,
    logging: false,
    entities: [Product],
    migrations: [CreateProduct1730000000000],
})
