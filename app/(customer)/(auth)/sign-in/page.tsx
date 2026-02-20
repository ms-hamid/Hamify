"use client";

import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Card } from "@/components/ui/card";
import { SignInForm } from "./_components/sign-in-form";
import { SignUpForm } from "./_components/sign-up-form";

export default function CustomerAuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
                <ModeToggle />
            </div>

            {/* Container utama, dibatasi ukurannya agar pas untuk UI side-by-side */}
            <div className="relative w-full max-w-4xl h-[650px] md:h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Card className="absolute bg-background inset-0 overflow-hidden shadow-2xl rounded-2xl flex border-0">

                    {/* 
                     =====================================================
                     1. BACK LAYER (FORM KIRI & FORM KANAN)
                     ===================================================== 
                     Lapisan ini statis di belakang. 
                     Form Sign In di sisi KIRI. Form Sign Up di sisi KANAN.
                    */}
                    <div className="absolute inset-0 flex w-full h-full">
                        {/* Area Kiri: Tempat Form Sign In */}
                        <div className="w-1/2 h-full flex items-center justify-center p-8 opacity-0 md:opacity-100 z-10 transition-opacity duration-300"
                            style={{ opacity: isLogin ? 1 : 0, pointerEvents: isLogin ? 'auto' : 'none' }}
                        >
                            {/* Form Sign-In. onToggle diarahkan ke false (pindah ke Signup) */}
                            <div className="w-full max-w-md">
                                <SignInForm onToggle={() => setIsLogin(false)} />
                            </div>
                        </div>

                        {/* Area Kanan: Tempat Form Sign Up */}
                        <div className="w-1/2 h-full flex items-center justify-center p-8 opacity-0 md:opacity-100 z-10 transition-opacity duration-300"
                            style={{ opacity: !isLogin ? 1 : 0, pointerEvents: !isLogin ? 'auto' : 'none' }}
                        >
                            {/* Form Sign-Up. onToggle diarahkan ke true (pindah ke Signin) */}
                            <div className="w-full max-w-md">
                                <SignUpForm onToggle={() => setIsLogin(true)} />
                            </div>
                        </div>
                    </div>


                    {/* 
                     =====================================================
                     2. FRONT LAYER (OVERLAY GAMBAR YANG BERGESER)
                     ===================================================== 
                     Lapisan ini menutupi 50% lebar layar dan posisinya absolut.
                     Jika isLogin = true  -> Overlay geser ke KANAN   (menutupi form SignUp).
                     Jika isLogin = false -> Overlay geser ke KIRI    (menutupi form SignIn).
                    */}
                    <div
                        className={`absolute top-0 bottom-0 w-1/2 z-20 flex overflow-hidden bg-zinc-900 transition-transform duration-700 ease-in-out hidden md:block`}
                        style={{ transform: isLogin ? 'translateX(100%)' : 'translateX(0%)' }}
                    >

                        {/* 
                          Di dalam kotak overlay yang bergeser ini, kita letakkan 2 gambar 
                          dengan posisi absolute yang di control agar tampil dan redup sesuai status.
                        */}

                        {/* GAMBAR 1: Tampil saat Sign In (Panel ada di Kanan) */}
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop"
                            alt="Sign In Background"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isLogin ? 'opacity-100' : 'opacity-0'}`}
                            style={{ filter: 'brightness(0.6)' }}
                        />

                        {/* GAMBAR 2: Tampil saat Sign Up (Panel ada di Kiri) */}
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop"
                            alt="Sign Up Background"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${!isLogin ? 'opacity-100' : 'opacity-0'}`}
                            style={{ filter: 'brightness(0.6)' }}
                        />

                        {/* Opsional: Text di atas Banner/Gambar */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white">
                            <h2 className="text-3xl font-bold tracking-tight mb-4 transition-all duration-500">
                                {isLogin ? "Welcome Back!" : "Hello, Friend!"}
                            </h2>
                            <p className="text-lg opacity-80 text-balance transition-all duration-500">
                                {isLogin
                                    ? "To keep connected with us please login with your personal info."
                                    : "Enter your personal details and start journey with us."}
                            </p>

                            {/* Tombol alternatif overlay (jika tidak ingin pakai text di bawah form) */}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="mt-8 px-8 py-3 rounded-full border border-white text-white font-semibold hover:bg-white hover:text-black transition-colors"
                            >
                                {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                        </div>

                    </div>

                    {/* MOBILE VIEW FALLBACK:
                        Pada HP (width < md), overlay digambar di-hidden. 
                        Kita render form secara berurutan biasa agar layout aman.
                        Sembari menyesuaikan behavior Mobile di luar container flex-row jika diperlukan.
                    */}
                    <div className="md:hidden absolute inset-0 flex items-center bg-background px-4">
                        {isLogin ? (
                            <SignInForm onToggle={() => setIsLogin(false)} />
                        ) : (
                            <SignUpForm onToggle={() => setIsLogin(true)} />
                        )}
                    </div>
                </Card>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4 z-10">
                By clicking continue, you agree to our <a href="#" className="underline hover:text-primary">Terms of Service</a>{" "}
                and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
            </div>
        </div>
    );
}
