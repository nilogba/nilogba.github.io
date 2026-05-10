import Image from "next/image"
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
    const socialIcon = [
        {
            img: "/images/icon/linkedin-icon.svg",
            href: "https://www.linkedin.com/in/ibinsigma/",
            icon: "LinkedIn"
        },
    ];
    return (
        <section>
            <div className="container">
                <div className="">
                    <div className="w-full h-72">
                        <Image src={"/images/hero-sec/banner-bg-img.png"} alt="banner-img" width={1080} height={267} className="w-full h-full object-cover" />
                    </div>
                    <div className="border-x border-primary/10">
                        <div className="relative flex flex-col xs:flex-row items-center xs:items-start justify-center xs:justify-between max-w-3xl mx-auto gap-10 xs:gap-3 px-4 sm:px-7 pt-22 pb-8 sm:pb-12">
                            <div className="absolute top-0 transform -translate-y-1/2">
                                <div className="w-[145px] h-[145px] border-4 border-white rounded-full overflow-hidden relative">
                                    <Image src={"/images/hero-sec/user-img.png"} alt="user-img" fill className="object-cover scale-[1.1]" style={{ transformOrigin: "top center", objectPosition: "center 10%" }} />
                                </div>
                                <span className="absolute bottom-2.5 right-5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex flex-col gap-2 sm:gap-3 items-center text-center xs:items-start">
                                <h1>Niloy Sarkar</h1>
                                <p className="text-violet-700 font-normal">Software Engineer</p>
                                <div className="flex items-center gap-2">
                                    <Image src={"/images/icon/map-icon.svg"} alt="map-icon" width={20} height={20} />
                                    <p className="text-primary">Gurgaon, India</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center xs:items-end gap-3">
                                {/* Row 1: socials + primary CTA buttons */}
                                <div className="flex flex-wrap items-center justify-center xs:justify-end gap-2">
                                    <div className="flex items-center gap-1.5">
                                        {socialIcon?.map((value, index) => (
                                            <Link href={value?.href} key={index} className="w-fit p-2.5 sm:p-3.5 hover:bg-primary/5 border border-primary/10 rounded-full">
                                                <Image src={value?.img} alt={value?.icon} width={18} height={18} />
                                            </Link>
                                        ))}
                                    </div>
                                    <Button asChild className="h-auto rounded-full p-0.5!">
                                        <Link
                                            href="mailto:niloysarkarranchi@gmail.com"
                                            className="inline-block p-0.5 rounded-full bg-[linear-gradient(96.09deg,_#9282F8_12.17%,_#F3CA4D_90.71%)]"
                                        >
                                            <span className="flex items-center gap-2.5 bg-primary hover:bg-[linear-gradient(96.09deg,_#9282F8_12.17%,_#F3CA4D_90.71%)] py-2.5 px-4 rounded-full">
                                                <Image src="/images/icon/spark-icon.svg" alt="spark-icon" width={14} height={14} />
                                                <span className="text-sm sm:text-base font-semibold text-white">Get in touch</span>
                                            </span>
                                        </Link>
                                    </Button>
                                    <Link
                                        href="/training"
                                        className="flex items-center gap-2 bg-[#FC4C02] hover:bg-[#e04300] transition-colors py-2 px-4 rounded-full"
                                    >
                                        <Image src="/images/icon/strava-icon.svg" alt="strava" width={13} height={13} className="invert" />
                                        <span className="text-sm font-semibold text-white">Training</span>
                                    </Link>
                                </div>

                                {/* Row 2: Mountains + Travel buttons */}
                                <div className="flex items-center gap-2">
                                <Link
                                    href="/mountains"
                                    className="relative flex items-center gap-2.5 overflow-hidden rounded-full py-2 px-5 group"
                                    style={{
                                        minWidth: "140px",
                                        background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)",
                                    }}
                                >
                                    {/* Animated mountain layers */}
                                    <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                                        {/* Far peaks — slow sway */}
                                        <svg
                                            className="absolute bottom-0 left-0 w-[160%] h-full animate-mtn-far"
                                            viewBox="0 0 320 48"
                                            preserveAspectRatio="none"
                                        >
                                            <polygon
                                                fill="white"
                                                fillOpacity="0.18"
                                                points="0,48 22,14 44,28 70,4 96,22 120,8 148,26 174,10 200,20 226,6 252,22 278,12 300,24 320,16 320,48"
                                            />
                                        </svg>
                                        {/* Near peaks — faster sway, more opaque */}
                                        <svg
                                            className="absolute bottom-0 left-0 w-[160%] h-full animate-mtn-near"
                                            viewBox="0 0 320 48"
                                            preserveAspectRatio="none"
                                        >
                                            <polygon
                                                fill="white"
                                                fillOpacity="0.38"
                                                points="0,48 16,30 38,40 60,20 82,34 106,22 130,36 154,24 178,38 202,26 226,40 252,28 276,38 298,28 320,34 320,48"
                                            />
                                        </svg>
                                    </span>

                                    {/* Icon: mountain triangle */}
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="white"
                                        className="relative shrink-0"
                                    >
                                        <path d="M2 21l7.5-12L13 14l3.5-6L22 21H2z" opacity="0.5" />
                                        <path d="M7 21l5.5-9L16 17l3-5.5L22 21H7z" />
                                    </svg>
                                    <span className="relative text-sm font-semibold text-white">Mountains</span>
                                </Link>

                                {/* Travel button */}
                                <Link
                                    href="/travel"
                                    className="relative flex items-center gap-2 overflow-hidden rounded-full py-2 px-4"
                                    style={{
                                        background: "linear-gradient(135deg, #0a0f1e 0%, #1a3a6e 100%)",
                                    }}
                                >
                                    {/* Starfield dots */}
                                    <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                                        {[
                                            { cx: "15%", cy: "30%", r: 1 },
                                            { cx: "35%", cy: "65%", r: 0.8 },
                                            { cx: "55%", cy: "25%", r: 1.2 },
                                            { cx: "72%", cy: "70%", r: 0.7 },
                                            { cx: "88%", cy: "40%", r: 1 },
                                        ].map((s, i) => (
                                            <svg key={i} className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <circle cx={s.cx} cy={s.cy} r={s.r} fill="white" fillOpacity="0.5" />
                                            </svg>
                                        ))}
                                    </span>
                                    {/* Globe icon */}
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="relative shrink-0">
                                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
                                        <ellipse cx="12" cy="12" rx="4" ry="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
                                        <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
                                    </svg>
                                    <span className="relative text-sm font-semibold text-white">Travel</span>
                                </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
