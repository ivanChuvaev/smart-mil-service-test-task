declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string
            INITIALIZE_DB: string
            DATABASE_URL: string
        }
    }
}

// This export is necessary to make this a module
export {}
