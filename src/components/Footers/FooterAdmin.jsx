"use client";
import React from "react";

export default function FooterAdmin() {
  return (
    <>
      <footer className="w-full z-10 bottom-0 bg-gray-400 py-1">
        <div className="container mx-auto px-2">
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-md text-white font-semibold py-1 text-center md:text-left">
                Copyright © {new Date().getFullYear()}{" "}
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li>
                  <a
                    href="https://www.creative-tim.com?ref=nnjs-footer-admin"
                    className="text-slate-100 hover:text-slate-800 text-md font-semibold block py-1 px-3"
                  >
                    TeenByte Tech Lab
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.creative-tim.com/presentation?ref=nnjs-footer-admin"
                    className="text-slate-100 hover:text-slate-800 text-md font-semibold block py-1 px-3"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="http://blog.creative-tim.com?ref=nnjs-footer-admin"
                    className="text-slate-100 hover:text-slate-800 text-md font-semibold block py-1 px-3"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/creativetimofficial/notus-nextjs/blob/main/LICENSE.md?ref=nnjs-footer-admin"
                    className="text-slate-100 hover:text-slate-800 text-md font-semibold block py-1 px-3"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
