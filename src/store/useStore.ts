import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DashboardTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  notes?: string;
}

interface AppState {
  tasks: DashboardTask[];
  toggleTask: (id: string) => void;
  addTask: (title: string, category: string, notes?: string) => void;
  deleteTask: (id: string) => void;
  resetTasks: () => void;
  
  // Custom Alert Modal state
  alertModal: {
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'danger';
  } | null;
  showAlertModal: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  closeAlertModal: () => void;
}

const initialTasks: DashboardTask[] = [
  { id: '1', title: 'Implement TypeScript types for all components', category: 'React Advanced', completed: true },
  { id: '2', title: 'Build custom hooks for window size tracking', category: 'React Advanced', completed: false, notes: 'useWindowSize & useOfflineStatus' },
  { id: '3', title: 'Set up global Theme switching Context', category: 'State Management', completed: true },
  { id: '4', title: 'Integrate Zustand for local client store', category: 'State Management', completed: true },
  { id: '5', title: 'Perform API requests using TanStack Query', category: 'API Handling', completed: false, notes: 'Connecting to remote JSONPlaceholder API' },
  { id: '6', title: 'Establish Error Boundaries for component fallbacks', category: 'React Advanced', completed: false },
  { id: '7', title: 'Implement secure storage integrations (cookies, session, local)', category: 'UX & Security', completed: false },
  { id: '8', title: 'Run accessibility (a11y) audits and fix ARIA labels', category: 'UX & Accessibility', completed: false },
  { id: '9', title: 'Establish GitHub Actions workflow for automated validation', category: 'DevOps & CI/CD', completed: false, notes: 'Linting, testing, & type check validations' },
  { id: '10', title: 'Draft declarative Terraform configurations for scalable AWS/GCP/Azure resource structures', category: 'DevOps & IaC', completed: false, notes: 'Secure storage & network setups' },
  { id: '11', title: 'Create multi-stage Docker container configuration for Vite app staging', category: 'DevOps & Containers', completed: false, notes: 'Production multi-stage build optimization' },
  { id: '12', title: 'Structure basic Kubernetes deployment, service, and HorizontalPodAutoscaler manifests', category: 'DevOps & Orchestration', completed: false, notes: 'Scalable container orchestrations' },
  { id: '13', title: 'Implement cloud least privilege policies and secure Secrets Management simulations', category: 'DevOps & Security', completed: false, notes: 'IAM best practices & encrypted vaults' },
  { id: '14', title: 'Configure optional Prometheus metric exporters and Grafana dashboard hooks', category: 'DevOps & Monitoring', completed: false, notes: 'SRE observability & telemetry metrics' }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      addTask: (title, category, notes) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: Date.now().toString(),
              title,
              category,
              completed: false,
              notes,
            },
          ],
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      resetTasks: () => set({ tasks: initialTasks }),

      // Alert modal values
      alertModal: null,
      showAlertModal: (title, message, type = 'info') =>
        set({ alertModal: { title, message, type } }),
      closeAlertModal: () => set({ alertModal: null }),
    }),
    {
      name: 'presidio-dashboard-tasks',
      partialize: (state) => ({ tasks: state.tasks }), // Persist only tasks list
    }
  )
);
