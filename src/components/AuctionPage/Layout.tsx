import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoveRight, Ticket, User } from "lucide-react";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <Ticket className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl">CinemaBidBlitz</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link to="/main/auctions" className="text-sm font-medium hover:text-primary transition-colors">
                            Auctions
                        </Link>
                        <Link to="/my-bids" className="text-sm font-medium hover:text-primary transition-colors">
                            My Bids
                        </Link>
                        <Link to="/sell-ticket" className="text-sm font-medium hover:text-primary transition-colors">
                            Sell a Ticket
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                            <User className="h-4 w-4 mr-2" />
                            Sign In
                        </Button>
                        <Button variant="default" size="sm">
                            Get Started
                            <MoveRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 bg-background">{children}</main>
            <footer className="bg-muted/30 py-6 border-t">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <Link to="/" className="flex items-center space-x-2">
                                <Ticket className="h-5 w-5 text-primary" />
                                <span className="font-bold">CinemaBidBlitz</span>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                                Resell movie tickets quickly and easily
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <Link to="/about" className="hover:text-primary transition-colors">
                                About
                            </Link>
                            <Link to="/help" className="hover:text-primary transition-colors">
                                Help
                            </Link>
                            <Link to="/privacy" className="hover:text-primary transition-colors">
                                Privacy
                            </Link>
                            <Link to="/terms" className="hover:text-primary transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                    <div className="mt-6 text-center text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} CinemaBidBlitz. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
