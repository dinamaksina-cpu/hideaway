"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { DateRange } from "react-day-picker";
import { differenceInCalendarDays, format } from "date-fns";
import {
  ArrowRight, Bath, BedDouble, Check, ChevronDown, Clock3, CookingPot, House,
  Mail, MapPin, Menu, Mountain, ParkingCircle, Phone, Send, ShieldCheck, Users, WashingMachine, Wifi,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const gallery = [
  { src: "/photos/living-wide.webp", alt: "Bright open-plan living and dining room with countryside views", label: "Living & dining" },
  { src: "/photos/exterior.webp", alt: "The white exterior of The Hideaway in Bundoran", label: "The Hideaway" },
  { src: "/photos/terrace-wide.webp", alt: "Private sunken terrace and garden with mountain views", label: "Private terrace" },
  { src: "/photos/kitchen-wide.webp", alt: "Fully equipped kitchen with a garden view", label: "Kitchen" },
  { src: "/photos/bedroom-ground.webp", alt: "Ground-floor double bedroom", label: "Ground-floor bedroom" },
  { src: "/photos/bedroom-loft.webp", alt: "Loft bedroom with double and single beds", label: "Loft bedroom" },
  { src: "/photos/living-portrait.webp", alt: "Cosy seating area beneath the skylight", label: "Living room" },
  { src: "/photos/living-sofas.webp", alt: "Comfortable sofas in the open-plan living room", label: "Room to unwind" },
  { src: "/photos/entrance.webp", alt: "Private entrance and outdoor seating", label: "Private entrance" },
  { src: "/photos/sun-terrace.webp", alt: "Outdoor loungers on the sunny deck", label: "Sun terrace" },
  { src: "/photos/garden-view.webp", alt: "Garden seating with mountain views", label: "Garden views" },
  { src: "/photos/kitchen-corner.webp", alt: "Kitchen storage and appliances", label: "Fully equipped" },
  { src: "/photos/kitchen-full.webp", alt: "Spacious fitted kitchen", label: "Kitchen" },
  { src: "/photos/kitchen-sink.webp", alt: "Kitchen sink beside the garden window", label: "A view while cooking" },
  { src: "/photos/kitchen-view.webp", alt: "Cooker and countryside view", label: "Countryside outlook" },
  { src: "/photos/kitchen-window.webp", alt: "Kitchen window overlooking the grounds", label: "Kitchen outlook" },
  { src: "/photos/bedside.webp", alt: "Bedside table and soft neutral linens", label: "Quiet details" },
  { src: "/photos/wardrobe.webp", alt: "Wardrobe storage in the ground-floor bedroom", label: "Bedroom storage" },
  { src: "/photos/loft-desk.webp", alt: "Desk and double bed in the loft bedroom", label: "Work & rest" },
  { src: "/photos/loft-room.webp", alt: "Full view of the bright loft bedroom", label: "Loft bedroom" },
  { src: "/photos/loft-single.webp", alt: "Single bed beneath a skylight", label: "Single bed" },
  { src: "/photos/loft-workspace.webp", alt: "Workspace beneath the loft skylight", label: "Workspace" },
  { src: "/photos/bathroom.webp", alt: "Fresh, compact private bathroom", label: "Bathroom" },
  { src: "/photos/shower.webp", alt: "Walk-in shower", label: "Walk-in shower" },
  { src: "/photos/laundry.webp", alt: "Washing machine and tumble dryer", label: "Laundry facilities" },
  { src: "/photos/dining.webp", alt: "Dining table in the open-plan living room", label: "Dining area" },
];

const featuredGallery = [gallery[0], gallery[3], gallery[4], gallery[5], gallery[2], gallery[8]];

const amenities = [
  { icon: House, title: "Entire chalet", copy: "85 m² of private space with its own entrance" },
  { icon: BedDouble, title: "2 bedrooms", copy: "Two double beds and one single bed" },
  { icon: Users, title: "Sleeps 5", copy: "A comfortable base for families and friends" },
  { icon: Bath, title: "1 bathroom", copy: "Private shower room with towels and toiletries" },
  { icon: CookingPot, title: "Full kitchen", copy: "Oven, hob, microwave, fridge and dining area" },
  { icon: Wifi, title: "Free Wi-Fi", copy: "Wi-Fi throughout plus streaming TV" },
  { icon: ParkingCircle, title: "Private parking", copy: "Free on-site parking for your stay" },
  { icon: WashingMachine, title: "Laundry", copy: "Washing machine and tumble dryer" },
];

const nearby = [
  ["Bundoran town", "Short drive", "Shops, restaurants and the seafront within easy reach"],
  ["Tullan Strand", "2.2 km", "A sweeping Atlantic beach loved by surfers"],
  ["Rougey Cliff Walk", "Nearby", "Clifftop views, Fairy Bridges and Atlantic air"],
  ["Donegal Golf Club", "19 km", "A scenic links course on Murvagh peninsula"],
];

const guestReviews = [
  {
    quote: "Property was so clean and had everything you need.",
    name: "Judge",
    meta: "Ireland · June 2026",
    score: "10/10",
  },
  {
    quote: "Family friendly, spotlessly clean and fresh.",
    name: "Seanie",
    meta: "United Kingdom · May 2025",
    score: "10/10",
  },
  {
    quote: "Everything was great! Spacious, well-furnished, very comfortable beds.",
    name: "Ramon Regozo",
    meta: "Canada · September 2025",
    score: "10/10",
  },
];

const bookingReviewsUrl = "https://www.booking.com/hotel/ie/modern-2-bedroom-chalet-bundoran.html#tab-reviews";

const faqs = [
  ["What are the check-in and check-out times?", "Check-in is from 3:00 PM and check-out is by 10:00 AM. Please share your expected arrival time when you send your request."],
  ["How many guests can stay?", "The Hideaway sleeps up to five guests across two bedrooms, with two double beds and one single bed."],
  ["Can I bring a pet?", "No. Pets are not permitted at The Hideaway."],
  ["What is included?", "Fresh linen, towels, toiletries, free Wi-Fi, a fully equipped kitchen, laundry facilities, private parking and access to the garden and terrace are included."],
  ["Is the home suitable for families?", "Yes. The chalet has family rooms, a high chair, cot availability, baby safety gates and outdoor space. Please mention what you need in your request."],
  ["Is the booking confirmed immediately?", "Your dates are sent as a booking request. The hosts will confirm availability and share the secure payment link directly with you."],
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return <img src="/images/logo.png" alt="The Hideaway holiday home rental" className={`object-contain ${light ? "brightness-0 invert" : ""} ${className}`} />;
}

function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-block reveal-${direction} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function BookingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [dates, setDates] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const nights = useMemo(() => {
    if (!dates?.from || !dates.to) return 0;
    return Math.max(0, differenceInCalendarDays(dates.to, dates.from));
  }, [dates]);

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!dates?.from || !dates.to || !name.trim() || !email.trim()) {
      setError("Please choose your dates and complete your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: format(dates.from, "yyyy-MM-dd"), checkOut: format(dates.to, "yyyy-MM-dd"),
          guests: Number(guests), name: name.trim(), email: email.trim(), phone: phone.trim(),
          message: message.trim(),
        }),
      });
      const result = (await response.json()) as { reference?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "Your request could not be sent.");
      setReference(result.reference || "received");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your request could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetAndClose(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen && reference) {
      window.setTimeout(() => {
        setReference(""); setDates(undefined); setName(""); setEmail("");
        setPhone(""); setMessage("");
      }, 250);
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-[#cfc6ba] bg-[#f7f3ed] p-0 sm:max-w-[820px]">
        {reference ? (
          <div className="px-7 py-14 text-center sm:px-14">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#24323b] text-white"><Check className="size-7" /></div>
            <DialogTitle className="font-display text-4xl font-normal text-[#24323b]">Request received</DialogTitle>
            <DialogDescription className="mx-auto mt-4 max-w-md text-base leading-7 text-[#5f625d]">Thank you, {name}. The hosts will confirm availability and send the next steps to <strong>{email}</strong>.</DialogDescription>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#8c6b4d]">Reference {reference}</p>
            <Button onClick={() => resetAndClose(false)} className="mt-8 rounded-full bg-[#24323b] px-8 text-white hover:bg-[#31434e]">Close</Button>
          </div>
        ) : (
          <form onSubmit={submitBooking}>
            <DialogHeader className="border-b border-[#d8d0c5] px-6 py-6 sm:px-8">
              <p className="eyebrow">Request your stay</p>
              <DialogTitle className="font-display text-3xl font-normal text-[#24323b]">Choose your Donegal dates</DialogTitle>
              <DialogDescription className="text-[#686b65]">No payment is taken now. The hosts will confirm availability first.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-7 px-6 py-7 md:grid-cols-[360px_1fr] md:px-8">
              <div>
                <Label className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#646761]">Check-in — check-out</Label>
                <div className="overflow-hidden rounded-2xl border border-[#d8d0c5] bg-[#fbf8f3] shadow-[0_10px_30px_rgba(36,50,59,0.04)]">
                  <Calendar mode="range" selected={dates} onSelect={setDates} disabled={{ before: new Date() }} className="mx-auto p-4" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-[#ddd4c8] bg-[#fbf8f3] p-3"><span className="block text-xs text-[#7a7c76]">Check-in</span><strong className="font-medium text-[#24323b]">{dates?.from ? format(dates.from, "d MMM yyyy") : "Choose date"}</strong></div>
                  <div className="rounded-xl border border-[#ddd4c8] bg-[#fbf8f3] p-3"><span className="block text-xs text-[#7a7c76]">Check-out</span><strong className="font-medium text-[#24323b]">{dates?.to ? format(dates.to, "d MMM yyyy") : "Choose date"}</strong></div>
                </div>
              </div>
              <div className="space-y-4">
                <div><Label htmlFor="guest-name">Full name *</Label><Input id="guest-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 border-[#d8d0c5] bg-[#fbf8f3]" placeholder="Your full name" autoComplete="name" /></div>
                <div><Label htmlFor="guest-email">Email *</Label><Input id="guest-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 border-[#d8d0c5] bg-[#fbf8f3]" placeholder="you@email.com" autoComplete="email" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label htmlFor="guest-phone">Phone</Label><Input id="guest-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 border-[#d8d0c5] bg-[#fbf8f3]" placeholder="+353…" autoComplete="tel" /></div>
                  <div><Label>Guests</Label><Select value={guests} onValueChange={setGuests}><SelectTrigger className="mt-1.5 w-full border-[#d8d0c5] bg-[#fbf8f3]"><SelectValue /></SelectTrigger><SelectContent>{[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n} guest{n > 1 ? "s" : ""}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div><Label htmlFor="guest-message">Anything we should know?</Label><Textarea id="guest-message" value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1.5 min-h-20 border-[#d8d0c5] bg-[#fbf8f3]" placeholder="Cot, accessibility needs or a special occasion…" /></div>
                <div className="rounded-2xl bg-[#24323b] p-5 text-white">
                  <div className="flex justify-between text-sm text-white/70"><span>Stay</span><span>{nights ? `${nights} night${nights === 1 ? "" : "s"}` : "Choose dates"}</span></div>
                  <div className="mt-2 flex justify-between text-sm text-white/70"><span>Guests</span><span>{guests}</span></div>
                  <div className="mt-4 border-t border-white/15 pt-4"><strong className="font-display text-2xl font-normal">Price confirmed with availability</strong><p className="mt-1 text-sm leading-6 text-white/60">Rates vary by date and length of stay. No payment is taken with this request.</p></div>
                </div>
                {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <Button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-[#a48669] text-sm uppercase tracking-[0.14em] text-white hover:bg-[#8d7056]">{submitting ? "Sending…" : "Send booking request"}</Button>
                <p className="flex items-center justify-center gap-2 text-center text-xs text-[#777971]"><ShieldCheck className="size-4" /> Secure request · no card details collected</p>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function HomeClient() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [allPhotosOpen, setAllPhotosOpen] = useState(false);
  const [galleryImage, setGalleryImage] = useState<(typeof gallery)[number] | null>(null);
  const [headerCompact, setHeaderCompact] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const progressRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const nav = [["Home", "top"], ["About", "stay"], ["Gallery", "gallery"], ["Booking", "booking"], ["Contact", "contact"]];

  useEffect(() => {
    let frame = 0;
    let compact = false;
    const updateScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${scrollable > 0 ? scrollTop / scrollable : 0})`;
        }
        if (heroImageRef.current && scrollTop < window.innerHeight * 1.25) {
          heroImageRef.current.style.transform = `scale(1.055) translate3d(0, ${scrollTop * 0.075}px, 0)`;
        }
        const nextCompact = scrollTop > 72;
        if (nextCompact !== compact) {
          compact = nextCompact;
          setHeaderCompact(nextCompact);
        }
        let currentSection = "top";
        for (const id of ["stay", "gallery", "booking", "location", "reviews", "faq", "contact"]) {
          const section = document.getElementById(id);
          if (section && section.offsetTop <= scrollTop + 180) currentSection = id;
        }
        setActiveSection((current) => current === currentSection ? current : currentSection);
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    type ModelContext = {
      registerTool: (tool: {
        name: string;
        title: string;
        description: string;
        inputSchema: Record<string, unknown>;
        annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
        execute: () => Promise<{ status: string }>;
      }, options?: { signal?: AbortSignal }) => void | Promise<void>;
    };
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "start_booking_request",
      title: "Start booking request",
      description: "Open The Hideaway booking form so the guest can choose dates and send a stay request to the hosts.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute() {
        setBookingOpen(true);
        return { status: "booking_form_open" };
      },
    }, { signal: lifecycle.signal })).catch((error) => console.error("Could not register booking tool", error));
    return () => lifecycle.abort();
  }, []);

  return (
    <main className="overflow-x-hidden bg-[#f7f3ed] text-[#24323b]">
      <div aria-hidden="true" className="page-intro" />
      <div ref={progressRef} aria-hidden="true" className="scroll-progress" />
      <header className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#28333d]/88 text-white backdrop-blur-md transition-all duration-500 ${headerCompact ? "shadow-[0_10px_30px_rgba(20,28,34,.18)]" : ""}`}>
        <div className={`mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-all duration-500 sm:px-8 lg:px-5 ${headerCompact ? "h-16" : "h-[74px]"}`}>
          <button onClick={() => scrollToId("top")} aria-label="Go to top" className="transition-opacity hover:opacity-85">
            <Logo light className={`w-[74px] transition-all duration-500 ${headerCompact ? "h-12" : "h-14"}`} />
          </button>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {nav.map(([label, id]) => (
              <button key={id} onClick={() => scrollToId(id)} className={`nav-link relative py-2 text-[15px] font-medium uppercase tracking-[0.11em] transition-colors ${activeSection === id ? "is-active text-white" : "text-white/72 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </nav>
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="Open menu"><Menu className="size-6" /></Button></SheetTrigger>
            <SheetContent className="border-[#d8d0c5] bg-[#f7f3ed] p-6"><SheetHeader className="p-0"><SheetTitle><Logo className="h-24 w-36" /></SheetTitle></SheetHeader><nav className="mt-10 flex flex-col" aria-label="Mobile navigation">{nav.map(([label, id]) => <SheetClose asChild key={id}><button onClick={() => scrollToId(id)} className="border-b border-[#ded6cb] py-5 text-left font-display text-3xl">{label}</button></SheetClose>)}</nav><SheetClose asChild><Button onClick={() => setBookingOpen(true)} className="mt-8 h-12 rounded-full bg-[#24323b] text-white">Book your stay</Button></SheetClose></SheetContent>
          </Sheet>
        </div>
      </header>

      <section id="top" className="relative h-[100svh] min-h-[760px] overflow-hidden bg-[#1d2a32]">
        <img ref={heroImageRef} src="/photos/living-wide.webp" alt="The Hideaway living room overlooking the Donegal countryside" className="hero-parallax absolute inset-0 size-full object-cover object-center" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,26,32,.55)_0%,rgba(16,26,32,.14)_42%,rgba(16,26,32,.72)_100%)]" />
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center px-5 pb-28 pt-24 text-center text-white">
          <p className="eyebrow !text-white/75 animate-reveal">Bundoran · County Donegal · Ireland</p>
          <h1 className="mt-5 max-w-5xl font-display text-[clamp(4rem,11vw,9.6rem)] font-light leading-[0.82] tracking-[-0.035em] animate-reveal-delay">The Hideaway</h1>
          <p className="hero-copy mt-7 max-w-xl text-lg leading-8 text-white/80 sm:text-xl">A bright two-bedroom chalet for countryside calm, Atlantic air and unhurried Donegal days.</p>
          <Button onClick={() => setBookingOpen(true)} className="motion-button hero-cta mt-9 h-13 rounded-full bg-[#f3eee6] px-8 text-sm uppercase tracking-[0.16em] text-[#24323b] hover:bg-white">Check dates <ArrowRight className="motion-arrow ml-1 size-4" /></Button>
        </div>
        <button onClick={() => scrollToId("stay")} aria-label="Explore the house" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/65"><ChevronDown className="size-7 animate-bounce" /></button>
      </section>

      <section id="booking" className="relative z-20 mx-auto -mt-16 scroll-mt-24 max-w-6xl px-4 sm:px-6">
        <Reveal direction="up"><button onClick={() => setBookingOpen(true)} className="booking-strip grid w-full overflow-hidden rounded-2xl border border-[#d7cec1] bg-[#fbf8f3] text-left shadow-[0_24px_70px_rgba(31,39,43,.16)] md:grid-cols-[1fr_1fr_.75fr_auto]">
          <span className="border-b border-[#ded6cb] p-5 md:border-b-0 md:border-r"><small className="block text-xs uppercase tracking-[0.16em] text-[#7d7e78]">Check-in</small><strong className="mt-1 block font-display text-xl font-normal">Choose your dates</strong></span>
          <span className="border-b border-[#ded6cb] p-5 md:border-b-0 md:border-r"><small className="block text-xs uppercase tracking-[0.16em] text-[#7d7e78]">Check-out</small><strong className="mt-1 block font-display text-xl font-normal">Stay a little longer</strong></span>
          <span className="p-5 md:border-r"><small className="block text-xs uppercase tracking-[0.16em] text-[#7d7e78]">Guests</small><strong className="mt-1 block font-display text-xl font-normal">Up to 5</strong></span>
          <span className="flex items-center justify-center bg-[#a48669] px-8 py-5 text-sm font-medium uppercase tracking-[0.14em] text-white">Check availability <ArrowRight className="motion-arrow ml-3 size-4" /></span>
        </button></Reveal>
      </section>

      <section id="stay" className="scroll-mt-20 px-5 py-28 sm:px-8 lg:py-40">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <Reveal direction="left"><div><p className="eyebrow">A quiet place near the Atlantic</p><h2 className="section-title mt-5">Comfort that feels naturally at home.</h2><p className="mt-7 max-w-xl text-lg leading-8 text-[#646861]">The Hideaway is an 85 m² two-bedroom chalet with a private entrance, open-plan living room and space for up to five guests. Bright rooms and mountain views make it easy to settle in.</p><p className="mt-5 max-w-xl leading-8 text-[#646861]">Spend the morning on Bundoran’s coast, then return to a full kitchen, a shared meal and the private terrace overlooking the countryside.</p><Button onClick={() => setBookingOpen(true)} variant="outline" className="motion-button mt-8 h-12 rounded-full border-[#24323b] bg-transparent px-7 uppercase tracking-[0.12em] hover:bg-[#24323b] hover:text-white">Plan your stay</Button></div></Reveal>
          <Reveal direction="right" delay={120}><div className="image-stack relative min-h-[620px]"><img src="/photos/exterior.webp" alt="The Hideaway chalet exterior" className="stack-image-main absolute left-0 top-0 h-[78%] w-[78%] rounded-[2rem] object-cover shadow-2xl" loading="lazy" decoding="async" /><img src="/photos/terrace-wide.webp" alt="Private terrace with countryside and mountain views" className="stack-image-small absolute bottom-0 right-0 h-[48%] w-[54%] rounded-[1.7rem] border-[10px] border-[#f7f3ed] object-cover shadow-xl" loading="lazy" decoding="async" /><div className="floating-badge absolute bottom-12 left-8 rounded-full bg-[#24323b] px-5 py-3 text-sm text-white shadow-xl"><Mountain className="mr-2 inline size-4" /> Mountain views</div></div></Reveal>
        </div>
      </section>

      <section className="section-wash bg-[#24323b] px-5 py-24 text-white sm:px-8 lg:py-32"><div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><Reveal direction="left"><div><p className="eyebrow !text-[#c7ad91]">Everything you need</p><h2 className="mt-5 max-w-md font-display text-5xl font-light leading-[1.02] sm:text-6xl">Room to arrive, settle in and switch off.</h2></div></Reveal><div className="grid gap-px overflow-hidden rounded-3xl bg-white/12 sm:grid-cols-2">{amenities.map((item, index) => <Reveal key={item.title} delay={index * 65} className="h-full"><div className="amenity-card h-full bg-[#24323b] p-7 sm:p-8"><item.icon className="amenity-icon mb-5 size-6 text-[#c7ad91]" /><h3 className="font-display text-2xl font-normal">{item.title}</h3><p className="mt-2 leading-7 text-white/60">{item.copy}</p></div></Reveal>)}</div></div></div></section>

      <section id="gallery" className="scroll-mt-20 px-5 py-28 sm:px-8 lg:py-40"><div className="mx-auto max-w-7xl"><Reveal><div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Inside and out</p><h2 className="section-title mt-5">See the real Hideaway.</h2></div><p className="max-w-sm leading-7 text-[#696c65]">Every image here is from the property: bright interiors, a private terrace and open Donegal views.</p></div></Reveal><div className="grid auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[280px] md:grid-cols-4">{featuredGallery.map((image, index) => <Reveal key={image.src} delay={index * 75} direction="scale" className={`${index === 0 ? "col-span-2 row-span-2" : ""} ${index === 4 ? "col-span-2" : ""}`}><button onClick={() => setGalleryImage(image)} className="gallery-tile group relative size-full overflow-hidden rounded-[1.4rem] text-left"><img src={image.src} alt={image.alt} className="size-full object-cover transition duration-700 group-hover:scale-[1.06]" loading="lazy" decoding="async" /><span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60 transition group-hover:opacity-90" /><span className="gallery-label absolute bottom-4 left-5 text-sm font-medium text-white">{image.label}</span></button></Reveal>)}</div><Reveal delay={150}><div className="mt-10 text-center"><Button onClick={() => setAllPhotosOpen(true)} variant="outline" className="motion-button h-12 rounded-full border-[#24323b] bg-transparent px-7 uppercase tracking-[0.12em] hover:bg-[#24323b] hover:text-white">View all {gallery.length} photos</Button></div></Reveal></div></section>

      <Dialog open={allPhotosOpen} onOpenChange={setAllPhotosOpen}><DialogContent className="max-h-[92vh] max-w-[calc(100%-1.5rem)] overflow-y-auto border-[#cfc6ba] bg-[#f7f3ed] p-5 sm:max-w-6xl sm:p-7"><DialogHeader className="mb-2"><p className="eyebrow">The full gallery</p><DialogTitle className="font-display text-4xl font-normal text-[#24323b]">The Hideaway, room by room</DialogTitle><DialogDescription className="text-[#686b65]">Real photographs of the chalet, terrace and garden.</DialogDescription></DialogHeader><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{gallery.map((image) => <button key={image.src} onClick={() => { setAllPhotosOpen(false); window.setTimeout(() => setGalleryImage(image), 180); }} className="group relative aspect-[4/3] overflow-hidden rounded-2xl text-left"><img src={image.src} alt={image.alt} className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async" /><span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" /><span className="absolute bottom-3 left-4 text-sm font-medium text-white">{image.label}</span></button>)}</div></DialogContent></Dialog>

      <Dialog open={Boolean(galleryImage)} onOpenChange={(next) => !next && setGalleryImage(null)}><DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none sm:max-w-5xl" showCloseButton={false}>{galleryImage && <><DialogHeader className="sr-only"><DialogTitle>{galleryImage.label}</DialogTitle><DialogDescription>{galleryImage.alt}</DialogDescription></DialogHeader><img src={galleryImage.src} alt={galleryImage.alt} className="max-h-[86vh] w-full rounded-2xl object-contain" /><button onClick={() => setGalleryImage(null)} className="absolute right-3 top-3 rounded-full bg-black/55 px-4 py-2 text-sm text-white backdrop-blur">Close</button></>}</DialogContent></Dialog>

      <section id="location" className="scroll-mt-20 bg-[#e8e1d7] px-5 py-28 sm:px-8 lg:py-36"><div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center"><Reveal direction="left"><div className="location-image overflow-hidden rounded-[2rem]"><img src="/photos/terrace-wide.webp" alt="Private terrace with mountain and garden views at The Hideaway" className="aspect-[4/3] size-full object-cover" loading="lazy" decoding="async" /></div></Reveal><Reveal direction="right" delay={100}><div><p className="eyebrow">Discover Donegal</p><h2 className="section-title mt-5">Bundoran and beyond.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-[#646861]">A short drive from Bundoran town and 2.2 km from Tullan Strand, The Hideaway makes an easy base for beach days, coastal walks and slow drives through the north-west.</p><div className="mt-9 divide-y divide-[#cfc4b6] border-y border-[#cfc4b6]">{nearby.map(([place, distance, copy], index) => <Reveal key={place} delay={140 + index * 70}><div className="nearby-row grid grid-cols-[1fr_auto] gap-5 py-5"><div><h3 className="font-display text-2xl">{place}</h3><p className="mt-1 text-sm text-[#6b6e67]">{copy}</p></div><span className="pt-1 text-sm text-[#8c6b4d]">{distance}</span></div></Reveal>)}</div></div></Reveal></div></section>

      <section id="reviews" className="scroll-mt-20 bg-[#fbfaf7] px-5 py-28 sm:px-8 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Guest stories</p>
              <h2 className="section-title mt-5">Words from our guests.</h2>
              <p className="mx-auto mt-5 max-w-xl leading-7 text-[#6c7069]">A few recent highlights from guests who reviewed The Hideaway on Booking.com.</p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {guestReviews.map((review, index) => (
              <Reveal key={review.name} delay={index * 90} direction="up" className="h-full">
                <article className="review-card flex h-full min-h-[315px] flex-col rounded-[2rem] border border-[#e1ddd5] bg-[#f6f4f0] p-8 sm:p-9">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-1 text-[#657266]" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, star) => <span key={star} aria-hidden="true">★</span>)}
                    </div>
                    <span className="rounded-full border border-[#d9d3c9] bg-white/65 px-3 py-1 text-xs font-semibold tracking-wide text-[#536156]">{review.score}</span>
                  </div>
                  <blockquote className="mt-7 flex-1 font-display text-[1.55rem] font-light italic leading-[1.55] text-[#56616a]">“{review.quote}”</blockquote>
                  <div className="mt-8 border-t border-[#e6e1d9] pt-6">
                    <p className="font-medium text-[#24323b]">{review.name}</p>
                    <p className="mt-1 text-sm text-[#777a73]">{review.meta}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <div className="mt-10 text-center">
              <a href={bookingReviewsUrl} target="_blank" rel="noreferrer" className="motion-button inline-flex h-12 items-center rounded-full border border-[#24323b] px-7 text-sm font-medium uppercase tracking-[0.12em] transition hover:bg-[#24323b] hover:text-white">
                Read more on Booking.com <ArrowRight className="motion-arrow ml-2 size-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 px-5 py-28 sm:px-8 lg:py-36"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.75fr_1.25fr]"><Reveal direction="left"><div><p className="eyebrow">Good to know</p><h2 className="section-title mt-5">Before you arrive.</h2><div className="mt-8 space-y-4 text-[#666a63]"><p className="flex items-center gap-3"><Clock3 className="size-5 text-[#a48669]" /> Check-in 3 PM · check-out 10 AM</p><p className="flex items-center gap-3"><MapPin className="size-5 text-[#a48669]" /> F94, Bundoran, County Donegal</p><p className="flex items-center gap-3"><Users className="size-5 text-[#a48669]" /> 2 bedrooms · up to 5 guests</p></div></div></Reveal><Reveal direction="right" delay={100}><Accordion type="single" collapsible className="border-t border-[#cfc6ba]">{faqs.map(([question, answer], index) => <AccordionItem key={question} value={`item-${index}`} className="faq-item border-[#cfc6ba]" style={{ "--item-index": index } as CSSProperties}><AccordionTrigger className="py-6 font-display text-xl font-normal hover:no-underline">{question}</AccordionTrigger><AccordionContent className="pb-6 pr-8 text-base leading-7 text-[#666a63]">{answer}</AccordionContent></AccordionItem>)}</Accordion></Reveal></div></section>

      <section id="contact" className="scroll-mt-20 bg-[#fbfaf7] px-5 py-28 sm:px-8 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-[clamp(4rem,7vw,6rem)] font-normal leading-none text-[#2b4153]">Contact</h2>
              <p className="mt-5 text-lg text-[#8c6b4d]">We&apos;d love to hear from you</p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.05fr]">
            <Reveal direction="left">
              <form onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const name = String(data.get("name") || ""); const email = String(data.get("email") || ""); const subject = String(data.get("subject") || "Enquiry from The Hideaway website"); const message = String(data.get("message") || ""); window.location.href = `mailto:hello@thehideaway.ie?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`; }} className="rounded-[2rem] border border-[#e3ddd4] bg-[#f6f4f0] p-7 sm:p-9">
                <h3 className="font-display text-3xl font-normal text-[#2b4153]">Send a Message</h3>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div><Label htmlFor="contact-name" className="text-xs uppercase tracking-[0.08em] text-[#53615c]">Name *</Label><Input id="contact-name" name="name" required className="mt-2.5 h-11 rounded-full border-[#e2ddd6] bg-[#fbfaf7] px-4" placeholder="Your name" /></div>
                  <div><Label htmlFor="contact-email" className="text-xs uppercase tracking-[0.08em] text-[#53615c]">Email *</Label><Input id="contact-email" name="email" type="email" required className="mt-2.5 h-11 rounded-full border-[#e2ddd6] bg-[#fbfaf7] px-4" placeholder="you@email.com" /></div>
                </div>
                <div className="mt-6"><Label htmlFor="contact-subject" className="text-xs uppercase tracking-[0.08em] text-[#53615c]">Subject</Label><Input id="contact-subject" name="subject" className="mt-2.5 h-11 rounded-full border-[#e2ddd6] bg-[#fbfaf7] px-4" placeholder="What&apos;s this about?" /></div>
                <div className="mt-6"><Label htmlFor="contact-message" className="text-xs uppercase tracking-[0.08em] text-[#53615c]">Message *</Label><Textarea id="contact-message" name="message" required className="mt-2.5 min-h-36 rounded-2xl border-[#e2ddd6] bg-[#fbfaf7] p-4" placeholder="Tell us how we can help..." /></div>
                <Button type="submit" className="mt-5 h-11 w-full rounded-full bg-[#294154] text-sm uppercase tracking-[0.12em] text-white hover:bg-[#203545]">Send Message <Send className="ml-2 size-4" /></Button>
              </form>
            </Reveal>

            <Reveal direction="right" delay={100}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-[#e3ddd4] bg-[#f6f4f0] p-6"><MapPin className="size-5 text-[#657266]" /><p className="mt-4 text-xs uppercase tracking-[0.08em] text-[#657266]">Address</p><p className="mt-1 leading-6 text-[#2b4153]">The Hideaway, Bundoran, Co. Donegal, Ireland</p></div>
                <div className="rounded-[2rem] border border-[#e3ddd4] bg-[#f6f4f0] p-6"><Mail className="size-5 text-[#657266]" /><p className="mt-4 text-xs uppercase tracking-[0.08em] text-[#657266]">Email</p><a href="mailto:hello@thehideaway.ie" className="mt-1 block text-[#2b4153] hover:underline">hello@thehideaway.ie</a></div>
                <div className="rounded-[2rem] border border-[#e3ddd4] bg-[#f6f4f0] p-6"><Phone className="size-5 text-[#657266]" /><p className="mt-4 text-xs uppercase tracking-[0.08em] text-[#657266]">Phone</p><a href="tel:+353719841234" className="mt-1 block text-[#2b4153] hover:underline">+353 71 984 1234</a></div>
                <div className="rounded-[2rem] border border-[#e3ddd4] bg-[#f6f4f0] p-6"><Clock3 className="size-5 text-[#657266]" /><p className="mt-4 text-xs uppercase tracking-[0.08em] text-[#657266]">Response time</p><p className="mt-1 text-[#2b4153]">Within 24 hours</p></div>
              </div>
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#e3ddd4] bg-[#f6f4f0]">
                <iframe title="Map of Bundoran, County Donegal" src="https://www.google.com/maps?q=Bundoran%2C%20Co.%20Donegal%2C%20Ireland&output=embed" className="h-[300px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cta-section relative overflow-hidden px-5 py-32 text-center text-white sm:px-8 lg:py-44"><img src="/photos/exterior.webp" alt="The Hideaway chalet in Bundoran" className="cta-image absolute inset-0 size-full object-cover object-[center_48%]" loading="lazy" decoding="async" /><div className="absolute inset-0 bg-[#18252d]/70" /><Reveal direction="scale"><div className="relative mx-auto max-w-3xl"><p className="eyebrow !text-white/65">Begin your escape</p><h2 className="mt-5 font-display text-5xl font-light leading-none sm:text-7xl">Donegal is calling.</h2><p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-white/75">Choose your dates and send a request. The hosts will confirm availability and the current rate before any payment.</p><Button onClick={() => setBookingOpen(true)} className="motion-button mt-9 h-13 rounded-full bg-[#f2ece4] px-8 uppercase tracking-[0.14em] text-[#24323b] hover:bg-white">Request your stay</Button></div></Reveal></section>

      <footer className="bg-[#1a272f] px-5 py-16 text-white sm:px-8"><div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_.8fr_.8fr]"><div><Logo light className="h-36 w-52" /><p className="max-w-sm leading-7 text-white/55">A private holiday home on Ireland’s Wild Atlantic coast.</p></div><div><p className="text-xs uppercase tracking-[0.2em] text-white/45">Explore</p><div className="mt-5 flex flex-col gap-3">{nav.map(([label, id]) => <button key={id} onClick={() => scrollToId(id)} className="w-fit text-left text-white/70 hover:text-white">{label}</button>)}</div></div><div><p className="text-xs uppercase tracking-[0.2em] text-white/45">Contact</p><div className="mt-5 space-y-4 text-white/70"><p className="flex gap-3"><MapPin className="mt-1 size-4 shrink-0" /> Bundoran, Co. Donegal, Ireland</p><a href="mailto:hello@thehideaway.ie" className="flex gap-3 hover:text-white"><Mail className="mt-1 size-4 shrink-0" /> hello@thehideaway.ie</a></div></div></div><div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} The Hideaway</p><p>Holiday home rental · Ireland</p></div></footer>

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </main>
  );
}
