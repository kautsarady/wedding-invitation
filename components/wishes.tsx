"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { database } from "@/lib/firebase";
import {
  child,
  get,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref,
  set,
} from "firebase/database";
import { orderBy, values } from "lodash";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";

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

function sanitizeKey(key: string): string {
  return key.replace(/[.#$/\[\]]/g, "_");
}

const getCountryByCode = (code: CountryCode) => {
  return COUNTRIES.find((country) => country.code === code) || COUNTRIES[0];
};

type Wish = {
  name: string;
  message: string;
  location: CountryCode;
  timestamp: string;
  key: string;
};

export default function Wishes({
  t,
  guestName,
  onLangChange,
}: {
  t: any;
  guestName: string;
  onLangChange: (lang: "en" | "id" | "jp") => void;
}) {
  const wishesRef = useRef<HTMLDivElement>(null);
  const wishesContainerRef = useRef<HTMLDivElement>(null);

  const [wishes, setWishes] = useState<Array<Wish>>([]);

  const [formData, setFormData] = useState({
    name: guestName || "",
    message: "",
    location: "id" as CountryCode,
  });

  const searchParams = useSearchParams();

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
        onLangChange("jp");
      } else if (timezone.includes("Asia/Singapore")) {
        setFormData((prev) => ({ ...prev, location: "sg" }));
        onLangChange("en");
      } else if (
        timezone.includes("Asia/Jakarta") ||
        timezone.includes("Asia/Makassar") ||
        timezone.includes("Asia/Jayapura")
      ) {
        setFormData((prev) => ({ ...prev, location: "id" }));
        onLangChange("id");
      } else {
        onLangChange("en");
      }
    } catch (error) {
      console.error("Error detecting location:", error);
    }
  }, [searchParams]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.message) {
      const newWish = {
        name: formData.name,
        message: formData.message,
        location: formData.location,
        timestamp: new Date().valueOf().toString(),
        key: sanitizeKey(guestName),
      };

      setIsSubmitting(true);
      const dbRef = ref(database);
      set(child(dbRef, `wishes/${newWish.key}`), newWish).then(() => {
        setIsSubmitting(false);
        setFormData((prev) => ({ ...prev, message: "" }));
      });
    }
  };

  useEffect(() => {
    const dbRef = ref(database);

    get(child(dbRef, "wishes")).then((snapshot) => {
      if (snapshot.exists()) {
        const data = orderBy(
          values(snapshot.val() || {}) as Wish[],
          (w) => w.timestamp
        );
        setWishes(data);
      }
    });

    const unsub1 = onChildAdded(child(dbRef, "wishes"), (data) => {
      setWishes((prevState) =>
        orderBy([...prevState, data.val()], (w) => w.timestamp)
      );

      // Scroll to bottom
      setTimeout(() => {
        wishesRef.current?.scrollTo({
          top: wishesRef.current.scrollHeight + 65,
          behavior: "smooth",
        });
      }, 1000);
    });

    const unsub2 = onChildChanged(child(dbRef, "wishes"), (data) => {
      setWishes((prevState) => {
        return prevState.map((w) => {
          if (data.key === w.key) {
            return data.val();
          }

          return w;
        });
      });
    });

    const unsub3 = onChildRemoved(child(dbRef, "wishes"), (data) => {
      setWishes((prevState) => {
        return prevState.filter((w) => data.key !== w.key);
      });
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  return (
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
            <div ref={wishesRef} className="h-full hide-scrollbar space-y-4">
              {wishes.map((wish, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-[#0B2463]">{wish.name}</h4>
                  </div>
                  <p className="text-sm text-[#0B2463]/80">{wish.message}</p>
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
                htmlFor="message"
                className="block text-sm font-medium text-[#0B2463] mb-1"
              >
                {t.message}
              </label>
              <Textarea
                maxLength={200}
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
              disabled={isSubmitting}
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
  );
}
