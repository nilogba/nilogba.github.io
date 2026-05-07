import { NextResponse } from "next/server";

const featureWork = [
    {
        title: "Terrain Classifier · Computer Vision",
        description: "5-class terrain classifier using Support Vector Machines with OpenCV and HOG feature extraction — trained to identify terrain types from image data.",
        roles: ["Python", "OpenCV", "Scikit-learn"],
        image: "/images/feature-work/feature-img-1.png"
    },
    {
        title: "BSE vs NSE · Stock Price Comparison",
        description: "Real-time web app for comparing live stock prices across Bombay Stock Exchange and National Stock Exchange. Enter any BSE-listed company and instantly see a live graph of price differences between the two exchanges.",
        roles: ["Python", "Flask", "Web Scraping"],
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/BSE_building_at_Dalal_Street.JPG",
        url: "https://github.com/ibinsigma/BSE-vs-NSE-Stock"
    }
]

export const GET = async () => {
    return NextResponse.json({
        featureWork
    });
};
