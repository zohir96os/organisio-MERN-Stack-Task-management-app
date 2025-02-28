import Menu from "../components/Menu";
import { motion } from "framer-motion";
import { ClipboardIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <>
      <div className="relative hero-section bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 flex items-center justify-center">
        <ClipboardIcon className="h-12 w-12 mr-4" />
        <div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-extrabold"
          >
            Organisio
          </motion.h1>
          <p className="mt-4 text-lg max-w-lg mx-auto">
            Organisio is a creative, made-up word inspired by Organize giving it
            a modern and tech-friendly feel.
          </p>
        </div>
      </div>
      <Menu />
    </>
  );
}
