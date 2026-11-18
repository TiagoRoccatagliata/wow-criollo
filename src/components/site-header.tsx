"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  Menu,
  Search,
  ShieldCheck,
  ShieldPlus,
  SquarePen,
  Trophy,
  UsersRound,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { WOW_ASSETS } from "@/lib/wow-assets";
import { brand } from "@/lib/brand";

const navigation = [
  {
    label: "Grupos",
    links: [
      { href: "/grupos", label: "Buscar grupos", icon: Search },
      { href: "/publicar", label: "Publicar búsqueda", icon: SquarePen },
    ],
  },
  {
    label: "Comunidad",
    links: [
      { href: "/comunidad", label: "Comunidad", icon: UsersRound },
      {
        href: "/ranking",
        label: "Estadísticas",
        icon: ChartNoAxesColumnIncreasing,
      },
    ],
  },
];

const upcoming = [
  { label: "Hermandades", icon: ShieldPlus },
  { label: "Eventos", icon: CalendarDays },
  { label: "Ranking PvP", icon: Trophy },
  { label: "Guías", icon: BookOpen },
];

export function SiteHeader({ discord }: { discord: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="header-inner">
        <button
          ref={menuButton}
          type="button"
          className="icon-button mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="main-nav"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <a
          href="https://worldofwarcraft.blizzard.com/"
          className="game-logo"
          aria-label="World of Warcraft, sitio oficial de Blizzard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={WOW_ASSETS.logo}
            alt="World of Warcraft Forever"
            width={276}
            height={234}
            preload
            unoptimized
          />
        </a>
        <Link
          href="/"
          className="brand"
          aria-label={`${brand.name}, inicio`}
          onClick={() => setOpen(false)}
        >
          <span>{brand.name}</span>
          <small>{brand.tagline}</small>
        </Link>
        <span className="brand-context">WoW Forever</span>
        <div className="header-actions">{discord}</div>
      </div>
      <nav
        id="main-nav"
        className={`main-nav ${open ? "is-open" : ""}`}
        aria-label="Navegación principal"
      >
        {navigation.map(({ label, links }) => (
          <div className="nav-section" key={label}>
            <h2 className="nav-heading">{label}</h2>
            <ul className="nav-list">
              {links.map(({ href, label, icon: Icon }) => {
                const active =
                  path === href ||
                  path.startsWith(`${href}/`) ||
                  (href === "/grupos" && path === "/");
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`nav-link${active ? " active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{label}</span>
                      {active && (
                        <ChevronRight
                          className="nav-chevron"
                          size={15}
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div className="nav-section nav-upcoming">
          <h2 className="nav-heading">Próximamente</h2>
          <ul className="nav-list">
            {upcoming.map(({ label, icon: Icon }) => (
              <li className="nav-link nav-preview" key={label}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/comunidad#reglas"
          className="nav-link sidebar-rules"
          onClick={() => setOpen(false)}
        >
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Reglas de la comunidad</span>
        </Link>
      </nav>
      {open && (
        <button
          className="menu-backdrop"
          aria-label="Cerrar navegación"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
