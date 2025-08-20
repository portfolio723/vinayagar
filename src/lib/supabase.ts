import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface FestivalSettings {
  id: string;
  festival_year: number;
  festival_name: string;
  location: string;
  start_date: string;
  end_date: string;
  fundraising_goal: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  donor_phone?: string;
  donor_email?: string;
  amount: number;
  category: 'Individual' | 'Family' | 'Business' | 'Anonymous';
  is_anonymous: boolean;
  payment_method: 'Cash' | 'Online' | 'Check' | 'Other';
  notes?: string;
  donation_date: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: 'Decorations' | 'Food/Prasadam' | 'Cultural Programs' | 'Utilities' | 'Supplies' | 'Other';
  vendor_name?: string;
  receipt_number?: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

// Database operations
export const festivalService = {
  // Festival Settings
  async getFestivalSettings() {
    const { data, error } = await supabase
      .from('festival_settings')
      .select('*')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateFestivalSettings(settings: Partial<FestivalSettings>) {
    const { data, error } = await supabase
      .from('festival_settings')
      .upsert(settings)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Donations
  async getDonations() {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('donation_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addDonation(donation: Omit<Donation, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('donations')
      .insert(donation)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateDonation(id: string, donation: Partial<Donation>) {
    const { data, error } = await supabase
      .from('donations')
      .update(donation)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteDonation(id: string) {
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Expenses
  async getExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateExpense(id: string, expense: Partial<Expense>) {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteExpense(id: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Analytics
  async getFinancialSummary() {
    const [donations, expenses] = await Promise.all([
      this.getDonations(),
      this.getExpenses()
    ]);

    const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
    const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const remainingBalance = totalDonations - totalExpenses;

    return {
      totalDonations,
      totalExpenses,
      remainingBalance,
      donationCount: donations?.length || 0,
      expenseCount: expenses?.length || 0
    };
  }
};

// Auth helpers
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
};