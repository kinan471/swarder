import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface Product {
  id?: string;
  name_ar: string;
  name_tr: string;
  price: number;
  image_url: string;
  description_ar: string;
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
  read?: boolean;
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
  addMessage: (message: Omit<Message, 'id' | 'created_at' | 'read'>) => Promise<void>;
  markMessageAsRead: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: SiteSettings = {
  siteName: 'Spark Swarder - التنقل الكهربائي',
  tagline: 'مستقبل التنقل الذكي',
  whatsappNumber: '905555555555',
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  darkMode: false,
  language: 'ar',
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // تحميل البيانات من Supabase عند البدء
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // جلب المنتجات
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!productsError && productsData) {
        setProducts(productsData);
      }

      // جلب الرسائل
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!messagesError && messagesData) {
        setMessages(messagesData);
      }

      // جلب الإعدادات
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (!settingsError && settingsData) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setProducts(prev => [data, ...prev]);
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setProducts(prev => prev.map(p => p.id === id ? data : p));
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addMessage = async (message: Omit<Message, 'id' | 'created_at' | 'read'>) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setMessages(prev => [data, ...prev]);
    }
  };

  const markMessageAsRead = async (id: string) => {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setMessages(prev => prev.map(m => m.id === id ? data : m));
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...newSettings })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setSettings(data);
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
      markMessageAsRead,
      updateSettings,
      loading,
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
