"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/constants/images";
import { TRANSLATIONS } from "@/constants/translations";
import { cn } from "@/lib/utils";
import { Howl } from "howler";
import {
  Calendar,
  Clock,
  Gift,
  Languages,
  MapPin,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Gallery from "./gallery";
import Wishes from "./wishes";

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
  const [language, setLanguage] = useState<Language>("id");
  const [isMuted, setIsMuted] = useState<boolean | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);

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
      if (isMuted === true) {
        sound.pause();
      } else if (isMuted === false) {
        sound.play();
      }
    }
  }, [isMuted]);

  const t = TRANSLATIONS[language];

  const isAkad = useMemo(() => {
    if (typeof window === "undefined") {
      return false; // or any default value for server-side rendering
    }
    return window.location.hostname.includes("akad");
  }, []);

  const getGroomBride = () => {
    const elems = [
      <div key="groom" className="text-center">
        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-[3px] border-[#0B2463]/20 p-1 bg-white shadow-md">
          <Image
            src={IMAGES.groomTrad1 || "/placeholder.svg"}
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
        <p className="text-[#0B2463] font-bold">drg. Hj. Nurmiati Nara</p>
      </div>,

      <div key="bride" className="text-center">
        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-[3px] border-[#e89ecb]/20 p-1 bg-white shadow-md">
          <Image
            src={IMAGES.brideTrad1 || "/placeholder.svg"}
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
      </div>,
    ];

    if (isAkad) {
      return elems.reverse();
    }

    return elems;
  };

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
              <div className="envelope-top bg-gradient-to-r from-[#0B2463]/80 to-[#0B2463] h-32 flex items-center justify-center relative">
                <div className="text-center">
                  <p className="text-white/90 text-sm my-1">
                    {t.invitationLetterFor}
                  </p>
                  <h1 className="text-3xl text-white mb-1 font-extrabold text-shadow">
                    {guestName}
                  </h1>
                </div>
              </div>

              {/* Envelope Content */}
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-32 h-40 overflow-hidden mx-auto mb-4 border-[3px] border-[#0B2463]/20 p-1 bg-white shadow-md">
                    <Image
                      src={
                        IMAGES.coupleFormal1 ||
                        "/placeholder.svg?height=400&width=400"
                      }
                      alt="Couple"
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <h3 className="font-parisienne text-2xl text-[#0B2463] mb-4 font-bold">
                  {isAkad ? "Alifah & Kautsar" : "Kautsar & Alifah"}
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
                  {isAkad ? (
                    <div className="flex items-center font-bold">
                      <Calendar className="h-3 w-3 mr-1" />
                      <p className="text-xs">{t.akadNikah}: 09.04.2025</p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <p className="text-xs font-bold">
                        {t.resepsi}: 12.04.2025
                      </p>
                    </div>
                  )}
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
            <div className="relative w-72 h-88 mx-auto mb-8">
              <div className="elegant-photo-frame w-full h-full">
                <div className="elegant-photo-inner w-full h-full">
                  <Image
                    src={
                      IMAGES.coupleTrad2 ||
                      "/placeholder.svg?height=400&width=400"
                    }
                    alt="Couple"
                    width={255}
                    height={375}
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
              {isAkad ? (
                <>
                  Kautsar <span className="text-[#e89ecb]">&</span> Alifah
                </>
              ) : (
                <>
                  Alifah <span className="text-[#e89ecb]">&</span> Kautsar
                </>
              )}
            </h1>

            {/* Event Badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {isAkad ? (
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
                    <Calendar className="mr-1 h-4 w-4" /> {t.akadNikah}{" "}
                    09.04.2025
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#e89ecb]/0 via-[#e89ecb]/20 to-[#e89ecb]/0 opacity-0 group-hover:opacity-100 animate-shine"></span>
                </Badge>
              ) : (
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
              )}
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
              {getGroomBride()}
            </div>
          </div>
        </section>

        {/* Event Details */}
        <section className="py-12">
          <h2 className="font-parisienne text-3xl md:text-4xl text-[#0B2463] text-center mb-10 font-bold text-shadow-sm">
            {t.ourSpecialDay}
          </h2>

          <div className="grid gap-8">
            {isAkad ? (
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
            ) : (
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
            )}
          </div>
        </section>

        <Wishes
          t={t}
          guestName={guestName}
          onLangChange={(lang) => setLanguage(lang)}
        />

        {/* Gift Section */}
        <section className="py-12">
          <h2 className="font-parisienne text-3xl md:text-4xl text-[#0B2463] text-center mb-6 font-bold text-shadow-sm">
            {t.sendAGift}
          </h2>
          <p className="text-center text-[#0B2463] max-w-2xl mx-auto mb-8">
            {t.giftMessage}
          </p>

          <div className="grid gap-8 max-w-2xl mx-auto">
            {isAkad ? (
              <>
                <div className="elegant-card-animated p-6 bg-white/90 backdrop-blur-sm text-center">
                  <Gift className="mx-auto h-10 w-10 text-[#e89ecb] mb-4" />
                  <h3 className="text-lg font-bold text-[#0B2463] mb-2">
                    Alifah Awina K
                  </h3>
                  <p className="text-[#0B2463] font-mono">4883 0102 0669 537</p>
                  <p className="text-sm text-[#0B2463]/70 mt-1">Bank BRI</p>
                </div>

                <div className="elegant-card-animated p-6 bg-white/90 backdrop-blur-sm text-center">
                  <Gift className="mx-auto h-10 w-10 text-[#e89ecb] mb-4" />
                  <h3 className="text-lg font-bold text-[#0B2463] mb-2">
                    アリファー　アウィナ
                  </h3>
                  <p className="text-[#0B2463] font-mono">03233322</p>
                  <p className="text-sm text-[#0B2463]/70 mt-1">Resona Bank</p>
                </div>
              </>
            ) : (
              <div className="elegant-card-animated p-6 bg-white/90 backdrop-blur-sm text-center">
                <Gift className="mx-auto h-10 w-10 text-[#0B2463] mb-4" />
                <h3 className="text-lg font-bold text-[#0B2463] mb-2">
                  Muhammad Kautsar Apriadi
                </h3>
                <p className="text-[#0B2463] font-mono">102471220239</p>
                <p className="text-sm text-[#0B2463]/70 mt-1">Bank Jago</p>
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        <Gallery t={t} />

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
