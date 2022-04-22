import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";

import Logo from "./Logo";
import "./Sidebar.css";

import { ReactComponent as SummaryIcon } from 'assets/Icon/iconSummary.svg';
import { ReactComponent as UserIcon } from 'assets/Icon/IconUser.svg';
import { ReactComponent as PostIcon } from 'assets/Icon/IconPosts.svg';
import { ReactComponent as AvailableRoomIcon } from 'assets/Icon/IconAvailableRoom.svg';
import { ReactComponent as RandomIcon } from 'assets/Icon/IconRandom.svg';
import { ReactComponent as AdminsIcon } from 'assets/Icon/IconAdmins.svg';

export default function Sidebar() {
  const history = useHistory();

  const [active, setActive] = useState(false)
  const [name, setName] = useState("")
  const [navigation, setNavigation] = useState([
    {
      name: "Summary",
      to: "/",
      icon: SummaryIcon,
      current: true,
      child: null,
    },
    {
      name: "User",
      to: "/user",
      icon: UserIcon,
      current: false,
      child: null,
    },
    {
      name: "Post",
      to: "#",
      icon: PostIcon,
      current: false,
      child: [
        {
          name: "All Post",
          to: "/all-post",
          icon: null,
          current: false,
          child: null,
        },
        {
          name: "Reported Post",
          to: "/reported-post",
          icon: null,
          current: false,
          child: null,
        },
      ],
    },
    {
      name: "Available Room",
      to: "/available-room",
      icon: AvailableRoomIcon,
      current: false,
      child: null,
    },
    {
      name: "Randomization",
      to: "/randomization",
      icon: RandomIcon,
      current: false,
      child: null
    },
    {
      name: "Admin",
      to: "/admin",
      icon: AdminsIcon,
      current: false,
      child: null,
    },
  ]);
  const handleActive = (item) => {
    let path = `/${history.location.pathname.split('/')[1]}`;
    path === item.to ? (item.current = true) : (item.current = false);
  };
  const handleChild = (item) => {
    setActive(active => !active)
    setName(item.name)
  }

  const path = useHistory().location.pathname;
  return (
    <nav aria-label="Sidebar" className="sticky top-0 divide-y divide-gray-300">
      <div className="flex flex-col overflow-y-hidden">
        <Link to="/" className="logo-container mb-4">
          <Logo className="lg:w-40 sm:w-20 text-gray-300" />
        </Link>
        <nav className="border-b border-t border-dark-50 py-4 mx-2 space-y-2">
          {navigation.map((item, idx) => (
            <div id={idx} key={idx} className="sidebar-container">
              <Link
                type="button"
                onClick={item.child ? () => handleChild(item) : handleActive(item)}
                key={item.name}
                to={item.to}
                className={classNames(
                  item.current
                    ? "bg-dark-600 border-2 border-solid border-primary-100 text-gray-100 sidebar-main_container"
                    : "sidebar-main_container text-gray-100 hover:bg-dark-600 hover:bg-opacity-50 dark:text-gray-100",
                  " sidebar-main_containergroup flex items-center px-2 py-2 font-semibold rounded-md antialiased"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex justify-center items-center">

                    {item.icon ? (<item.icon
                      className={classNames(
                        item.current ? "text-gray-100" : "",
                        "mx-auto lg:mx-0 lg:mr-2 flex-shrink-0 h-7 w-7"
                      )}
                      aria-hidden="true"
                    />) : (<div className="mx-auto lg:mx-0 lg:mr-2 flex-shrink-0 h-7 w-7" />)}

                    <span className="hidden lg:block">{item.name}</span>
                  </div>
                  {item.child && (active ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
                  {/* {console.log("checking.. ", item.child && item.child.filter(data => data.to === path))} */}
                </div>
              </Link>
              {item.child && (name === item.name) && (
                <div className={`sidebar-child_container ${active && 'active'}`}>
                  {item.child.map((item) => {

                    return (
                      <Link
                        type="button"
                        onClick={handleActive(item)}
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          item.current
                            ? "bg-dark-600 border-2 border-solid border-primary-100 text-gray-100 rounded-md"
                            : " bg-dark-100 text-gray-100 hover:bg-dark-600 dark:text-gray-100",
                          "  group flex items-center px-2 py-2 font-semibold  antialiased"
                        )}
                      >
                        {item.icon ? (<item.icon
                          className={classNames(
                            item.current ? "text-gray-100" : "",
                            "mx-auto lg:mx-0 lg:mr-2 flex-shrink-0 h-7 w-7"
                          )}
                          aria-hidden="true"
                        />) : (<div className="mx-auto lg:mx-0 lg:mr-2 flex-shrink-0 h-7 w-7" />)}

                        <span className="hidden lg:block">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </nav>
  );
}
