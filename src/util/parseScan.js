import { DataSchema } from './dataSchema'


export const parseScan = (competition, scanned) => {
    const serialized = JSON.parse(scanned)
    const id = Number(JSON.parse(localStorage.getItem(competition)).length + 1)
    const obj = {}
    DataSchema.keyof().options.forEach((key, i) => obj[key] = serialized[i])
    return { id, ...DataSchema.parse(obj) }
}