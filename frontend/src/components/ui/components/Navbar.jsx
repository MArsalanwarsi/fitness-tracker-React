import React from "react";
import logo from "../../../assets/logo/Fitness_Tracker.png";
import Avatar from "../../../assets/Avatar/Avatar.png";
import { Link } from "react-router-dom"
import { useSelector } from "react-redux";

const Navbar = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  return (
    <div className="w-full flex justify-center items-center pt-5">
      <nav className="bg-[#ffffff4b] z-20 px-4 sm:px-10 py-2 rounded-full">
        <div className="max-w-screen-xl flex items-center justify-between w-full mx-auto p-2">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} className="w-auto h-6 sm:h-8 md:h-10" alt="Flowbite Logo" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-15">
            {!loggedIn ? (
              <>
                <Link to="/login">
                  <button className="hover:text-primary text-foreground font-normal py-1.5 px-3 sm:py-2 sm:px-4 rounded-full font-urbanist text-sm sm:text-base hover:cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-foreground hover:brightness-95 text-white font-normal py-1.5 px-3 sm:py-2 sm:px-4 rounded-full font-urbanist text-sm sm:text-base hover:cursor-pointer">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <button className="bg-foreground hover:brightness-95 text-white font-normal py-1.5 px-3 sm:py-2 sm:px-4 rounded-full font-urbanist text-sm sm:text-base hover:cursor-pointer">
                  Dashboard
                </button>
              </Link>
            )}
            {/* <button className="ml-1 p-0.5 rounded-full flex items-center justify-center">
              <img src={Avatar} alt="avatar" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover" />
            </button> */}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
