import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Cormorant_Garamond } from "next/font/google"
import Divider from "../components/divider"

const serif = Cormorant_Garamond({
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    variable: "--font-serif",
})

export const metadata: Metadata = {
    title: "for ruby",
    description: "a little scroll of us",
    robots: { index: false, follow: false },
}

const CDN = "https://res.cloudinary.com/dfdfd6mjf/image/upload"
const cld = (publicId: string, w = 1600) =>
    `${CDN}/f_auto,q_auto,w_${w}/${publicId}`

const IMG = {
    drama1:  { id: "drama1_bgfwyh",  w: 2102, h: 1576 },
    bhrigu1: { id: "bhrigu1_w7qv00", w: 2102, h: 1576 },
    bhrigu2: { id: "bhrigu2_lxq6qf", w: 1182, h: 1576 },
    mehr1:   { id: "mehr1_po1wpu",   w: 1182, h: 1576 },
    mehr2:   { id: "mehr2_szs6aq",   w: 1182, h: 1576 },
    eat1:    { id: "eat1_xpgaha",    w: 1182, h: 1576 },
    angry1:  { id: "angry1_adj54n",  w: 1182, h: 1576 },
}

function ChapterMarker({ numeral, label }: { numeral: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <span className="w-px h-10 bg-primary/20" />
            <span className="w-2 h-2 rounded-full bg-primary/40" />
            <span className={`${serif.className} text-primary/80 text-lg tracking-[0.35em] uppercase`}>
                {numeral}
            </span>
            <span className="text-[11px] tracking-[3px] uppercase text-secondary/80">
                {label}
            </span>
        </div>
    )
}

