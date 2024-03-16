"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";

export default function SideMenu() {
  const currentPath = usePathname();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [menuItems, setMenuItems] = useState([
    {
      category: "Main",
      items: [
        {
          icon: "fe fe-home",
          label: "Dashboard",
          href: "/",
          isExpanded: false
        },
        {
          icon: "fe fe-users",
          label: "User Management",
          href: "/user-management",
          isExpanded: false
        },
      ],
    },
    {
      category: "Content Management",
      items: [
        {
          icon: "fe fe-layers",
          label: "Blog",
          href: "javascript:void(0)",
          isExpanded: currentPath?.startsWith("/blog"),
          items: [
            { icon: "fe fe-grid", label: "Blog Categories", href: "/blog/category" },
            { icon: "fe fe-layers", label: "Blog Articles", href: "/blog/articles" },
          ]
        },
        {
          icon: "fe fe-layers",
          label: "Tutorials",
          href: "javascript:void(0)",
          isExpanded: currentPath?.startsWith("/tutorials"),
          items: [
            { icon: "fe fe-grid", label: "Tutorial Categories", href: "/tutorials/category" },
            { icon: "fe fe-grid", label: "Tutorial Topics", href: "/tutorials/topic" },
            { icon: "fe fe-grid", label: "Tutorial Chapter", href: "/tutorials/chapter" },
            { icon: "fe fe-layers", label: "Tutorial Articles", href: "/tutorials/articles" },
          ]
        },
        {
          icon: "fe fe-slack",
          label: "Portfolio Projects",
          href: "/portfolio",
          isExpanded: false, 
        },
        {
          icon: "fe fe-folder",
          label: "File Manager",
          href: "/media",
          isExpanded: false
        },
      ],
    },
    {
      category: "Profile Management",
      items: [
        {
            icon: "fe fe-mail",
            label: "Messages Inbox",
            href: "/inbox",
            isExpanded: false
        }
      ],
    },
  ]);

  const toggleExpand = (index: number, subIndex: number) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index].items[subIndex].isExpanded = !newMenuItems[index].items[subIndex].isExpanded;
    setMenuItems(newMenuItems);
  };

  return (
    <>
      {isLoggedIn && (
        <ul className="side-menu">
          {menuItems.map((section, idx) => (
            <React.Fragment key={`Fragment_${idx}`}>
              <li className="sub-category">
                <h3>{section.category}</h3>
              </li>
              {section.items.map((item, i) => (
                <li className={`slide ${item.isExpanded ? 'is-expanded' : ''}`} key={`slide_${(i+1)}`}>
                  <Link
                    className="side-menu__item"
                    data-bs-toggle="slide"
                    href={!!item.items ? "#" : item.href}
                    onClick={() => toggleExpand(idx, i)}
                  >
                    <i className={`side-menu__icon ${item.icon}`}></i>
                    <span className="side-menu__label">{item.label}</span>
                    {item.items && (
                      <i className="angle fe fe-chevron-right"></i>
                    )}
                  </Link>
                  {item.items && (
                    <ul className="slide-menu">
                      <li className="side-menu-label1"><Link href="#">{item.label}</Link></li>
                      {item.items && item.items.map((sub_item, j) => (
                        <li key={`slide-item_${(i+1)*(j+1)}`}><Link className="slide-item" href={sub_item.href}> {sub_item.label}</Link></li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      )}
    </>
  );
}
