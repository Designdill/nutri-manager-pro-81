export interface MessagesTable {
  Row: {
    content: string;
    created_at: string;
    id: string;
    read: boolean;
    recipient_id: string;
    sender_id: string;
    updated_at: string;
  };
  Insert: {
    content: string;
    created_at?: string;
    id?: string;
    read?: boolean;
    recipient_id: string;
    sender_id: string;
    updated_at?: string;
  };
  Update: {
    content?: string;
    created_at?: string;
    id?: string;
    read?: boolean;
    recipient_id?: string;
    sender_id?: string;
    updated_at?: string;
  };
  Relationships: [];
}
