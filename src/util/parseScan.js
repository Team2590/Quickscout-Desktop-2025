import { DataSchema } from './dataSchema'

const generateID = (competition) => {
    const key = `${competition}-id`
    const storedID = Number(localStorage.getItem(key))
    if (storedID) {
        localStorage.setItem(key, storedID + 1)
        return storedID + 1
    } else {
        localStorage.setItem(key, 1)
        return 1
    }
}

export const parseScan = (competition, scanned) => {
    const serialized = JSON.parse(scanned)
    const id = generateID(competition)
    const obj = { id }
    DataSchema.keyof().options.forEach((key, i) => obj[key] = serialized[i])
    return obj
}