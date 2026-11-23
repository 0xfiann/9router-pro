"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { APP_CONFIG } from "@/shared/constants/config";
import { MEDIA_PROVIDER_KINDS } from "@/shared/constants/providers";
import useSettingsStore from "@/store/settingsStore";

// const VISIBLE_MEDIA_KINDS = ["embedding", "image", "imageToText", "tts", "stt", "webSearch", "webFetch", "video", "music"];
const VISIBLE_MEDIA_KINDS = ["embedding", "image", "video", "tts", "stt", "systemone"];
// Combined entry: webSearch + webFetch share one page at /dashboard/media-providers/web
const COMBINED_WEB_ITEM = { id: "web", label: "Web Fetch & Search", icon: "travel_explore", href: "/dashboard/media-providers/web" };

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", color: "#E879F9" },
  { href: "/dashboard/endpoint", label: "Endpoint & Key", icon: "api", color: "#A78BFA" },
  { href: "/dashboard/providers", label: "Providers", icon: "dns", color: "#60A5FA" },
  { href: "/dashboard/combos", label: "Combos", icon: "layers", color: "#F472B6" },
  { href: "/dashboard/usage", label: "Usage", icon: "bar_chart", color: "#34D399" },
  { href: "/dashboard/admin", label: "Admin", icon: "admin_panel_settings", color: "#F87171" },
  { href: "/dashboard/spam", label: "Spam", icon: "shield", color: "#FB923C" },
  { href: "/dashboard/quota", label: "Provider Quota", icon: "data_usage", color: "#2DD4BF" },
  { href: "/dashboard/token-saver", label: "Token Saver", icon: "savings", color: "#FBBF24" },
  { href: "/dashboard/prompt-injection", label: "Prompt Injection", icon: "skull", color: "#C084FC", badge: "PRO" },
  { href: "/dashboard/cli-tools", label: "CLI Tools", icon: "terminal", color: "#22D3EE" },
];

const debugItems = [
  { href: "/dashboard/console-log", label: "Console Log", icon: "monitor", color: "#FB923C" },
  { href: "/dashboard/translator", label: "Translator (debug)", icon: "translate", color: "#818CF8" },
];

