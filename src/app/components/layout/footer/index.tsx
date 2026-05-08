const Footer = () => {
    return (
        <footer className="-translate-y-[1px] bg-white border-t border-primary/10">
            <div className="container">
                <div className="border-x border-primary/10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-7 py-4 md:py-6 flex flex-col gap-1.5">
                        <p>© 2026 All Rights Reserved · Made with ❤️ by Niloy</p>
                        <p className="flex items-center gap-1.5 text-sm text-secondary/60 flex-wrap">
                            <span className="font-mono text-xs">vibe coded by nilogba with</span>
                            {/* Claude / Anthropic logo mark */}
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-label="Claude"
                                style={{ color: "#D97706" }}
                            >
                                <path
                                    d="M12 2C12 2 16 7 16 12C16 17 12 22 12 22C12 22 8 17 8 12C8 7 12 2 12 2Z"
                                    fill="currentColor"
                                    opacity="0.9"
                                />
                                <path
                                    d="M2 12C2 12 7 8 12 8C17 8 22 12 22 12C22 12 17 16 12 16C7 16 2 12 2 12Z"
                                    fill="currentColor"
                                    opacity="0.9"
                                />
                            </svg>
                            <span
                                className="italic"
                                style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#D97706", fontSize: "0.8rem" }}
                            >
                                Claude
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
