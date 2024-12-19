export interface MessagesTable {
  Row: {
    id: string;
    sender_id: string;
    recipient_id: string;
    content: string;
    read: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: Omit<MessagesTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<MessagesTable['Insert']>;
}