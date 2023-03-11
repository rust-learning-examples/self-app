import { fs, path } from "@tauri-apps/api"
class Storage {
  constructor() {
    return (async () => {
      await fs.createDir('data', { dir: fs.BaseDirectory.AppConfig, recursive: true });
      let storagePath = await path.appDataDir()
      this.filename = `${import.meta.env.MODE}.storage.json`
      storagePath = await path.join(storagePath, this.filename)
      this.storagePath = storagePath
      this.data = {}
      if (await fs.exists(this.filename, { dir: fs.BaseDirectory.AppConfig })) {
        this.data = await this.readFromFileAsync()
      } else {
        await this.writeToFileAsync()
      }
      return this
    })()
  }
  async readFromFileAsync() {
    const contents = await fs.readTextFile(this.filename, { dir: fs.BaseDirectory.AppConfig });
    return contents ? JSON.parse(contents) : {}
  }
  async writeToFileAsync() {
    await fs.writeFile({contents: JSON.stringify(this.data), path: this.filename }, {dir: fs.BaseDirectory.AppConfig})
  }
  getItem(key) {
    console.log('getItem', key)
    return this.data[key]
  }
  setItem(key, value) {
    console.log('setItem', key, value)
    this.data[key] = value
    this.writeToFileAsync()
  }
}

export { Storage }