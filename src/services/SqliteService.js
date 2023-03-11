import { tauri, path, fs, clipboard } from "@tauri-apps/api"
import * as notification from '@tauri-apps/api/notification'
import Database from "tauri-plugin-sql-api"
import * as stockApi from '@/api/stockApi'
import { useAppStore } from '@/stores/app'

class SqliteDatabase {
    constructor() {
        return (async () => {
            await fs.createDir('data', { dir: fs.BaseDirectory.AppData, recursive: true });
            let dbPath = await path.appDataDir()
            dbPath = await path.join(dbPath, `./data/${import.meta.env.MODE}.db`)
            this.dbPath = dbPath
            this.db = await Database.load(`sqlite:${dbPath}`)
            await this.createTables().then(() => {
                this.intervalUpdateStock()
            })
            return this
        })()
    }
    async createTables() {
        await this.db.execute(`CREATE TABLE IF NOT EXISTS stocks (
            id integer primary key AUTOINCREMENT,
            code varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            price decimal(10,5),
            price_at DATETIME NOT NULL,
            notice_lower_price decimal(10,2),
            notice_higher_price decimal(10,2),
            remark text,
            enabled boolean DEFAULT FALSE,
            created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
            updated_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')));`
        )
    }
    async intervalUpdateStock(intervalTime) {
        const appStore = useAppStore()
        intervalTime ||= appStore.stock.intervalUpdateMillisecond
        try {
            const stocks = await this.db.select(`select * from stocks order by updated_at desc;`)
            for (const stock of stocks) {
                const remoteStock = await stockApi.getStock(stock.code)
                if (!remoteStock || `${remoteStock.price}` === '0') {
                    continue;
                }
              stock.price = Number(remoteStock.price)
              const sql = `UPDATE stocks set price = $1, price_at = datetime('now', 'localtime') where id = ${stock.id}`
              await this.db.execute(sql, [stock.price])
              if (stock.enabled) {
                if (stock.price <= stock.notice_lower_price) {
                    notification.sendNotification({title: stock.name, body: `当前价格${stock.price}, 低于通知价格${stock.notice_lower_price}`})
                }
                if (stock.price > stock.notice_higher_price) {
                    notification.sendNotification({title: stock.name, body: `当前价格${stock.price}, 高于通知价格${stock.notice_higher_price}`})
                }
              }
            }
          } finally {
            setTimeout(() => {
              this.intervalUpdateStock(intervalTime)
            }, intervalTime)
          }
    }
}

export { SqliteDatabase }