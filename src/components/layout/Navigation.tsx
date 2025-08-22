import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Building, Home, Info, Mail, Users, Settings, LogOut, User, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { href: "/", label: "Home", icon: Home },
      { href: "/about", label: "About", icon: Info },
      { href: "/contact", label: "Contact", icon: Mail },
    ];

    if (user?.role === 'tenant') {
      return [...baseItems, { href: "/tenant", label: "Tenant Portal", icon: Users }];
    }

    if (user?.role === 'admin' || user?.role === 'superadmin') {
      return [...baseItems, { href: "/admin", label: "Admin Dashboard", icon: Settings }];
    }

    if (!user) {
      return [...baseItems, { href: "/login", label: "Login", icon: User }];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Landmark Building</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  asChild
                  className="flex items-center space-x-2"
                >
                  <Link to={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.username || user.tenant_login_id}</span>
                    <Badge variant="secondary" className="ml-2">
                      {user.role}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.role === 'superadmin' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin/management')}>
                        <Shield className="h-4 w-4 mr-2" />
                        User Management
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="md:hidden">
            <select 
              className="bg-background border border-border rounded-md px-3 py-2"
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
            >
              {navigationItems.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;