const systemItems = [
  { href: "/dashboard/proxy-pools", label: "Proxy Pools", icon: "lan", color: "#38BDF8" },
  { href: "/dashboard/automation", label: "Automation", icon: "tune", color: "#FB923C" },
  { href: "/dashboard/skills", label: "Skills", icon: "extension", color: "#34D399" },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  // Media accordion opens by default (G13/G17): hidden kinds were
  // undiscoverable when closed with no hint of what sits inside.
  const [mediaOpen, setMediaOpen] = useState(true);
  const [enableTranslator, setEnableTranslator] = useState(false);

  const mainNavItems = navItems;

  useEffect(() => {
    useSettingsStore.getState().fetchSettings().then((data) => {
      if (data?.enableTranslator) setEnableTranslator(true);
    });
  }, []);

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    if (href === "/dashboard/endpoint") {
      return pathname.startsWith("/dashboard/endpoint");
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex w-72 flex-col border-r border-border-subtle transition-colors duration-300 h-full max-h-dvh overflow-hidden">
      {/* Traffic lights */}
      <div className="flex items-center gap-2 px-4 sm:px-6 pt-5 pb-2">
        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
      </div>

      {/* Logo */}
      <div className="px-6 py-4 flex flex-col gap-2">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img src="/logo.svg" alt="9router_Pro" className="size-12 rounded-[12px]" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight text-text-main">
              {APP_CONFIG.name}
            </h1>
            <span className="text-xs text-text-muted">v{APP_CONFIG.version}</span>
          </div>
        </Link>
      </div>

        {/* Navigation */}
        <nav className="flex-1 min-h-0 px-4 py-2 space-y-0.5 overflow-y-auto overscroll-contain custom-scrollbar">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-surface-2 hover:text-text-main"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[18px]",
                  isActive(item.href) ? "fill-1" : "group-hover:text-primary transition-colors"
                )}
                style={item.color ? { color: item.color } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[13px] font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {/* System section */}
          <div className="pt-3 mt-2 space-y-0.5">
            <p className="px-4 text-xs font-semibold text-text-muted/60 uppercase tracking-wider mb-2">
              System
            </p>

            {/* Media Providers accordion */}
            <button
              onClick={() => setMediaOpen((v) => !v)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                pathname.startsWith("/dashboard/media-providers")
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-surface-2 hover:text-text-main"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">perm_media</span>
              <span className="text-[13px] font-medium flex-1 text-left">Media Providers</span>
              <span className="material-symbols-outlined text-[14px] transition-transform" style={{ transform: mediaOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                expand_more
              </span>
            </button>
            {mediaOpen && (
              <div className="pl-4">
                {MEDIA_PROVIDER_KINDS.filter((k) => VISIBLE_MEDIA_KINDS.includes(k.id)).map((kind) => (
                  <Link
                    key={kind.id}
                    href={`/dashboard/media-providers/${kind.id}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-all group",
                      pathname.startsWith(`/dashboard/media-providers/${kind.id}`)
                        ? "bg-primary/10 text-primary"
                        : "text-text-muted hover:bg-surface-2 hover:text-text-main"
                    )}
                  >
                    <span className="material-symbols-outlined text-[16px]">{kind.icon}</span>
                    <span className="text-sm">{kind.label}</span>
                  </Link>
                ))}
                <Link
                  key={COMBINED_WEB_ITEM.id}
                  href={COMBINED_WEB_ITEM.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all group",
                    pathname.startsWith(COMBINED_WEB_ITEM.href)
                      ? "bg-primary/10 text-primary"
                      : "text-text-muted hover:bg-surface-2 hover:text-text-main"
                  )}
                >
                  <span className="material-symbols-outlined text-[16px]">{COMBINED_WEB_ITEM.icon}</span>
                  <span className="text-sm">{COMBINED_WEB_ITEM.label}</span>
                </Link>
              </div>
            )}

            {systemItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-surface-2 hover:text-text-main"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[18px]",
                    isActive(item.href) ? "fill-1" : "group-hover:text-primary transition-colors"
                  )}
                style={item.color ? { color: item.color } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-[13px] font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Debug items (inside System section, before Settings) */}
            {debugItems.map((item) => {
              const show = item.href !== "/dashboard/translator" || enableTranslator;
              return show ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-text-muted hover:bg-surface-2 hover:text-text-main"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-[18px]",
                      isActive(item.href) ? "fill-1" : "group-hover:text-primary transition-colors"
                    )}
                  style={item.color ? { color: item.color } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[13px] font-medium">{item.label}</span>
                </Link>
              ) : null;
            })}

            {/* Settings */}
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                isActive("/dashboard/profile")
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-surface-2 hover:text-text-main"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[18px]",
                  isActive("/dashboard/profile") ? "fill-1" : "group-hover:text-primary transition-colors"
                )}
                style={{ color: "#60A5FA" }}
              >
                settings
              </span>
              <span className="text-[13px] font-medium">Profile & Settings</span>
            </Link>

            {/* Remote */}
            <a
              href="https://9remote.cc"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group w-full",
                "text-text-muted hover:bg-surface-2 hover:text-text-main"
              )}
            >
              <span className="material-symbols-outlined text-[18px] group-hover:text-primary transition-colors">
                computer
              </span>
              <span className="text-[13px] font-medium">9Remote</span>
              <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400">
                HOT
              </span>
            </a>

            {/* 9English */}
            <a
              href="https://9english.net/"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group w-full",
                "text-text-muted hover:bg-surface-2 hover:text-text-main"
              )}
            >
              <span className="material-symbols-outlined text-[18px] group-hover:text-primary transition-colors">
                translate
              </span>
              <span className="text-[13px] font-medium">9English</span>
            </a>

            {/* Docs & Help */}
            <a
              href="https://github.com/0xfiann/9router-pro#-quick-start-pro"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group w-full",
                "text-text-muted hover:bg-surface-2 hover:text-text-main"
              )}
            >
              <span className="material-symbols-outlined text-[18px] group-hover:text-primary transition-colors">
                help
              </span>
              <span className="text-[13px] font-medium">Docs & Help</span>
            </a>

          </div>
        </nav>
      </aside>
  );
}

Sidebar.propTypes = {
  onClose: PropTypes.func,
};
