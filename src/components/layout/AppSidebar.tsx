
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { MessageSquare, Users, Database, Search, User } from "lucide-react";

const AppSidebar: React.FC = () => {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-sms-primary" />
          <h1 className="text-2xl font-bold text-sms-primary">SMS Hub</h1>
        </div>
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    className={({isActive}) => 
                      isActive ? "bg-sms-muted text-sms-primary font-medium" : ""
                    }
                  >
                    <Database className="h-5 w-5" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/messages" 
                    className={({isActive}) => 
                      isActive ? "bg-sms-muted text-sms-primary font-medium" : ""
                    }
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/contacts" 
                    className={({isActive}) => 
                      isActive ? "bg-sms-muted text-sms-primary font-medium" : ""
                    }
                  >
                    <Users className="h-5 w-5" />
                    <span>Contacts</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/search" 
                    className={({isActive}) => 
                      isActive ? "bg-sms-muted text-sms-primary font-medium" : ""
                    }
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="bg-muted rounded-full p-1">
            <User className="h-5 w-5 text-sms-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@smshub.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
