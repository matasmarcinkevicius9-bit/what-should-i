export type Item = {
  id: string;
  title: string;
  category?: string;
  notes?: string;
  favorite: boolean;
  done: boolean;
  createdAt: number;
};

export type NewItemInput = {
  title: string;
  category?: string;
  notes?: string;
};
