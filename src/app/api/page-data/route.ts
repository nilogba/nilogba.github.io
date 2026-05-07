import { NextResponse } from "next/server";

const experienceData = [
    {
        icon: "/images/icon/blackrock-icon.svg",
        role: "Software Engineer · BlackRock",
        location: "Gurgaon, India",
        startYear: "2021",
        endYear: "Present",
        bulletPoints: [
            "Built Risk-Based Capital Calculator supporting $300bn+ client portfolio deal using SpringBoot and JavaScript",
            "Reduced computation time by 75% through multithreading; integrated Kafka for real-time notifications",
            "Developed Angular frontend processing 100k+ QC alerts and a regression suite saving 50 man-hours per release"
        ]
    },
    {
        icon: "/images/icon/iyf-icon.svg",
        role: "Web Development Intern · India Young Foundation",
        location: "Remote",
        startYear: "May 2020",
        endYear: "Jun 2020",
        bulletPoints: [
            "Built Django backend from scratch with PayTM payment gateway integration and multilingual support",
            "Deployed on DigitalOcean with Nginx and Gunicorn; managed DNS and SSL via GoDaddy",
            "Integrated Cloudflare CDN and Google Analytics for performance and tracking"
        ]
    },
]

const educationData = [
    {
        date: "Jul 2017 – May 2021",
        title: "B.Tech in Information Technology",
        subtitle: "Manipal Institute of Technology — Manipal, Karnataka · CGPA 7.6"
    },
    {
        date: "2015 – 2017",
        title: "All India Senior School Certificate (12th)",
        subtitle: "Delhi Public School — Ranchi · 90.6% (PCM + CS)"
    },
    {
        date: "2004 – 2015",
        title: "All India Secondary School Examination (10th)",
        subtitle: "Delhi Public School — Ranchi · 10 CGPA"
    }
];


const projectOverview = {
    caseStudies: [
        { name: "Wellnest", url: "#" },
        { name: "ScoutHire", url: "#" },
    ],
    sideProjects: [
        { name: "Formless", url: "#" },
        { name: "Gridsnap", comingSoon: true },
        { name: "OrbitPay Mobile App", comingSoon: true },
        { name: "Siteflow Page Builder", comingSoon: true },
    ]
};


export const GET = async () => {
    return NextResponse.json({
        experienceData,
        educationData,
        projectOverview
    });
};
