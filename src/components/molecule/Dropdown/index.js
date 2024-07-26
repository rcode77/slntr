import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

export default function Dropdown({
  title,
  className,
  width,
  position,
  children,
  customDropdown,
  parentWidth,
  parentWidthDiv,
  id,
}) {
  return (
    <div className={`text-right ${parentWidth}`}>
      <Menu
        as="div"
        className={`inline-block text-left relative ${parentWidthDiv}`}
      >
        <div className="">
          <Menu.Button
            id={id}
            className={` w-full justify-center rounded-md  text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${className} `}
          >
            {title}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            style={{
              width: width,
            }}
            className={`absolute mt-2 ${
              customDropdown ? customDropdown : "bg-white"
            } max-w-lg z-30 origin-top-right divide-y  rounded-md  ring-opacity-5 focus:outline-none ${position}`}
          >
            {children}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

// absolute mt-2 w-[${width}] max-w-lg z-30 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${position}
