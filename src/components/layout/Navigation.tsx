import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, Home, Info, Mail, Users, Settings } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/tenant", label: "Tenant Portal", icon: Users },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

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