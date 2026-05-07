export type TaskIcon = {
  emoji: string;
  color: string;
};

export interface Task {
  id: string;
  title: string;
  description: string;
  icon: TaskIcon;
}
