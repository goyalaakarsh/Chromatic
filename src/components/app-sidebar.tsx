import { Home, Inbox, Calendar, Search, Palette, Scissors, CreditCard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Restore Image",
    url: "/transformations/add/restore-image",
    icon: Inbox,
  },
  {
    title: "Generative Fill",
    url: "/transformations/add/generative-fill",
    icon: Calendar,
  },
  {
    title: "Object Remover",
    url: "/transformations/add/object-remover",
    icon: Search,
  },
  {
    title: "Recolor Object",
    url: "/transformations/add/recolor-object",
    icon: Palette,
  },
  {
    title: "Remove Background",
    url: "/transformations/add/remove-background",
    icon: Scissors,
  },
  {
    title: "Buy Credits",
    url: "#",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="ml-2 mt-2">
            <strong>Chromatic</strong>
        </SidebarHeader>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Menu</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-800 focus:bg-violet-600 active:bg-violet-800"
                  >
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter
          className="p-2 fixed bottom-0 left-0"
        >
          <UserButton />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}

