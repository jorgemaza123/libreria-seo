"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookImage,
  Grid2x2,
  Home,
  Mail,
  Menu,
  Package2,
  Wrench,
} from "lucide-react";
import type { NavItem } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  "#hero": Home,
  "#categorias": Grid2x2,
  "#servicios": Wrench,
  "#productos": Package2,
  "#catalogos": BookImage,
  "#contacto": Mail,
};

type RailItem = NavItem & {
  Icon: LucideIcon;
};

export function SectionRail({ items, suspended = false }: { items: NavItem[]; suspended?: boolean }) {
  const railItems = useMemo<RailItem[]>(
    () =>
      items
        .filter((item) => item.isVisible && item.href.startsWith("#"))
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          ...item,
          Icon: iconMap[item.href] ?? Menu,
        })),
    [items]
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeHref, setActiveHref] = useState("#hero");
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasActivatedGlass, setHasActivatedGlass] = useState(false);

  useEffect(() => {
    const updateViewport = () => setIsDesktopViewport(window.innerWidth >= 768);

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const mobileViewport = window.innerWidth < 768;
      const shouldShow = window.scrollY > (mobileViewport ? 36 : 110);
      setIsVisible(shouldShow);
      if (!shouldShow) {
        setIsExpanded(false);
        if (mobileViewport) {
          setHasActivatedGlass(false);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!railItems.length) return;

    const sections = railItems
      .map((item) => document.getElementById(item.href.replace("#", "")))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    let frameId = 0;

    const updateActiveSection = () => {
      const mobileViewport = window.innerWidth < 768;
      const probeLine = window.innerHeight * (mobileViewport ? 0.28 : 0.4);
      let nextActive = `#${sections[0].id}`;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= probeLine) {
          nextActive = `#${section.id}`;
        }

        if (rect.top <= probeLine && rect.bottom >= probeLine) {
          nextActive = `#${section.id}`;
          break;
        }
      }

      setActiveHref((current) => (current === nextActive ? current : nextActive));
      frameId = 0;
    };

    const requestUpdate = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [railItems]);

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  useEffect(() => {
    if (suspended) {
      setIsExpanded(false);
      setHasActivatedGlass(false);
    }
  }, [suspended]);

  useEffect(() => {
    if (isDesktopViewport) {
      setHasActivatedGlass(false);
      return;
    }

    if (!isExpanded && hasActivatedGlass) {
      const timeoutId = window.setTimeout(() => {
        setHasActivatedGlass(false);
      }, 180);

      return () => window.clearTimeout(timeoutId);
    }
  }, [hasActivatedGlass, isDesktopViewport, isExpanded]);

  const scrollToSection = useCallback((href: string) => {
    const section = document.getElementById(href.replace("#", ""));

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHref(href);
    } else {
      window.location.hash = href;
    }

    setTimeout(() => {
      setIsExpanded(false);
      setHasActivatedGlass(false);
    }, 140);
  }, []);

  const handleItemClick = useCallback(
    (href: string) => {
      if (!isDesktopViewport) {
        setHasActivatedGlass(true);
      }

      if (!isExpanded) {
        setIsExpanded(true);
        setActiveHref(href);
        return;
      }

      scrollToSection(href);
    },
    [isDesktopViewport, isExpanded, scrollToSection]
  );

  if (!railItems.length) return null;

  const glassEnabled = isExpanded || (isDesktopViewport ? isHovered : hasActivatedGlass);

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menu lateral"
        onClick={() => {
          setIsExpanded(false);
          if (!isDesktopViewport) {
            setHasActivatedGlass(false);
          }
        }}
        className={`fixed inset-0 z-[58] bg-black/45 transition-opacity duration-300 ${
          isExpanded ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`pointer-events-none fixed left-2.5 top-1/2 z-[59] flex -translate-y-1/2 transition-all duration-300 md:bottom-24 md:left-0 md:top-24 md:translate-y-0 ${
          isVisible && !suspended ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
        }`}
        aria-hidden={!isVisible || suspended}
      >
        <div className="absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-black/78 via-black/40 to-transparent sm:w-20 md:block md:w-24" />

        <aside
          className="pointer-events-auto relative flex h-full items-end pl-0 md:items-center md:pl-3"
          onMouseEnter={() => {
            if (isDesktopViewport) setIsHovered(true);
          }}
          onMouseLeave={() => {
            if (isDesktopViewport) setIsHovered(false);
          }}
          onPointerDown={() => {
            if (!isDesktopViewport) setHasActivatedGlass(true);
          }}
        >
          <div
            className={`relative overflow-hidden rounded-3xl transition-all duration-300 md:rounded-r-[24px] md:rounded-l-none ${
              isExpanded
                ? `w-48 sm:w-52 md:w-56 ${
                    glassEnabled
                      ? "border border-white/10 bg-black/28 shadow-[0_18px_48px_rgba(0,0,0,0.36)] backdrop-blur-2xl"
                      : "border border-white/8 bg-black/14 shadow-[0_12px_26px_rgba(0,0,0,0.18)] backdrop-blur-sm"
                  }`
                : `w-[46px] sm:w-[50px] md:w-[68px] ${
                    glassEnabled
                      ? "border border-white/10 bg-black/24 shadow-[0_14px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                      : "border border-white/5 bg-black/5 shadow-[0_6px_16px_rgba(0,0,0,0.10)] backdrop-blur-0"
                  }`
            }`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-b transition-opacity duration-300 ${
                glassEnabled
                  ? isExpanded
                    ? "from-white/[0.11] via-white/[0.03] to-transparent opacity-100"
                    : "from-white/[0.05] via-white/[0.015] to-transparent opacity-95"
                  : "from-white/[0.01] via-transparent to-transparent opacity-45"
              }`}
            />
            <div className={`absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent to-transparent transition-opacity duration-300 ${glassEnabled ? "via-white/20 opacity-100" : "via-white/8 opacity-40"}`} />
            <div className={`absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent to-transparent transition-opacity duration-300 ${glassEnabled ? "via-white/8 opacity-100" : "via-white/6 opacity-35"}`} />

            <div className="relative flex flex-col gap-1.5 p-1.5 md:gap-2 md:p-2">
              {railItems.map(({ href, label, Icon }) => {
                const isActive = activeHref === href;

                return (
                  <button
                    key={href}
                    type="button"
                    aria-label={label}
                    title={label}
                    onClick={() => handleItemClick(href)}
                    className={`group relative flex h-10 items-center rounded-[18px] px-2 transition-all duration-300 sm:h-11 sm:rounded-xl sm:px-2.5 md:h-12 md:rounded-2xl md:px-3 ${
                      isExpanded ? "w-full justify-start gap-3" : "w-full justify-center"
                    } ${
                      isActive
                        ? "bg-white/12 text-white shadow-[0_0_22px_rgba(255,255,255,0.06)]"
                        : "text-white/72 hover:bg-white/10 hover:text-white hover:shadow-[0_0_18px_rgba(255,255,255,0.04)]"
                    }`}
                    >
                      <span
                        className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary/30 via-primary to-primary/40 transition-all duration-300 md:h-7 ${
                          isActive ? "opacity-100 shadow-[0_0_14px_rgba(34,197,94,0.45)]" : "opacity-0"
                        }`}
                      />
                      <span
                        className={`absolute left-1.5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-primary/12 blur-xl transition-opacity duration-300 sm:left-2 sm:h-9 sm:w-9 md:h-10 md:w-10 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <Icon className={`h-[15px] w-[15px] flex-shrink-0 transition-transform duration-300 group-hover:scale-110 sm:h-4 sm:w-4 md:h-5 md:w-5 ${isActive ? "text-primary drop-shadow-[0_0_10px_rgba(34,197,94,0.35)]" : ""}`} />
                      <span
                        className={`overflow-hidden whitespace-nowrap text-xs font-semibold transition-all duration-300 sm:text-sm ${
                          isExpanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"
                        }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setIsExpanded((current) => {
                    const next = !current;

                    if (!isDesktopViewport) {
                      setHasActivatedGlass(next);
                    }

                    return next;
                  });
                }}
                aria-label={isExpanded ? "Contraer menu lateral" : "Expandir menu lateral"}
                className={`mt-1 flex h-10 items-center rounded-[18px] border px-2 text-white/78 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-[0_0_18px_rgba(255,255,255,0.04)] sm:h-11 sm:rounded-xl sm:px-2.5 md:h-12 md:rounded-2xl md:px-3 ${
                  isExpanded ? "justify-start gap-3" : "justify-center"
                } ${
                  glassEnabled
                    ? isExpanded
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-white/8 bg-white/[0.03]"
                    : "border-white/6 bg-white/[0.01]"
                }`}
              >
                <Menu className="h-[15px] w-[15px] flex-shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span
                  className={`overflow-hidden whitespace-nowrap text-xs font-semibold transition-all duration-300 sm:text-sm ${
                    isExpanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"
                  }`}
                >
                  Menu
                </span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
