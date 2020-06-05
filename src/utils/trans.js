export function transObjToArr(obj) {
    const arr = []
    for(let key in obj) {
        arr.push(`${key}:${obj[key]}`)
    }
    return arr
}