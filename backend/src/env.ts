import { z } from 'zod'
import 'dotenv/config'

const createPortSchema = (name: string) =>
    z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(
            z
                .number()
                .min(1, `${name} must be a positive number`)
                .max(65535, `${name} must be less than 65536`)
        )

// Either a single DATABASE_URL, or the discrete DB_* variables. Both are
// supported so the same image can run against a connection pooler url or a
// plain host/port/credentials pair.
const envSchema = z
    .object({
        PORT: createPortSchema('PORT'),
        // an empty value counts as unset for every one of these, so a service
        // can carry blank values without failing validation
        DATABASE_URL: z.string().optional(),
        DB_HOST: z.string().optional(),
        DB_PORT: z.string().optional(),
        DB_USERNAME: z.string().optional(),
        DB_PASSWORD: z.string().optional(),
        DB_DATABASE: z.string().optional(),
        INITIALIZE_DB: z.enum(['true', 'false', ''], {
            message: 'INITIALIZE_DB must be true, false or empty',
        }),
    })
    .refine(
        (env) =>
            Boolean(env.DATABASE_URL) ||
            Boolean(
                env.DB_HOST &&
                    env.DB_PORT &&
                    env.DB_USERNAME &&
                    env.DB_PASSWORD &&
                    env.DB_DATABASE
            ),
        {
            message:
                'Provide DATABASE_URL, or all of DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD and DB_DATABASE',
        }
    )

try {
    envSchema.parse(process.env)
} catch (error) {
    if (error instanceof z.ZodError) {
        const missingVars = error.issues.map((err) =>
            err.path.length ? err.path.join('.') : err.message
        )
        throw new Error(
            `Missing or invalid environment variables: ${missingVars.join(', ')}`
        )
    }
    throw error
}
