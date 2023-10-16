import { defineStore } from 'pinia';
import { getValores, getCategorias, getClientes } from 'src/services/api/get';
import { postRecord } from 'src/services/api/post';

export interface Record {
  label: string;
  cliente: string;
  value: number;
}

interface Categories {
  id: number;
  label: string;
}

interface Clients {
  id: number;
  cliente: string;
}

const loadCategories = async () => {
  const gettedCategories = await getCategorias();
  const categoriesLabels = gettedCategories.map(
    (item: Categories) => item.label
  );
  return categoriesLabels ? categoriesLabels : [];
};
const loadClients = async () => {
  const gettedClients = await getClientes();
  const clientsLabels = gettedClients.map((item: Clients) => item.cliente);
  return clientsLabels ? clientsLabels : [];
};

export const useManager = defineStore({
  id: 'manager',
  state: () => ({
    records: [] as Record[],
    categories: [] as string[],
    clients: [] as string[],
  }),
  getters: {
    total(): number {
      return this.records.reduce((sumTotal, record) => {
        return sumTotal + record.value;
      }, 0);
    },
  },
  actions: {
    async init() {
      this.records = await getValores();
      this.categories = await loadCategories();
      this.clients = await loadClients();
    },
    async addRecord(inputValue: Record) {
      const response = await postRecord(inputValue);
      return response as Record;
    },
    async filterRecords(filter: string) {
      const defaultRecords = await getValores();
      if (filter === 'All') {
        this.records = defaultRecords;
        return;
      }
      const filteredRecords = defaultRecords.filter(
        (record: Record) => record.label === filter
      );
      this.records = filteredRecords;
    },
    async findRecords(filter: string) {
      const defaultRecords = await getValores();
      if (filter === '') {
        this.records = defaultRecords;
        return;
      }
      const recordsFound = defaultRecords.filter((item: Record) =>
        item.cliente.toLowerCase().includes(filter.toLowerCase())
      );
      this.records = recordsFound;
    },
  },
});
