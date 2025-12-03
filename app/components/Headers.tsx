"use client"

import * as React from "react"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


export function Headers() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">ST</span>
                        </div>
                        <span className="font-bold text-lg text-gray-900 hidden sm:block">SourceTalk</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <NavigationMenu viewport={false} className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/materials">Materials</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/suppliers">Suppliers</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/chat">Chatbot</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-1">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/materials"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Materials
                            </Link>
                            <Link
                                href="/suppliers"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Suppliers
                            </Link>
                            <Link
                                href="/chat"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Chatbot
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
