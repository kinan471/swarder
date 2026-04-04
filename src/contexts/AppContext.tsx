import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface Product {
  id?: string;
  name_ar: string;
  name_tr?: string;
  price: number;
  image_url: string;
  description_ar?: string;
  description_tr?: string;
  category: string;
  stock: number;
  created_at?: string;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
  replied?: boolean;
}

export interface SiteSettings {
  id?: string;
  siteName: string;
  tagline: string;
  whatsappNumber: string;
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  language: 'ar' | 'tr';
}

interface AppContextType {
  products: Product[];
  messages: Message[];
  settings: SiteSettings;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'created_at'>) => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: SiteSettings = {
  siteName: 'Spark Swarder - التنقل الكهربائي',
  tagline: 'منصتك الأولى للدراجات والسكوترات الكهربائية',
  whatsappNumber: '+905555555555',
  primaryColor: '#fbbf24',
  secondaryColor: '#10b981',
  darkMode: false,
  language: 'ar',
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load settings
      const { data: settingsData } = await supabase.from('settings').select('*').single();
      if (settingsData) {
        setSettings(settingsData);
      }

      // Load products
      const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (productsData) {
        setProducts(productsData);
      }

      // Load messages
      const { data: messagesData } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (messagesData) {
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Use localStorage as fallback
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const savedSettings = localStorage.getItem('siteSettings');
    const savedProducts = localStorage.getItem('products');
    const savedMessages = localStorage.getItem('messages');

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase.from('products').insert([product]).select();
      if (error) throw error;
      if (data) {
        setProducts(prev => [data[0], ...prev]);
        localStorage.setItem('products', JSON.stringify([...products, data[0]]));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      // Fallback to localStorage
      const newProduct = { ...product, id: Date.now().toString(), created_at: new Date().toISOString() };
      setProducts(prev => [newProduct as Product, ...prev]);
      localStorage.setItem('products', JSON.stringify([...products, newProduct]));
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const { error } = await supabase.from('products').update(product).eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
      const updated = products.map(p => p.id === id ? { ...p, ...product } : p);
      localStorage.setItem('products', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating product:', error);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
      const updated = products.map(p => p.id === id ? { ...p, ...product } : p);
      localStorage.setItem('products', JSON.stringify(updated));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      const filtered = products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting product:', error);
      setProducts(prev => prev.filter(p => p.id !== id));
      const filtered = products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(filtered));
    }
  };

  const addMessage = async (message: Omit<Message, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase.from('messages').insert([message]).select();
      if (error) throw error;
      if (data) {
        setMessages(prev => [data[0], ...prev]);
        localStorage.setItem('messages', JSON.stringify([...messages, data[0]]));
      }
    } catch (error) {
      console.error('Error adding message:', error);
      const newMessage = { ...message, id: Date.now().toString(), created_at: new Date().toISOString() };
      setMessages(prev => [newMessage as Message, ...prev]);
      localStorage.setItem('messages', JSON.stringify([...messages, newMessage]));
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const { error } = await supabase.from('settings').update(newSettings).eq('id', settings.id || 'default');
      if (error && !settings.id) {
        // Insert if doesn't exist
        await supabase.from('settings').insert([{ ...newSettings, id: 'default' }]);
      } else if (error) {
        throw error;
      }
      setSettings(prev => ({ ...prev, ...newSettings }));
      localStorage.setItem('siteSettings', JSON.stringify({ ...settings, ...newSettings }));
    } catch (error) {
      console.error('Error updating settings:', error);
      setSettings(prev => ({ ...prev, ...newSettings }));
      localStorage.setItem('siteSettings', JSON.stringify({ ...settings, ...newSettings }));
    }
  };

  return (
    <AppContext.Provider value={{
      products,
      messages,
      settings,
      addProduct,
      updateProduct,
      deleteProduct,
      addMessage,
      updateSettings,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
