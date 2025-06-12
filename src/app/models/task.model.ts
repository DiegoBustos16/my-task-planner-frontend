import { Item } from './item.model';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  items: Item[];
}