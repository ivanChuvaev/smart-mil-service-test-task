declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string
            INITIALIZE_DB: string
            DATABASE_URL?: string
            DB_HOST?: string
            DB_PORT?: string
            DB_USERNAME?: string
            DB_PASSWORD?: string
            DB_DATABASE?: string
        }
    }
}

// This export is necessary to make this a module
export {}
