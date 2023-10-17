import { defineStore } from 'pinia';

interface Clients {
  id: number;
  cliente: string;
}

export const useClients = defineStore({
  id: 'clients',
  state: () => ({
    clients: [] as Clients[],
    clientFilter: '' as string,
  }),
  getters: {
    options(): string[] {
      return this.clients.map((item) => item.cliente);
    },
  },
  actions: {},
});
