import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    // Helper function to determine if a nav item is active
    const isItemActive = (itemHref: string): boolean => {
        // For exact matches
        if (itemHref === page.url) return true;
        
        // For nested routes - check if current URL starts with itemHref and
        // either itemHref ends with a slash or the next character in page.url is a slash
        if (itemHref !== '/' && page.url.startsWith(itemHref)) {
            // Special handling for booking routes
            if (itemHref.includes('/booking/')) {
                // Exact match required for specific booking routes
                return itemHref === page.url;
            }
            return true;
        }
        return false;
    };
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton  
                            asChild isActive={isItemActive(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
