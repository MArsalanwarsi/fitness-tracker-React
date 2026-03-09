"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Dumbbell,
  PlusCircle,
  FolderPlus,
  List,
  FolderOpen,
  Utensils,
  ChefHat,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import logo from "../assets/logo/Logo_Mark.png"

const data = {
  navMain: [
    {
      platform: "Main",
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      platform: "Main",
      title: "Exercise",
      url: "Exercise",
      icon: Dumbbell,
      isActive: false,
      items: [
        {
          title: "Add Exercise",
          url: "Excersise/addExcersise",
          icon: PlusCircle,
        },
        {
          title: "Add Category",
          url: "Excersise/addCategory",
          icon: FolderPlus,
        },
        {
          title: "View Exercises",
          url: "Excersise/viewExcersise",
          icon: List,
        },
        {
          title: "View Categories",
          url: "Excersise/viewCategories",
          icon: FolderOpen,
        },
      ],
    },
    {
      platform: "Main",
      title: "Nutrition",
      url: "Nutrition",
      icon: Utensils,
      isActive: false,
      items: [
        {
          title: "Nutrition",
          url: "Nutritions/Nutritions",
          icon: Utensils,
        },
        {
          title: "Recipes",
          url: "Nutritions/Recipes",
          icon: ChefHat,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  const user = useSelector((state) => state.auth.user)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="data-[slot=sidebar-menu-button]:p-1.3!">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
                  <img src={logo} alt="Fitness Tracker Logo" className="h-10 w-10 object-contain invert" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black tracking-tight">Fitness Tracker</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Health Analytics</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user?.user ?? user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}