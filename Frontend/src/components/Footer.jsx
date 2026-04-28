import React from "react";

const Footer = () => {

  return (
    <footer className="bg-[#1B1B1E] text-[#F2E9E4] border-t border-[#5C3D2E]/40 mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-10">

        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold text-[#C9A66B]">
              BiteFlix
            </h2>
            <p className="text-[#F2E9E4]/70 text-sm mt-2 max-w-sm">
              Food that feels like entertainment. Scroll, crave, order.
            </p>
          </div>

          {/* LINKS */}
          <div className="flex gap-10 text-sm text-[#F2E9E4]/70">
            <div className="space-y-2">
              <p className="text-[#F2E9E4] font-medium">Company</p>
              <p className="hover:text-[#C9A66B] cursor-pointer transition">
                About
              </p>
              <p className="hover:text-[#C9A66B] cursor-pointer transition">
                Careers
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[#F2E9E4] font-medium">Support</p>
              <p className="hover:text-[#C9A66B] cursor-pointer transition">
                Help
              </p>
              <p className="hover:text-[#C9A66B] cursor-pointer transition">
                Contact
              </p>
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-[#5C3D2E]/40 my-8" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#F2E9E4]/50">
          <p>© {new Date().getFullYear()} BiteFlix</p>
          <p className="mt-2 md:mt-0">
            Crafted for cravings 🍔
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;