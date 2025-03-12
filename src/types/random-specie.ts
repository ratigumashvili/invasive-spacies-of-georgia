export interface SingleSpecieList {
    id: number,
    documentId: string,
    autorName: string,
    locale: string,
    name: string,
    slug: string,
    ecologicalGroup: string,
    firstIntroduced: string,
    isNew: boolean,
    dateOfDetection: Date,
    image: Image
}

export interface Image {
    id: number,
    documentId: string,
    alternativeText?: string | null,
    caption?: string,
    width: number,
    height: number,
    url: string
}