"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  Frame,
  PieChart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux";
import { NavSecondary } from "./nav-secondary";
import { Link } from "react-router-dom";
const data = {
  teams: [
    {
      name: "Arsalan Inc.",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Ismail Inc.",
      logo: AudioWaveform,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      platform: "Main",
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      platform: "Main",
      title: "Excersise",
      url: "Excersise",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Add Excersise",
          url: "Excersise/addExcersise",
        },
        {
          title: "Add Category",
          url: "Excersise/addCategory",
        },
        {
          title: "View Excersise",
          url: "Excersise/viewExcersise",
        },
        {
          title: "View Categories",
          url: "Excersise/viewCategories",
        },
      ],
    },
    {
      platform: "Main",
      title: "Nutritions",
      url: "Nutritions",
      icon: PieChart,
      isActive: false,
      items: [
        {
          title: "Nutritions",
          url: "Nutritions/Nutritions",
        },
        {
          title: "Recipes",
          url: "Nutritions/Recipes",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const user = useSelector((state) => state.auth.user);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
         <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to={"/"}>
                <SquareTerminal className="size-5!" />
                <span className="text-base font-semibold">Fitness Tracker</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
