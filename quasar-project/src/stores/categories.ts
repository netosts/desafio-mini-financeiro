import { defineStore } from 'pinia';

interface Categories {
  id: number;
  label: string;
}

export const useCategories = defineStore({
  id: 'categories',
  state: () => ({
    categories: [] as Categories[],
    categoryFilter: 'All' as string | number,
  }),
  getters: {
    options(): string[] {
      return this.categories.map((item) => item.label);
    },
  },
  actions: {},
});
