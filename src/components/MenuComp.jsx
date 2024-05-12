import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SubMenu = (year) => {
  return (
    <Menu.Items
      static
      className="absolute left-full top-0 mt-0 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div className="py-1">
        {[1, 2, 3, 4].map((module) => (
          <Menu.Item key={module}>
            {({ active }) => (
              <Link
                to={`/module/${year.year}/${module}`}
                className={classNames(
                  active ? "bg-gray-200 text-gray-900" : "text-gray-700",
                  "block px-4 py-2 text-sm",
                )}
              >
                Module {module}
              </Link>
            )}
          </Menu.Item>
        ))}
      </div>
    </Menu.Items>
  );
};

const MenuComp = ({ schoolYears }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  return (
    <Menu as="div" className="relative inline-block text-left w-20">
      <Menu.Button
        onMouseEnter={() => setOpenSubMenu(null)}
        className="inline-flex h-full aspect-square justify-center gap-x-1.5 bg-[#a1a6a2] text-sm font-semibold text-gray-900 shadow-sm  hover:bg-[#8f9490] rounded"
      >
        <Bars3Icon
          className="-mx-1 h-12 w-12 text-white my-auto"
          aria-hidden="true"
        />
      </Menu.Button>

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
          onMouseLeave={() => setOpenSubMenu(null)}
          className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            {[1, 2, 3, 4].map((yearNumber) => (
              <Menu.Item key={yearNumber}>
                {({ active }) => (
                  <div className="relative">
                    <div
                      className={classNames(
                        active ? "bg-gray-200 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm",
                      )}
                      onMouseEnter={() => setOpenSubMenu(yearNumber)}
                    >
                      {schoolYears[yearNumber - 1]}
                    </div>
                    {openSubMenu === yearNumber && (
                      <SubMenu year={yearNumber} />
                    )}
                  </div>
                )}
              </Menu.Item>
            ))}
            <Menu.Item key={5}>
              {({ active }) => (
                <div className="relative">
                  <Link
                    to="/portfolio"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm",
                    )}
                    onMouseEnter={() => setOpenSubMenu(null)}
                  >
                    Officieel portfolio
                  </Link>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MenuComp;
