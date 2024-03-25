import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SubMenu = () => {
  return (
    <Menu.Items
      static
      className="absolute left-full top-0 mt-0 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div className="py-1">
        {[1, 2, 3, 4].map((module) => (
          <Menu.Item key={module}>
            {({ active }) => (
              <a
                href="#"
                className={classNames(
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                  "block px-4 py-2 text-sm",
                )}
              >
                Module {module}
              </a>
            )}
          </Menu.Item>
        ))}
      </div>
    </Menu.Items>
  );
};

const MenuComp = ({ leerjaren }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          onMouseEnter={() => setOpenSubMenu(null)}
          className="inline-flex w-full justify-center gap-x-1.5 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <Bars3Icon
            className="-mx-1 h-10 w-10 text-gray-400"
            aria-hidden="true"
          />
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
          onMouseLeave={() => setOpenSubMenu(null)}
          className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            {leerjaren.map((jaar) => (
              <Menu.Item key={jaar}>
                {({ active }) => (
                  <div className="relative">
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm",
                      )}
                      onMouseEnter={() => setOpenSubMenu(jaar)}
                    >
                      {jaar}
                    </a>
                    {openSubMenu === jaar && <SubMenu />}
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MenuComp;
