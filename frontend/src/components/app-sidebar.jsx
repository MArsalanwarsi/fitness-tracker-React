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
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux";
import { NavSecondary } from "./nav-secondary"
// This is sample data.
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
          title: "View Excersise",
          url: "Excersise/viewExcersise",
        },
        

      ],
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "settings/general",
        },
        {
          title: "Team",
          url: "settings/team",
        },
        {
          title: "Billing",
          url: "settings/billing",
        },
        {
          title: "Limits",
          url: "settings/limits",
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
        <TeamSwitcher teams={data.teams} />
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
