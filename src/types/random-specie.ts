// export interface SingleSpecieList {
//     id: number,
//     documentId: string,
//     autorName: string,
//     locale: string,
//     name: string,
//     slug: string,
//     ecologicalGroup: string,
//     firstIntroduced: number,
//     isNew: boolean,
//     dateOfDetection: Date,
//     image: Image
// }

export type SingleSpecieList = {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    locale: string;
    autorName?: string; // ✅ make optional
    ecologicalGroup?: string;
    firstIntroduced?: string;
    isNew?: boolean;
    dateOfDetection?: string | null;
    image?: {
      id: number;
      documentId: string;
      alternativeText: string | null;
      caption: string;
      width: number;
      height: number;
      url: string;
    };
  };
  

export interface Image {
    id: number,
    documentId: string,
    alternativeText?: string | null,
    caption?: string,
    width: number,
    height: number,
    url: string
}