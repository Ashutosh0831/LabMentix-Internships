"use client";
import Navbar from "../components/Navbar/page";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Navbar />

      <MotionConfig transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="h-screen flex flex-col items-center justify-center text-center px-6 
        bg-linear-to-br from-blue-50 to-blue-100 relative">

          {/* Background circles */}
          <div className="absolute top-10 right-10 w-60 h-60 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-indigo-300 opacity-20 rounded-full blur-3xl"></div>

          {/* Main Content */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-gray-900 leading-snug"
          >
            Fast • Safe • Affordable <br />
            <span className="text-blue-600">Cab Booking Platform</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 mt-4 max-w-xl"
          >
            Book rides instantly, track your driver in real-time, and enjoy a 
            seamless travel experience — anytime, anywhere.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 mt-8"
          >
            <Link
              href="/booking/index"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg shadow-lg"
            >
              Book a Ride
            </Link>

          </motion.div>

          {/* Optional Car Illustration */}
          <motion.img
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            src="https://pngimg.com/uploads/taxi/taxi_PNG33.png"
            alt="Cab illustration"
            className="w-[350px] mt-12 drop-shadow-2xl bg-transparent"
          />
        </div>
      </MotionConfig>
    </>
  );
}
