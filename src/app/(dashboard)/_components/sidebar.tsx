import { SettingsIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

import { DottedSeparator } from "@/components/dotted-separator";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Home", href: "", icon: GoHome, activeIcon: GoHomeFill },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image
          className="w-auto h-auto"
          src="/logo.svg"
          alt="logo"
          height={48}
          width={164}
          priority
        />
      </Link>
      <DottedSeparator className="my-4" />
      <div className="flex flex-col">
        {routes.map((route) => {
          const isActive = false;
          const Icon = isActive ? route.activeIcon : route.icon;

          return (
            <Link key={route.href} href={route.href}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                  {
                    "bg-white shadow-sm hover:opacity-100 text-primary":
                      isActive,
                  }
                )}
              >
                <Icon className="size-5 text-neutral-500" />
                {route.label}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
