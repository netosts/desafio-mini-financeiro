import { defineStore } from 'pinia';

interface Categories {
  id: number;
  label: string;
}

interface CategoriesOptions {
  label: string;
  value: number;
}

export const useCategories = defineStore({
  id: 'categories',
  state: () => ({
    categories: [] as Categories[],
    categoryFilter: 'All' as string | number,
  }),
  getters: {
    options(): CategoriesOptions[] {
      return this.categories.map((item) => {
        return { label: item.label, value: item.id };
      });
    },
  },
  actions: {},
});
