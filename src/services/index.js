import { Storage } from './Storage'

let sqliteDB = null
let storage = null

export const globalInitServiceAsync = async () => {
    storage = await new Storage()
}

export const afterAppInitServiceAsync = async () => {
    sqliteDB = await import('./SqliteService').then(({SqliteDatabase}) => {
        return new SqliteDatabase()
    })
}

export { sqliteDB, storage }