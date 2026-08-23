import { Link } from "react-router-dom";
import { Github, ExternalLink } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t border-green-800/10 bg-green-100/20 backdrop-blur-lg">
            <div className="container mx-auto py-8 max-w-8xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    {/* Brand */}
                    <div className="flex flex flex-col">
                        <Link to="/" className="shrink-0">
                            <img
                                src="/SussyGeek_logo.avif"
                                alt="SussyGeek"
                                className="h-10 w-auto"
                            />
                        </Link>

                        <div className="h-3 w-px bg-green-800/15" />

                        <p className="text-sm text-muted-foreground text-xs">
                            Search. Compare. <span className="text-green-600 font-semibold">Contribute</span>
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-5 text-sm text-muted-foreground">
                        <Link
                            to="/institutions"
                            className="transition-colors hover:text-green-700"
                        >
                            Institutions
                        </Link>

                        <a
                            href="https://github.com/SussyGeek"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-green-700"
                        >
                            GitHub
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                    </nav>
                </div>

                {/* Bottom line */}
                <div className="mt-6 flex flex-col gap-2 border-t border-green-800/10 pt-5 text-xs text-muted-foreground/70 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        © {new Date().getFullYear()} SussyGeek
                    </span>

                    <span>
                        Built by Anant Chavan with ☕.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;