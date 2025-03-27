
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          created_at: string
          date: string
          time_slot: string
          name: string
          email: string
          phone: string
          notes: string | null
          status: 'pending' | 'confirmed' | 'cancelled'
          google_calendar_event_id: string | null
          reminder_sent: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          date: string
          time_slot: string
          name: string
          email: string
          phone: string
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          google_calendar_event_id?: string | null
          reminder_sent?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          date?: string
          time_slot?: string
          name?: string
          email?: string
          phone?: string
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          google_calendar_event_id?: string | null
          reminder_sent?: boolean
        }
      }
      availability: {
        Row: {
          id: string
          date: string
          time_slots: string[]
          is_available: boolean
        }
        Insert: {
          id?: string
          date: string
          time_slots?: string[]
          is_available?: boolean
        }
        Update: {
          id?: string
          date?: string
          time_slots?: string[]
          is_available?: boolean
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          value?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
