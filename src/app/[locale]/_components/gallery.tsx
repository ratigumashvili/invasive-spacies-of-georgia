"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import { LoaderCircleIcon } from "lucide-react";

import { Image as ImageType } from "@/types/specie-response";
import type { SlideImage } from "yet-another-react-lightbox";

import { BASE_URL, cn } from "@/lib/utils";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";


type CustomSlide = SlideImage & {
    title?: string;
    id?: number;
    src: string;
    width?: number;
    height?: number;
    url?: string;
};

export function Gallery({ photos, className }: { photos: ImageType[], className?: string }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const lightboxSlides: CustomSlide[] = photos.map((img) => ({
        src: img.url,
        title: img.caption,
        width: img.width,
        height: img.height,
        id: img.id,
        url: img.url,
    }));

    const handleImageClick = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    return (
        <section className={cn("grid", className)}>
            {photos.map((image, index) => (
                <div
                    key={image.id}
                    className="cursor-pointer relative aspect-[4/3] bg-gray-200"
                    onClick={() => handleImageClick(index)}
                >
                    <Image
                        src={`${BASE_URL}${image.url}`}
                        alt={image.alternativeText || "Photo"}
                        fill
                        className="object-cover rounded-sm"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {image?.caption &&
                        <small className="block mt-2 text-center absolute -bottom-0 left-0 right-0 p-1 rounded-bl-sm rounded-br-sm bg-white !line-clamp-1">{image?.caption}</small>
                    }
                </div>
            ))}

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={lightboxSlides}
                index={currentIndex}
                render={{
                    slide: ({ slide }) => {
                        const customSlide = slide as CustomSlide;

                        return (
                            <div className="text-center text-white w-full">
                                <div className="relative w-full h-[65vh]">
                                    <Image
                                        src={`${BASE_URL}${customSlide.src}`}
                                        alt={customSlide.title || "Image"}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        className="z-10"
                                    />
                                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                                    </p>
                                </div>
                                {customSlide.title && (
                                    <div className="mt-4">
                                        <h2 className="text-xl italic">{customSlide.title}</h2>
                                    </div>
                                )}
                            </div>
                        );
                    },
                }}
            />
        </section>
    );
}
