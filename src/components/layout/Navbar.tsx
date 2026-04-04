import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { settings, updateSettings } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = async () => {
    await updateSettings({ darkMode: !settings.darkMode });
  };

  const toggleLanguage = async () => {
    await updateSettings({ language: settings.language === 'ar' ? 'tr' : 'ar' });
  };

  const navLinks = [
    { path: '/', label: { ar: 'الرئيسية', tr: 'Ana Sayfa' } },
    { path: '/products', label: { ar: 'المنتجات', tr: 'Ürünler' } },
    { path: '/services', label: { ar: 'الخدمات', tr: 'Hizmetler' } },
    { path: '/about', label: { ar: 'من نحن', tr: 'Hakkımızda' } },
    { path: '/contact', label: { ar: 'التواصل', tr: 'İletişim' } },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg md:text-xl">{settings.siteName.split('-')[0]}</h1>
              <p className="text-xs text-muted-foreground hidden md:block">{settings.tagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {settings.language === 'ar' ? link.label.ar : link.label.tr}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full"
            >
              <Globe className="w-5 h-5" />
              <span className="sr-only">{settings.language === 'ar' ? 'Türkçe' : 'العربية'}</span>
            </Button>

            <Link to="/admin">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                {settings.language === 'ar' ? 'لوحة التحكم' : 'Admin'}
              </Button>
            </Link>

            <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden lg:inline">{settings.language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
              </Button>
            </a>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {settings.language === 'ar' ? link.label.ar : link.label.tr}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 rounded-md font-medium hover:bg-muted"
              >
                {settings.language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
