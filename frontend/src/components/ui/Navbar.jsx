import React from "react";
import logo from "../../assets/logo/Fitness_Tracker.png";
import Avatar from "../../assets/Avatar/Avatar.png";

const Navbar = () => {
  return (
    <div className="absolute flex justify-center items-center w-full top-5 ">
      <nav className="bg-[#ffffff4b] z-20 px-10 py-2.5 rounded-full">
        <div className="max-w-screen-xl flex flex-wrap items-center mx-auto p-4">
          <a
            href="#"
            className="flex items-center mr-17 space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-10" alt="Flowbite Logo" />
          </a>
          {/* <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="flex text-sm bg-neutral-primary rounded-full ml-10 md:me-0 focus:ring-1 focus:ring-neutral-tertiary"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-10 h-10 rounded-full"
                src={Avatar}
                alt="user photo"
              />
            </button>
            <div
              className="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44"
              id="user-dropdown"
            >
              <div className="px-4 py-3 text-sm border-b border-default">
                <span className="block text-heading font-medium">
                  Ismail Abdullah
                </span>
                <span className="block text-body truncate">
                  ismail@gmail.com
                </span>
              </div>
              <ul
                className="p-2 text-sm text-body font-medium"
                aria-labelledby="user-menu-button"
              >
                <li>
                  <a
                    href="#"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                  >
                    Earnings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>

            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </button>
          </div> */}

          {/* <div
            className=" items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          > */}
            {/* <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                >
                  Contact
                </a>
              </li>
            </ul> */}
            <div className="flex justify-between gap-2.5 w-fit ">
              <button className="hover:text-primary text-foreground font-normal py-2 px-4 rounded-full font-urbanist">
                Login
              </button>
              <button className="bg-foreground hover:brightness-95 text-white font-normal py-2 px-4 rounded-full font-urbanist">
                Register
              </button>
            </div>
          {/* </div> */}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
