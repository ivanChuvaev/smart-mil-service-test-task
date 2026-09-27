import { DataSource } from 'typeorm'
import { Product } from './entity/Product'
import { CreateProduct1730000000000 } from './migrations/1730000000000-CreateProduct'

// TypeORM percent-decodes the userinfo of `url` with decodeURIComponent, which
// throws `URIError: URI malformed` on a password containing a bare '%'. Escape
// only those '%' that do not already start a valid escape sequence, so the
// decoded password is unchanged and no manual encoding is needed.
const normalizeUserinfo = (databaseUrl: string) => {
    const schemeEnd = databaseUrl.indexOf('://')
    if (schemeEnd === -1) {
        return databaseUrl
    }

    const authorityStart = schemeEnd + 3
    const pathStart = databaseUrl.indexOf('/', authorityStart)
    const authority = databaseUrl.slice(
        authorityStart,
        pathStart === -1 ? undefined : pathStart
    )

    const at = authority.lastIndexOf('@')
    if (at === -1) {
        return databaseUrl
    }

    const userinfo = authority
        .slice(0, at)
        .replace(/%(?![0-9a-fA-F]{2})/g, '%25')

    return (
        databaseUrl.slice(0, authorityStart) +
        userinfo +
        authority.slice(at) +
        (pathStart === -1 ? '' : databaseUrl.slice(pathStart))
    )
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: normalizeUserinfo(databaseUrl),
    synchronize: false,
    migrationsRun: true,
    logging: false,
    entities: [Product],
    migrations: [CreateProduct1730000000000],
})
