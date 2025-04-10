import { DataSchema } from './dataSchema'

const generateID = () => Math.random().toString(36).substring(2,10)

export const parseScan = (scanned) => {
    const serialized = JSON.parse(scanned)
    const id = generateID()
    const obj = { id }
    DataSchema.keyof().options.forEach((key, i) => obj[key] = serialized[i])
    return obj
}