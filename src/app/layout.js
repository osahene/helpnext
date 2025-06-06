import localFont from "next/font/local";
import dynamic from "next/dynamic";
import "./globals.css";
import GlobalLoading from "./GlobalLoading";
import ReduxProvider from "./reduxProvider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Toaster } from "react-hot-toast";
config.autoAddCss = false;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Help OO Help",
  description:
    "An Emergency response system for the modern world. It aids to swiftly broadcast vital information to your loved ones in case of an emergency.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <Toaster position="bottom-center" />
          <GlobalLoading />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
