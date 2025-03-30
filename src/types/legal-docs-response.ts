interface Date {
    day: number,
    month: number,
    year: number
}

interface Record {
    id: number,
    title: string,
    url: string,
    description: string
    date: Date
}

export interface LegalDocumetns {
    id: number,
    documentId: string,
    records: Record[]
}