function Photo({
    src, width, height, alt = "", priority = false, className = "",
}: {
    src: string
    width: number
    height: number
    alt?: string
    priority?: boolean
    className?: string
}) {
    return (
        <div className={`relative overflow-hidden rounded-lg shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] bg-primary/5 ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 720px"
                className="w-full h-auto object-cover"
            />
        </div>
    )
}

export default function RubyPage() {
    return (
        <main className={`${serif.variable} bg-[#fbf7f2]`}>
            <section>
                <div className="container">
                    <div className="border-x border-primary/10 bg-[#fbf7f2]">
                        {/* Nav back */}
                        <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                            >
                                ← Home
                            </Link>
                        </div>

                        {/* Hero */}
                        <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-16 sm:pt-24 pb-20 sm:pb-28 flex flex-col items-center text-center">
                            <p className="text-[11px] tracking-[4px] uppercase text-primary/70">
                                a little scroll
                            </p>
                            <h1 className={`${serif.className} mt-6 text-5xl sm:text-7xl font-normal italic text-primary leading-none`}>
                                for ruby
                            </h1>
                            <p className={`${serif.className} mt-8 text-xl sm:text-2xl text-secondary italic max-w-md`}>
                                four moments, in the order they happened —
                                and everything they still mean to me.
                            </p>
                        </div>

                        {/* Chapter I — Drama One */}
                        <article className="max-w-3xl mx-auto px-4 sm:px-7 pb-24 sm:pb-32 flex flex-col items-center">
                            <ChapterMarker numeral="I" label="the beginning" />

                            <h2 className={`${serif.className} mt-10 text-4xl sm:text-5xl italic text-primary text-center leading-tight`}>
                                Drama, Connaught Place
                            </h2>
                            <p className={`${serif.className} mt-6 text-2xl sm:text-3xl text-primary/85 text-center italic max-w-xl leading-snug`}>
                                &ldquo;This is where it all started.&rdquo;
                            </p>
                            <p className="mt-6 text-secondary text-base sm:text-lg leading-relaxed max-w-xl text-center">
                                So grateful that I got to meet you on 17th
                                June, 2026. Everything happens for a reason,
                                they say — I hadn&rsquo;t been drinking for a
                                couple of months, but thanks to the little
                                spiral I was on, I decided to go out on a date
                                for drinks (BEST ROI DRINKING SESH EVER :P).
                                And then the house got sealed. I don&rsquo;t
                                think anyone has benefitted this much from
                                being thrown out of their own house, lol.
                                Found my love, went on a couple of amazing
                                trips, got a couple of weeks of WFH — all
                                thanks to the DTPE, Haryana.
                            </p>

                            <div className="mt-12 w-full">
                                <Photo
                                    src={cld(IMG.drama1.id, 1800)}
                                    width={IMG.drama1.w}
                                    height={IMG.drama1.h}
                                    alt="Drama, Connaught Place"
                                    priority
                                />
                            </div>
                        </article>

                        {/* Chapter II — Bhrigu */}
                        <article className="max-w-3xl mx-auto px-4 sm:px-7 pb-24 sm:pb-32 flex flex-col items-center">
                            <ChapterMarker numeral="II" label="bhrigu lake" />

                            <h2 className={`${serif.className} mt-10 text-4xl sm:text-5xl italic text-primary text-center leading-tight`}>
                                Above the clouds
                            </h2>
                            <p className={`${serif.className} mt-6 text-2xl sm:text-3xl text-primary/85 text-center italic max-w-xl leading-snug`}>
                                &ldquo;I&rsquo;m really appreciative.&rdquo;
                            </p>
                            <p className="mt-6 text-secondary text-base sm:text-lg leading-relaxed max-w-xl text-center">
                                You take on mountains the way most people take on
                                Sunday afternoons — steady, unbothered, somehow
                                always a step ahead of me. Watching you climb up
                                to Bhrigu, I couldn&rsquo;t stop grinning. Proud
                                is a small word for it. I&rsquo;m quietly
                                stunned by your fitness, by the pace you set, by
                                the way the hills and your lungs seem to have
                                come to some private agreement. This version of
                                you is one of my favourites.
                            </p>

                            <div className="mt-12 w-full">
                                <Photo
                                    src={cld(IMG.bhrigu1.id, 1800)}
                                    width={IMG.bhrigu1.w}
                                    height={IMG.bhrigu1.h}
                                    alt="Bhrigu, together"
                                />
                            </div>
                            <div className="mt-4 w-full sm:w-3/4">
                                <Photo
                                    src={cld(IMG.bhrigu2.id, 1400)}
                                    width={IMG.bhrigu2.w}
                                    height={IMG.bhrigu2.h}
                                    alt="Bhrigu, you against the ridge"
                                />
                            </div>
                        </article>

                        {/* Chapter III — Rajasthan */}
                        <article className="max-w-3xl mx-auto px-4 sm:px-7 pb-24 sm:pb-32 flex flex-col items-center">
                            <ChapterMarker numeral="III" label="rajasthan, on the road" />

                            <h2 className={`${serif.className} mt-10 text-4xl sm:text-5xl italic text-primary text-center leading-tight`}>
                                Jaipur, Jodhpur, <br className="hidden sm:block" />
                                Pushkar, Ajmer
                            </h2>
                            <p className={`${serif.className} mt-6 text-2xl sm:text-3xl text-primary/85 text-center italic max-w-2xl leading-snug`}>
                                &ldquo;The best road trip I&rsquo;ve ever had,
                                with the best co-passenger.&rdquo;
                            </p>
                            <p className="mt-6 text-secondary text-base sm:text-lg leading-relaxed max-w-xl text-center">
                                Travelling with you is easy in a way I
                                didn&rsquo;t know travelling could be. Every
                                meal figured out before I noticed I was hungry,
                                every detour turned into a memory, every long
                                stretch of highway soft and unhurried. It
                                didn&rsquo;t feel like a trip — it felt like a
                                honeymoon. Fun, at ease, taken care of. One of
                                the best times of my life, and I&rsquo;ll carry
                                it with me for a long, long time.
                            </p>

                            <div className="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Photo
                                    src={cld(IMG.mehr1.id, 1200)}
                                    width={IMG.mehr1.w}
                                    height={IMG.mehr1.h}
                                    alt="Rajasthan, one"
                                />
                                <Photo
                                    src={cld(IMG.mehr2.id, 1200)}
                                    width={IMG.mehr2.w}
                                    height={IMG.mehr2.h}
                                    alt="Rajasthan, two"
                                />
                                <div className="sm:col-span-2 sm:w-3/4 sm:mx-auto">
                                    <Photo
                                        src={cld(IMG.eat1.id, 1400)}
                                        width={IMG.eat1.w}
                                        height={IMG.eat1.h}
                                        alt="Eating our way through it"
                                    />
                                </div>
                            </div>
                        </article>

                        {/* Chapter IV — Angry One */}
                        <article className="max-w-3xl mx-auto px-4 sm:px-7 pb-24 sm:pb-32 flex flex-col items-center">
                            <ChapterMarker numeral="IV" label="the quirks" />

                            <h2 className={`${serif.className} mt-10 text-4xl sm:text-5xl italic text-primary text-center leading-tight`}>
                                Angry One
                            </h2>
                            <p className={`${serif.className} mt-6 text-2xl sm:text-3xl text-primary/85 text-center italic max-w-xl leading-snug`}>
                                &ldquo;I love your quirks, and I love the way
                                you get angry and mad at me. I wish I could
                                annoy you forever.&rdquo;
                            </p>
                            <p className="mt-6 text-secondary text-base sm:text-lg leading-relaxed max-w-xl text-center">
                                The little glare. The huff. The way you look at
                                me like I&rsquo;ve committed a small crime for
                                something I barely did. I love all of it. I
                                hope I get to keep annoying you the rest of our
                                lives — you make even being mad at me feel a
                                lot like coming home.
                            </p>

                            <div className="mt-12 w-full sm:w-3/4">
                                <Photo
                                    src={cld(IMG.angry1.id, 1400)}
                                    width={IMG.angry1.w}
                                    height={IMG.angry1.h}
                                    alt="Angry One"
                                />
                            </div>
                        </article>

                        {/* Outro */}
                        <div className="max-w-3xl mx-auto px-4 sm:px-7 pb-24 sm:pb-32 flex flex-col items-center text-center">
                            <span className="w-px h-16 bg-primary/20" />
                            <p className={`${serif.className} mt-8 text-2xl sm:text-3xl italic text-primary/85 max-w-md`}>
                                more chapters, please.
                            </p>
                            <p className="mt-4 text-sm tracking-[2px] uppercase text-secondary/80">
                                — n
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Divider />
        </main>
    )
}
