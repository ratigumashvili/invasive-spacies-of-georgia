export interface RandomSpecie {
    id: number,
    documentId: string,
    autorName: string,
    locale: string,
    name: string,
    slug: string,
    ecologicalGroup: string,
    firstIntroduced: string,
    image: Image
}

export interface Image {
    id: number,
    documentId: string,
    alternativeText: string | null,
    width: number,
    height: number,
    url: string
}