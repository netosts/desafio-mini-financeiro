import { defineStore } from 'pinia';

interface Clients {
  id: number;
  cliente: string;
}

interface CategoriesOptions {
  label: string;
  value: number;
}

export const useClients = defineStore({
  id: 'clients',
  state: () => ({
    clients: [] as Clients[],
    clientFilter: '' as string,
  }),
  getters: {
    options(): CategoriesOptions[] {
      return this.clients.map((item) => {
        return { label: item.cliente, value: item.id };
      });
    },
  },
  actions: {},
});
