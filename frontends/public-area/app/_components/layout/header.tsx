"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/public/img/icon.png";

import { useEffect, useState } from "react";
import { getBlogCategories, BlogCategory } from "@/app/_services/blog-category.service";
import { TutorialTopic, getTutorialTopics } from "@/app/_services/tutorial-topic.service";

export default function Header() {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [noScroll, setNoScroll] = useState(false);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [tutorialTopics, setTutorialTopics] = useState<TutorialTopic[]>([]);

  useEffect(() => {
    getBlogCategories()
      .then((categories) => setBlogCategories(categories))
      .catch((error) => console.error(error));

    getTutorialTopics()
      .then((topics) => setTutorialTopics(topics))
      .catch((error) => console.error(error));

    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsOpen(false);
        setNoScroll(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setNoScroll(!noScroll);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setNoScroll(false);
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="header-top d-flex justify-content-between align-items-center">
            <div className="header-top-logo">
              <Link href={`/home/1`}>
                <Image
                  width={32}
                  height={32}
                  src={logo}
                  alt="Artur's Dev Blog Logo"
                />
              </Link>
            </div>
            <div className="header-top-text d-none d-lg-block"></div>
            <div className="d-flex align-items-center d-lg-block position-relative">
              <Link
                href="#"
                className="light-link d-block d-lg-none"
                title="Menu"
              >
                <div
                  id="menu-animate-icon"
                  className={`header-top-nav-menu-icon ${isOpen ? "open" : ""}`}
                  onClick={toggleMenu}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Link>
            </div>
          </div>
          <nav className="header-nav d-none d-lg-block">
            <ul className="d-block d-lg-flex">
              <li
                className={
                  currentPath === "/" || currentPath?.startsWith("/home") || currentPath?.startsWith("/blog")
                    ? "active dropdown"
                    : "dropdown"
                }
              >
                <Link
                  href={`/home/1`}
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                  title="Blog Articles"
                >
                  Blog Articles
                </Link>
                <ul className="dropdown-menu">
                  {blogCategories &&
                    blogCategories.map((category) => (
                      <li
                        key={category.id}
                        className={`nav-elipse-${category.color}`}
                      >
                        <Link
                          href={`/blog/category/${category.slug}/page/1`}
                          title={`${category.name} Blog Articles`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>
              <li
                className={currentPath?.startsWith("/tutorials") ? "active dropdown" : "dropdown"}
              >
                <Link
                  href={`/tutorials/all`} 
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                  title="Tutorials"
                >
                  Tutorials
                </Link>
                <ul className="dropdown-menu">
                  {tutorialTopics && tutorialTopics.map((topic) => (
                    <li
                      key={topic.id}
                      className={`nav-elipse-${topic.color}`}
                    >
                      <Link
                        href={`/tutorials/topic/${topic.slug}`}
                        title={`${topic.name} Tutorials`}
                      >
                        {topic.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li
                className={currentPath?.startsWith("/portfolio") ? "active" : ""}
              >
                <Link href={`/portfolio/all`} title="My Projects">
                  My Projects
                </Link>
              </li>
              <li
                className={currentPath?.startsWith("/about-me") ? "active" : ""}
              >
                <Link href={`/about-me`} title="About Me">
                  About Me
                </Link>
              </li>
              <li
                className={currentPath?.startsWith("/contact") ? "active" : ""}
              >
                <Link href={`/contact`} title="Contact Me">
                  Contact Me
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <nav
        className={`mobile-nav ${isOpen ? "mobile-nav-open" : ""} header-nav`}
      >
        <div className="container">
          <div className="row">
            <div id="mobile-menu" className="col-lg-12">
              <ul className="d-block d-lg-flex">
              <li
                className={
                  currentPath === "/" || currentPath?.startsWith("/home") || currentPath?.startsWith("/blog")
                    ? "active dropdown"
                    : "dropdown"
                }
              >
                <Link
                  href={`/home/1`}
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                  title="Blog Articles"
                >
                  Blog Articles
                </Link>
                <ul className="dropdown-menu">
                  {blogCategories &&
                    blogCategories.map((category) => (
                      <li
                        key={category.id}
                        className={`nav-elipse-${category.color}`}
                      >
                        <Link
                          href={`/blog/category/${category.slug}`}
                          title={`${category.name} Blog Articles`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>
              <li
                className={currentPath?.startsWith("/tutorials") ? "active dropdown" : "dropdown"}
              >
                <Link
                  href={`/tutorials/all`}
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                  title="Tutorials"
                >
                  Tutorials
                </Link>
                <ul className="dropdown-menu">
                  {tutorialTopics && tutorialTopics.map((topic) => (
                    <li
                      key={topic.id}
                      className={`nav-elipse-${topic.color}`}
                    >
                      <Link
                        href={`/tutorials/topic/${topic.slug}/page/1`}
                        title={`${topic.name} Tutorials`}
                      >
                        {topic.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li
                className={currentPath?.startsWith("/portfolio") ? "active" : ""}
              >
                <Link href={`/portfolio/all`} title="My Projects">
                  My Projects
                </Link>
              </li>
              <li
                className={currentPath?.startsWith("/about-me") ? "active" : ""}
              >
                <Link href={`/about-me`} title="About Me">
                  About Me
                </Link>
              </li>
              <li
                className={currentPath?.startsWith("/contact") ? "active" : ""}
              >
                <Link href={`/contact`} title="Contact Me">
                  Contact Me
                </Link>
              </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
