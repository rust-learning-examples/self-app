import * as http from '@tauri-apps/api/http'

export const getStock = async (code: string) => {
  let failCount = 0;
  let platformPromises = [
    getTTStock([`sz${code}`]).then(items => {
      if (items.length) { return items[0] } else { throw new Error('Not Found') }
    }).catch(e => { failCount += 1; if (failCount === platformPromises.length) { throw(e) } }),
    getTTStock([`sh${code}`]).then(items => {
      if (items.length) { return items[0] } else { throw new Error('Not Found') }
    }).catch(e => { failCount += 1; if (failCount === platformPromises.length) { throw(e) } }),
    getDFCFStock([`0.${code}`]).then(items => {
      if (items.length) { return items[0] } else { throw new Error('Not Found') }
    }).catch(e => { failCount += 1; if (failCount === platformPromises.length) { throw(e) } }),
    getDFCFStock([`1.${code}`]).then(items => {
      if (items.length) { return items[0] } else { throw new Error('Not Found') }
    }).catch(e => {failCount += 1; if (failCount === platformPromises.length) { throw(e) } })
  ]
  return await Promise.race(platformPromises)
}

// 腾讯股票  http://qt.gtimg .cn/q=sz000625,sh600519
async function getTTStock(codes: string[]) {
  let list: any[] = []
  try {
    const apiUrl = 'http://qt.gtimg' + `.cn/q=${ codes.join(',') }`
    const response: any = await http.fetch(apiUrl, {
      method: 'GET',
      responseType: http.ResponseType.Binary,
    })
    // https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
    let utf8decoder = new TextDecoder('GBK')
    const resData = utf8decoder.decode(new Uint8Array(response.data))
    let arr = resData.split(';');
    for (let i = 0; i < arr.length; i++) {
      const data = arr[i].split('~')
      if (data.length > 33) {
        list.push({
          name: data[1],
          code: data[2],
          price: Number(data[3]),
          _from: `腾讯股票 ${ codes.join(',') }`
        })
      }
    }
  } catch(e) {
    console.error(e)
  }
  if (list.length === 0) { await new Promise(resolve => setTimeout(resolve, 3000)) }
  return list
}

// 东方财富网
async function getDFCFStock(codes: string[]) {
  let list: any[] = [];
  try {
    const apiUrl = 'https://push2.eastmoney' + `.com/api/qt/ulist/get?invt=3&pi=0&pz=1&mpi=2000&secids=${ codes.join(',') }&ut=6d2ffaa6a585d612eda28417681d58fb&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f8,f6,f9&po=1&_=1660391397865`
    const response: any = await http.fetch(apiUrl, {
      method: 'GET',
      headers: {
        Host: 'https://push2.eastmoney' + '.com',
      },
      responseType: http.ResponseType.JSON,
    })
    let keys = Object.keys(response.data.data?.diff || {});
    for (let i = 0; i < keys.length; i++) {
      const item = response.data.data.diff[keys[i]]
      list.push({
        name: item['f14'],
        code: item['f12'],
        price: Number(Number(item['f2'] * Math.pow(0.1, item['f1'])).toFixed(2)),
        _from: `东方财富网 ${ codes.join(',') }`
      })
    }
  } catch(e) {
    console.error(e)
  }
  if (list.length === 0) { await new Promise(resolve => setTimeout(resolve, 3000)) }
  return list
}