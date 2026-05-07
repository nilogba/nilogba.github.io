"use client";
import Image from "next/image"
import Link from "next/link"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FeaturedWork = () => {
    const [featureWork, setFeatureWork] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/featured-work')
            .then(r => r.json())
            .then(data => setFeatureWork(data?.featureWork || []))
            .catch(console.error);
    }, []);

    return (
        <section>
            <div className="container">
                <div className="border-x border-primary/10">
                    <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
                        <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
                            <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Resume</p>
                            <Button asChild variant={"outline"} className="h-auto">
                                <Link href={"/"} className="py-3 px-5">
                                    Download Resume
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-primary/10">
                        {featureWork?.map((value: any, index: number) => {
                            const isRightCol = index % 2 === 1;
                            return (
                                <div
                                    key={index}
                                    className={`group flex flex-col gap-3.5 sm:gap-5 p-3.5 sm:p-6 ${isRightCol ? 'md:border-l md:border-primary/10' : ''}`}
                                >
                                    <div className="overflow-hidden">
                                        {value?.image?.startsWith("http") ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={value.image}
                                                alt={value.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
                                            />
                                        ) : (
                                            <Image
                                                src={value?.image}
                                                alt={value?.title}
                                                width={490}
                                                height={300}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 px-2">
                                        {value?.url ? (
                                            <Link href={value.url} target="_blank" rel="noopener noreferrer"><h4 className="hover:underline">{value?.title}</h4></Link>
                                        ) : (
                                            <h4>{value?.title}</h4>
                                        )}
                                        <p className="text-secondary font-normal text-sm">{value?.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {value?.roles?.map((role: string, i: number) => (
                                                <Badge variant="outline" key={i} className="py-1.5 px-3 rounded-lg">
                                                    <p className="text-xs sm:text-sm font-medium text-primary">{role}</p>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedWork;
