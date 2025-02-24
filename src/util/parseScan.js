import { DataSchema } from './dataSchema'

const generateID = (competition) => {
    const data = JSON.parse(localStorage.getItem(competition))
    if (data && data.length > 0) return data[data.length - 1].id + 1
    return 1
}

export const parseScan = (competition, scanned) => {
    const serialized = JSON.parse(scanned)
    const id = generateID(competition)
    const obj = { id }
    DataSchema.keyof().options.forEach((key, i) => obj[key] = serialized[i])
    return obj
}