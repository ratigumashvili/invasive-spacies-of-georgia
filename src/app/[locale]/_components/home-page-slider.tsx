"use client"

import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

interface ImageData {
    url: string;
    caption: string | null;
}

interface HomePageSliderProps {
    images: ImageData[];
}

export function HomePageSlider({ images }: HomePageSliderProps) {
    return (
        <div className="slide-container">
            <Fade arrows={false} indicators={false}>
                {images?.map((image, index: number) => (
                    <div key={index}>
                        <img
                            style={{ width: '100%', height: "350px", objectFit: "cover" }}
                            src={`${BASE_URL}${image.url}`}
                        />
                        <h2>{image.caption}</h2>
                    </div>
                ))}
            </Fade>
        </div>
    )
}