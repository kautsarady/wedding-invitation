import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { IMAGES } from "@/constants/images";

export default function Gallery({ t }: { t: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <section className="py-12">
      <h2 className="font-parisienne text-3xl md:text-4xl text-[#0B2463] text-center mb-10 font-bold text-shadow-sm">
        {t.gallery}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {IMAGES.gallery.map((image, i) => (
          <div
            key={i}
            onClick={() => {
              setIndex(i);
              setIsOpen(true);
            }}
            className={`overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${
              i % 3 === 0
                ? "row-span-2 aspect-[3/4]"
                : i % 5 === 0
                ? "col-span-2 aspect-[16/9]"
                : "aspect-square"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Gallery image ${i + 1}`}
              quality={75}
              width={300}
              height={300}
              placeholder="blur"
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Lightbox for fullscreen view */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={IMAGES.gallery.map((img) => ({
          src: typeof img === "object" ? img.src : img,
        }))}
        index={index}
      />
    </section>
  );
}
