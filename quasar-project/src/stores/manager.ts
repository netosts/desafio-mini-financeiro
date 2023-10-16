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
    defaultRecords: [] as Record[],
    categoryFilter: 'All' as string,
    clientFilter: '' as string,
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
      this.records.push(response);
    },
    async filterRecords(filter: string) {
      this.categoryFilter = filter;
      if (this.defaultRecords.length === 0) {
        this.defaultRecords = await getValores();
      }

      const filteredRecords = this.defaultRecords.filter((record: Record) => {
        if (
          record.label === filter &&
          (this.clientFilter === '' ||
            record.cliente
              .toLowerCase()
              .includes(this.clientFilter.toLowerCase()))
        ) {
          return record;
        } else if (
          filter === 'All' &&
          (this.clientFilter === '' ||
            record.cliente
              .toLowerCase()
              .includes(this.clientFilter.toLowerCase()))
        ) {
          return record;
        }
      });
      this.records = filteredRecords;
    },
    async findRecords(filter: string) {
      this.clientFilter = filter;
      if (this.defaultRecords.length === 0) {
        this.defaultRecords = await getValores();
      }

      const recordsFound = this.defaultRecords.filter((record: Record) => {
        if (
          record.cliente.toLowerCase().includes(filter.toLowerCase()) &&
          (this.categoryFilter === 'All' ||
            record.label === this.categoryFilter)
        ) {
          return record;
        }
      });
      this.records = recordsFound;
    },
  },
});
