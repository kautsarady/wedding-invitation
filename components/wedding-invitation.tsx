"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Volume2,
  VolumeX,
  MapPin,
  Gift,
  Calendar,
  Clock,
  Languages,
} from "lucide-react";
import { Howl } from "howler";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IMAGES } from "@/constants/images";
import { TRANSLATIONS } from "@/constants/translations";

type Language = "id" | "jp" | "en";
type CountryCode = "id" | "jp" | "sg" | "other";

interface CountryInfo {
  name: string;
  flag: string;
  code: CountryCode;
}

const COUNTRIES: CountryInfo[] = [
  { name: "Indonesia", flag: "🇮🇩", code: "id" },
  { name: "Japan", flag: "🇯🇵", code: "jp" },
  { name: "Singapore", flag: "🇸🇬", code: "sg" },
  { name: "Other", flag: "🌐", code: "other" },
];

export default function WeddingInvitation({
  guestName,
}: {
  guestName: string;
}) {
  const [language, setLanguage] = useState<Language>("en");
  const [isMuted, setIsMuted] = useState<boolean | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishes, setWishes] = useState<
    Array<{ name: string; message: string; location: CountryCode }>
  >([
    {
      name: "Ahmad",
      message:
        "Congratulations on your wedding! Wishing you a lifetime of love and happiness.",
      location: "id",
    },
    {
      name: "Yuki",
      message: "おめでとうございます！末永くお幸せに。",
      location: "jp",
    },
    {
      name: "Sarah",
      message:
        "May your love grow stronger with each passing day. Best wishes!",
      location: "sg",
    },
    {
      name: "Michael",
      message:
        "Congratulations to the beautiful couple! May your journey together be filled with joy.",
      location: "other",
    },
    {
      name: "Sophia",
      message:
        "Wishing you both all the love and happiness in the world. Congratulations!",
      location: "id",
    },
    {
      name: "Takashi",
      message: "結婚おめでとう！いつまでも幸せに。",
      location: "jp",
    },
    {
      name: "Emma",
      message:
        "Here's to a beautiful beginning of your forever. Congratulations!",
      location: "sg",
    },
    {
      name: "David",
      message:
        "May the years ahead be filled with lasting joy. Congratulations on your marriage!",
      location: "other",
    },
  ]);
  const [formData, setFormData] = useState({
    name: guestName || "",
    message: "",
    location: "id" as CountryCode,
  });

  const wishesRef = useRef<HTMLDivElement>(null);
  const wishesContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [isScrolling, setIsScrolling] = useState(false);

  const getCountryByCode = (code: CountryCode) => {
    return COUNTRIES.find((country) => country.code === code) || COUNTRIES[0];
  };

  // Initialize Howler when the envelope is opened
  useEffect(() => {
    if (isOpen && !sound) {
      const newSound = new Howl({
        src: ["/wedding-music.mp3"],
        loop: true,
        volume: 0.5,
      });
      newSound.play();
      setSound(newSound);
    }

    return () => {
      if (sound) {
        sound.stop();
      }
    };
  }, [isOpen, sound]);

  // Handle mute/unmute
  useEffect(() => {
    if (sound) {
      if (isMuted === false) {
        sound.pause();
      } else if (isMuted === true) {
        sound.play();
      }
    }
  }, [isMuted, sound]);

  // Initialize wishes container with duplicated content for seamless scrolling
  useEffect(() => {
    if (wishesRef.current && !isScrolling) {
      // Create a duplicate set of wishes for seamless scrolling
      const wishElements = wishesRef.current.querySelectorAll(":scope > div");
      if (wishElements.length > 0) {
        // Clone all elements and append them
        wishElements.forEach((element) => {
          const clone = element.cloneNode(true);
          wishesRef.current?.appendChild(clone);
        });
        setIsScrolling(true);
      }
    }
  }, [isScrolling]);

  useEffect(() => {
    // Set guest name from query params if available
    const name = searchParams.get("to");
    if (name) {
      setFormData((prev) => ({ ...prev, name }));
    }

    // Try to detect user's location for the form
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes("Asia/Tokyo")) {
        setFormData((prev) => ({ ...prev, location: "jp" }));
      } else if (timezone.includes("Asia/Singapore")) {
        setFormData((prev) => ({ ...prev, location: "sg" }));
      } else if (timezone.includes("Asia/Jakarta")) {
        setFormData((prev) => ({ ...prev, location: "id" }));
      }
    } catch (error) {
      console.error("Error detecting location:", error);
    }

    // Smooth infinite scroll implementation
    let scrollInterval: NodeJS.Timeout;

    if (wishesRef.current && isScrolling) {
      // Start with a very slow scroll speed
      const scrollSpeed = 0.5; // pixels per frame

      scrollInterval = setInterval(() => {
        if (wishesRef.current) {
          // Increment scroll position by a small amount
          wishesRef.current.scrollTop += scrollSpeed;

          // When we reach the halfway point (original content height)
          // Reset to the top very subtly to create a seamless loop
          const totalHeight = wishesRef.current.scrollHeight;
          const halfHeight = totalHeight / 2;

          if (wishesRef.current.scrollTop >= halfHeight) {
            // Reset to top without animation (will be imperceptible)
            wishesRef.current.scrollTop = 0;
          }
        }
      }, 16); // ~60fps
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [searchParams, isScrolling]);

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.message) {
      const newWish = {
        name: formData.name,
        message: formData.message,
        location: formData.location,
      };

      setWishes((prev) => [...prev, newWish]);

      // Also add to the DOM for the infinite scroll
      if (wishesRef.current) {
        // Create a new wish element
        const newWishElement = document.createElement("div");
        newWishElement.className = "border-b pb-3 last:border-b-0";
        newWishElement.innerHTML = `
          <div class="flex justify-between items-center mb-1">
            <h4 class="font-bold text-[#0B2463]">${formData.name}</h4>
            <div class="flex items-center gap-1">
              <span class="text-lg" aria-hidden="true">${
                getCountryByCode(formData.location).flag
              }</span>
              <span class="sr-only">${
                getCountryByCode(formData.location).name
              }</span>
            </div>
          </div>
          <p class="text-sm text-[#0B2463]/80">${formData.message}</p>
        `;

        // Add to both the original and cloned sections
        wishesRef.current.appendChild(newWishElement);
        const clone = newWishElement.cloneNode(true);
        wishesRef.current.appendChild(clone);
      }

      setFormData((prev) => ({ ...prev, message: "" }));
    }
  };

  const t = TRANSLATIONS[language];

  // If the invitation is not yet opened, show the envelope
  if (!isOpen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#C0E3F5]/50 via-[#C0E3F5]/30 to-white font-plus-jakarta">
        {/* Language selector above the envelope */}
        <div className="mb-6 flex justify-center">
          <div className="language-selector bg-white/90 rounded-full p-1 shadow-md">
            <div className="flex items-center gap-2 pl-1">
              <Languages size={16} className="text-[#0B2463]" />
              <div className="flex gap-2">
                <Badge
                  variant={language === "id" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors text-xs px-2 py-0.5",
                    language === "id"
                      ? "bg-[#0B2463] text-white"
                      : "bg-white hover:bg-[#0B2463]/10 text-[#0B2463]"
                  )}
                  onClick={() => setLanguage("id")}
                >
                  ID
                </Badge>
                <Badge
                  variant={language === "jp" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors font-kiwi-maru text-xs px-2 py-0.5",
                    language === "jp"
                      ? "bg-[#0B2463] text-white"
                      : "bg-white hover:bg-[#0B2463]/10 text-[#0B2463]"
                  )}
                  onClick={() => setLanguage("jp")}
                >
                  JP
                </Badge>
                <Badge
                  variant={language === "en" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors text-xs px-2 py-0.5",
                    language === "en"
                      ? "bg-[#0B2463] text-white"
                      : "bg-white hover:bg-[#0B2463]/10 text-[#0B2463]"
                  )}
                  onClick={() => setLanguage("en")}
                >
                  EN
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md w-full mx-4">
          <div className="envelope-container relative">
            <div className="envelope bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105">
              {/* Envelope Top */}
              <div className="envelope-top bg-gradient-to-r from-[#0B2463]/80 to-[#0B2463] h-24 flex items-center justify-center relative">
                <div className="text-center">
                  <p className="text-white/90 text-sm">
                    {t.invitationLetterFor}
                  </p>
                  <h1 className="font-parisienne text-3xl text-white mb-1 font-extrabold text-shadow">
                    {guestName}
                  </h1>
                </div>
              </div>

              {/* Envelope Content */}
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-32 h-32 overflow-hidden mx-auto mb-4 border-[3px] border-[#0B2463]/20 p-1 bg-white shadow-md">
                    <Image
                      src={
                        IMAGES.couple || "/placeholder.svg?height=400&width=400"
                      }
                      alt="Couple"
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <h3 className="font-parisienne text-2xl text-[#0B2463] mb-4 font-bold">
                  Kautsar & Alifah
                </h3>

                <div className="mt-6">
                  <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#0B2463] hover:bg-[#0B2463]/90 text-white px-8 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    {language === "id"
                      ? "Buka Undangan"
                      : language === "jp"
                      ? "招待状を開く"
                      : "Open Invitation"}
                  </Button>
                </div>
              </div>

              {/* Envelope Bottom with both dates */}
              <div className="envelope-bottom bg-gradient-to-r from-[#e89ecb]/80 to-[#e89ecb] py-3 flex flex-col items-center justify-center">
                <div className="flex items-center gap-4 text-white">
                  <div className="flex items-center font-bold">
                    <Calendar className="h-3 w-3 mr-1" />
                    <p className="text-xs">{t.akadNikah}: 09.04.2025</p>
                  </div>
                  <div className="h-4 w-px bg-white/50"></div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <p className="text-xs font-bold">{t.resepsi}: 12.04.2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#C0E3F5]/50 via-[#C0E3F5]/30 to-white font-plus-jakarta overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-7"></div>
        <div className="gold-accent"></div>
        <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#e89ecb]/15 blur-3xl"></div>
        <div className="absolute bottom-[40%] right-[10%] w-[250px] h-[250px] rounded-full bg-[#0B2463]/10 blur-3xl"></div>
        <div className="absolute top-[60%] left-[20%] w-[200px] h-[200px] rounded-full bg-[#C0E3F5]/30 blur-3xl"></div>
      </div>

      {/* Falling Elements Animation */}
      <div className="falling-elements">
        {[...Array(40)].map((_, i) => (
          <div key={i} className={`element element-${(i % 5) + 1}`}></div>
        ))}
      </div>

      {/* Mute/Unmute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors border border-[#0B2463]/10"
      >
        {isMuted ? (
          <VolumeX size={20} className="text-[#0B2463]" />
        ) : (
          <Volume2 size={20} className="text-[#0B2463]" />
        )}
      </button>

      {/* Language Selector - Made bigger */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Badge
          variant={language === "id" ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-colors text-sm px-3 py-1", // Reduced size
            language === "id"
              ? "bg-[#0B2463] text-white"
              : "bg-white hover:bg-[#0B2463]/10"
          )}
          onClick={() => setLanguage("id")}
        >
          Indonesia
        </Badge>
        <Badge
          variant={language === "jp" ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-colors font-kiwi-maru text-sm px-3 py-1", // Reduced size
            language === "jp"
              ? "bg-[#0B2463] text-white"
              : "bg-white hover:bg-[#0B2463]/10"
          )}
          onClick={() => setLanguage("jp")}
        >
          日本語
        </Badge>
        <Badge
          variant={language === "en" ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-colors text-sm px-3 py-1", // Reduced size
            language === "en"
              ? "bg-[#0B2463] text-white"
              : "bg-white hover:bg-[#0B2463]/10"
          )}
          onClick={() => setLanguage("en")}
        >
          English
        </Badge>
      </div>

      {/* Added padding to the top of the content */}
      <div className="container max-w-4xl mx-auto px-4 py-8 pt-20 relative z-10">
        {/* Decorative Ornament */}
        <div className="ornament-top mx-auto mb-8"></div>

        {/* Hero Section */}
        <section className="text-center py-16 md:py-24 relative elegant-card-animated">
          {/* Elegant background with baby blue gradient */}
          <div className="absolute inset-0 elegant-hero-bg"></div>

          {/* Decorative corner elements */}
          <div className="corner-decoration top-left"></div>
          <div className="corner-decoration top-right"></div>
          <div className="corner-decoration bottom-left"></div>
          <div className="corner-decoration bottom-right"></div>

          <div className="relative z-10">
            <h2 className="text-[#0B2463] mb-4 uppercase tracking-widest text-sm font-semibold">
              {t.theWeddingOf}
            </h2>

            {/* Couple Image with Elegant Frame */}
            <div className="relative w-72 h-72 mx-auto mb-8">
              <div className="elegant-photo-frame w-full h-full">
                <div className="elegant-photo-inner w-full h-full">
                  <Image
                    src={
                      IMAGES.couple || "/placeholder.svg?height=400&width=400"
                    }
                    alt="Couple"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Wedding icons */}
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center border border-[#0B2463]/10 shadow-md">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0B2463]/80 to-[#0B2463] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 435.729 435.729"
                    width="20"
                    height="20"
                    fill="#FFFFFF"
                  >
                    <g>
                      <path d="M175.622,47.125c0-26.027-21.473-47.125-47.5-47.125s-47.5,21.099-47.5,47.125v24.333h95V47.125z" />
                      <circle cx="338.583" cy="35.494" r="35.494" />
                      <polygon
                        points="353.743,101.729 353.743,141.729 323.743,141.729 323.743,101.729 265.743,101.729 265.743,269.729 
                        284.743,269.729 284.743,435.729 392.743,435.729 392.743,269.729 411.743,269.729 411.743,101.729 	"
                      />
                      <polygon points="172.26,191.729 184.435,101.729 72.264,101.729 84.44,191.729 	" />
                      <polygon points="82.345,221.729 23.986,435.729 232.714,435.729 174.354,221.729 	" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center border border-[#0B2463]/10 shadow-md">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#e89ecb]/80 to-[#e89ecb] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 25.626 25.626"
                    width="20"
                    height="20"
                    fill="#FFFFFF"
                  >
                    <g>
                      <path
                        d="M16.812,4.001c-0.997,0-1.952,0.174-2.846,0.479C15.032,5.142,15.96,6,16.703,7.007
                        c0.037-0.002,0.072-0.006,0.109-0.006c3.205,0,5.813,2.607,5.813,5.813s-2.608,5.812-5.813,5.812S11,16.018,11,12.813
                        c0-1.295,0.431-2.487,1.149-3.455c-0.732-0.707-1.689-1.167-2.75-1.298C8.517,9.432,8,11.061,8,12.813
                        c0,4.867,3.945,8.813,8.813,8.813s8.813-3.945,8.813-8.813S21.679,4.001,16.812,4.001z"
                      />
                      <path
                        d="M8.812,21.626c0.997,0,1.952-0.174,2.846-0.479c-1.066-0.662-1.994-1.52-2.737-2.527
                        c-0.037,0.001-0.072,0.006-0.109,0.006c-3.205,0-5.813-2.607-5.813-5.813s2.608-5.812,5.813-5.812s5.813,2.607,5.813,5.812
                        c0,1.295-0.431,2.487-1.149,3.455c0.732,0.707,1.689,1.167,2.75,1.298c0.882-1.372,1.399-3.001,1.399-4.753
                        C17.625,7.946,13.68,4,8.812,4S0,7.946,0,12.813S3.945,21.626,8.812,21.626z"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="font-parisienne text-4xl md:text-6xl lg:text-7xl text-[#0B2463] mb-6 font-extrabold text-shadow">
              Kautsar <span className="text-[#e89ecb]">&</span> Alifah
            </h1>

            {/* Event Badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Badge
                variant="outline"
                className="py-2 px-4 text-base border-[#e89ecb] text-[#e89ecb] cursor-pointer hover:bg-[#e89ecb] hover:text-white transition-colors relative overflow-hidden group"
                onClick={() =>
                  document
                    .getElementById("akad-details")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span className="relative z-10 flex items-center">
                  <Calendar className="mr-1 h-4 w-4" /> {t.akadNikah} 09.04.2025
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#e89ecb]/0 via-[#e89ecb]/20 to-[#e89ecb]/0 opacity-0 group-hover:opacity-100 animate-shine"></span>
              </Badge>
              <Badge
                variant="outline"
                className="py-2 px-4 text-base border-[#0B2463] text-[#0B2463] cursor-pointer hover:bg-[#0B2463] hover:text-white transition-colors relative overflow-hidden group"
                onClick={() =>
                  document
                    .getElementById("resepsi-details")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span className="relative z-10 flex items-center">
                  <Calendar className="mr-1 h-4 w-4" /> {t.resepsi} 12.04.2025
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#0B2463]/0 via-[#0B2463]/20 to-[#0B2463]/0 opacity-0 group-hover:opacity-100 animate-shine"></span>
              </Badge>
            </div>
          </div>
        </section>

        {/* Quran Verse */}
        <section className="py-12 text-center relative">
          <div className="elegant-card-animated p-8 bg-white/90 backdrop-blur-sm">
            <div className="mb-6 font-rubik-arabic text-2xl md:text-3xl leading-relaxed text-[#0B2463] rtl">
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
              لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ
              إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
            </div>
            <div className="elegant-divider my-4"></div>
            <p className="text-[#0B2463] italic">{t.quranVerse}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Surah Ar-Rum: 21
            </p>
          </div>
        </section>

        {/* Invitation Message with Couple Information */}
        <section className="py-12 text-center">
          <div className="elegant-card-animated p-8 bg-white/90 backdrop-blur-sm">
            <h2 className="font-parisienne text-3xl md:text-4xl text-[#0B2463] mb-6 font-bold text-shadow-sm">
              {t.celebratingOurUnion}
            </h2>
            <p className="text-[#0B2463] max-w-2xl mx-auto mb-6">
              {t.invitationMessage.replace("{guestName}", "")}
            </p>

            <div className="my-8 py-4 relative">
              <div className="absolute left-0 top-0 w-16 h-16 border-t-2 border-l-2 border-[#0B2463]/30"></div>
              <div className="absolute right-0 top-0 w-16 h-16 border-t-2 border-r-2 border-[#0B2463]/30"></div>
              <div className="absolute left-0 bottom-0 w-16 h-16 border-b-2 border-l-2 border-[#0B2463]/30"></div>
              <div className="absolute right-0 bottom-0 w-16 h-16 border-b-2 border-r-2 border-[#0B2463]/30"></div>

              <h3 className="text-xl md:text-2xl text-[#0B2463] font-bold">
                {guestName || t.guestTitle}
              </h3>
            </div>

            <p className="text-[#0B2463] italic mb-6">{t.respectfully}</p>

            <div className="elegant-divider my-4"></div>

            {/* Couple Information - Combined here, removed duplicate section */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-[3px] border-[#0B2463]/20 p-1 bg-white shadow-md">
                  <Image
                    src={IMAGES.groom || "/placeholder.svg"}
                    alt="Groom"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <h3 className="text-xl text-[#0B2463] font-bold">
                  Muhammad Kautsar Apriadi, S.ST
                </h3>
                <div className="elegant-divider my-3 max-w-[150px] mx-auto"></div>
                <p className="text-[#0B2463] mt-2">{t.sonOf}</p>
                <p className="text-[#0B2463] font-bold">
                  Ir. H. Ismail Mustari, S.T., M.T
                </p>
                <p className="text-[#0B2463] font-bold">
                  drg. Hj. Nurmiati Nara
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-[3px] border-[#e89ecb]/20 p-1 bg-white shadow-md">
                  <Image
                    src={IMAGES.bride || "/placeholder.svg"}
                    alt="Bride"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <h3 className="text-xl text-[#0B2463] font-bold">
                  Alifah Awina K. A.Md.Keb
                </h3>
                <div className="elegant-divider my-3 max-w-[150px] mx-auto"></div>
                <p className="text-[#0B2463] mt-2">{t.daughterOf}</p>
                <p className="text-[#0B2463] font-bold">
                  Drs. Abdul Kadir, S.Pd., M.Pd.
                </p>
                <p className="text-[#0B2463] font-bold">Hariani, S.Pd.I</p>
              </div>
            </div>
          </div>
        </section>

        {/* Event Details */}
        <section className="py-12">
          <h2 className="font-parisienne text-3xl md:text-4xl text-[#0B2463] text-center mb-10 font-bold text-shadow-sm">
            {t.ourSpecialDay}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Akad Nikah - Now with pink color */}
            <div
              className="elegant-card-animated p-6 bg-white/90 backdrop-blur-sm"
              id="akad-details"
            >
              <div className="text-center mb-4">
                <Badge className="bg-[#e89ecb] hover:bg-[#e89ecb]/90 mb-2">
                  {t.akadNikah}
                </Badge>
                <h3 className="text-xl font-bold text-[#0B2463]">Barru</h3>
              </div>

              <div className="elegant-divider my-3"></div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-[#e89ecb] h-5 w-5 flex-shrink-0" />
                  <p className="text-[#0B2463] font-medium">9 April 2025</p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="text-[#e89ecb] h-5 w-5 flex-shrink-0" />
                  <p className="text-[#0B2463] font-medium">10:00 WITA</p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="text-[#e89ecb] h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#0B2463] font-medium">
                      Kediaman Mempelai Wanita
                    </p>
                    <p className="text-[#0B2463]/70 text-sm">
                      Aroppoe, Kab. Barru
                    </p>
                  </div>
                </div>

                {/* Google Maps iframe */}
                <div className="w-full h-[200px] mt-2 border border-[#0B2463]/10 rounded-md overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps?q=-4.483733,119.616693&hl=en&z=18&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Resepsi - Now with blue color */}
            <div
              className="elegant-card-animated p-6 bg-white/90 backdrop-blur-sm"
              id="resepsi-details"
            >
              <div className="text-center mb-4">
                <Badge className="bg-[#0B2463] hover:bg-[#0B2463]/90 mb-2">
                  {t.resepsi}
                </Badge>
                <h3 className="text-xl font-bold text-[#0B2463]">
                  Hotel Dalton Makassar
                </h3>
                <p className="text-[#0B2463]">Ballroom Anging Mammiri 2</p>
              </div>

              <div className="elegant-divider my-3"></div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-[#0B2463] h-5 w-5 flex-shrink-0" />
                  <p className="text-[#0B2463] font-medium">12 April 2025</p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="text-[#0B2463] h-5 w-5 flex-shrink-0" />
                  <p className="text-[#0B2463] font-medium">19:00 WITA</p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="text-[#0B2463] h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#0B2463] font-medium">
                      Hotel Dalton Makassar
                    </p>
                    <p className="text-[#0B2463]/70 text-sm">
                      Jl. Perintis Kemerdekaan KM.16, Makassar
                    </p>
                  </div>
                </div>

                {/* Google Maps iframe */}
                <div className="w-full h-[200px] mt-2 border border-[#0B2463]/10 rounded-md overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1922.5089075471017!2d119.51469192043282!3d-5.090484394700584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbefc81ff8663e1%3A0x4d7bf55efe12414a!2sDalton%20Makassar!5e0!3m2!1sen!2sid!4v1743302434257!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Souvenir information - merged from Important Information section */}
                <div className="mt-4 p-4 bg-[#0B2463]/5 rounded-md border border-[#0B2463]/10">
                  <p className="text-[#0B2463] text-sm font-medium">
                    Please show this digital letter to retrieve our wedding
                    souvenir at the venue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-12">
          <h2 className="font-parisienne text-3xl md:text-4xl text-[#0B2463] text-center mb-10 font-bold text-shadow-sm">
            {t.gallery}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {IMAGES.gallery.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div
                    className={`overflow-hidden elegant-image cursor-pointer hover:opacity-90 transition-opacity ${
                      index % 3 === 0
                        ? "row-span-2 aspect-[3/4]"
                        : index % 5 === 0
                        ? "col-span-2 aspect-[16/9]"
                        : "aspect-square"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Gallery image ${index + 1}`}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {IMAGES.gallery.map((img, i) => (
                        <CarouselItem key={i}>
                          <div className="p-1">
                            <div className="overflow-hidden elegant-image">
                              <Image
                                src={img || "/placeholder.svg"}
                                alt={`Gallery image ${i + 1}`}
                                width={800}
                                height={600}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>

        {/* Wishes Section */}
        <section className="py-12">
          <h2 className="font-parisienne text-3xl md:text-4xl text-[#0B2463] text-center mb-10 font-bold text-shadow-sm">
            {t.sendWishes}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Wishes Display */}
            <div className="elegant-card-animated p-6 bg-white/90 backdrop-blur-sm h-[350px] overflow-hidden">
              <div
                ref={wishesContainerRef}
                className="infinite-scroll-container h-full"
              >
                <div
                  ref={wishesRef}
                  className="h-full hide-scrollbar space-y-4"
                >
                  {wishes.map((wish, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-[#0B2463]">
                          {wish.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-lg" aria-hidden="true">
                            {getCountryByCode(wish.location).flag}
                          </span>
                          <span className="sr-only">
                            {getCountryByCode(wish.location).name}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-[#0B2463]/80">
                        {wish.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wishes Form - Enhanced with flags */}
            <div className="elegant-card-animated p-6 bg-white/90 backdrop-blur-sm">
              <form onSubmit={handleSubmitWish} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#0B2463] mb-1"
                  >
                    {t.name}
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={t.namePlaceholder}
                    required
                    className="border-[#0B2463]/30 focus-visible:ring-[#0B2463]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-[#0B2463] mb-1"
                  >
                    {t.sendingFrom}
                  </label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: value as CountryCode,
                      }))
                    }
                  >
                    <SelectTrigger className="border-[#0B2463]/30 focus-visible:ring-[#0B2463]">
                      <SelectValue placeholder={t.selectLocation}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getCountryByCode(formData.location).flag}
                          </span>
                          <span>
                            {getCountryByCode(formData.location).name}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem
                          key={country.code}
                          value={country.code}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#0B2463] mb-1"
                  >
                    {t.message}
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder={t.messagePlaceholder}
                    required
                    className="min-h-[100px] border-[#0B2463]/30 focus-visible:ring-[#0B2463]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0B2463] hover:bg-[#0B2463]/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>{" "}
                  {t.sendWish}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Gift Section */}
        <section className="py-12">
          <h2 className="font-parisienne text-3xl md:text-4xl text-[#0B2463] text-center mb-6 font-bold text-shadow-sm">
            {t.sendAGift}
          </h2>
          <p className="text-center text-[#0B2463] max-w-2xl mx-auto mb-8">
            {t.giftMessage}
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="elegant-card-animated p-6 bg-white/90 backdrop-blur-sm text-center">
              <Gift className="mx-auto h-10 w-10 text-[#0B2463] mb-4" />
              <h3 className="text-lg font-bold text-[#0B2463] mb-2">
                Muhammad Kautsar Apriadi
              </h3>
              <p className="text-[#0B2463] font-mono">1234 5678 9012 3456</p>
              <p className="text-sm text-[#0B2463]/70 mt-1">Bank Mandiri</p>
            </div>

            <div className="elegant-card-animated p-6 bg-white/90 backdrop-blur-sm text-center">
              <Gift className="mx-auto h-10 w-10 text-[#e89ecb] mb-4" />
              <h3 className="text-lg font-bold text-[#0B2463] mb-2">
                Alifah Awina K.
              </h3>
              <p className="text-[#0B2463] font-mono">9876 5432 1098 7654</p>
              <p className="text-sm text-[#0B2463]/70 mt-1">Bank BNI</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center">
          <div className="ornament-bottom mx-auto mb-6"></div>
          <h2 className="font-parisienne text-2xl md:text-3xl text-[#0B2463] mb-4">
            {t.thanksMessage}
          </h2>
          <p className="text-[#0B2463] font-bold">
            Muhammad Kautsar & Alifah Awina
          </p>
          <p className="text-sm text-[#0B2463]/70 mt-6">
            © 2025 Wedding Invitation
          </p>
        </footer>
      </div>
    </div>
  );
}
