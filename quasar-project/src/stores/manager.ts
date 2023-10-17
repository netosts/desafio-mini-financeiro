import { defineStore } from 'pinia';
import { getValores, getCategorias, getClientes } from 'src/services/api/get';
import { postRecord } from 'src/services/api/post';
import { useCategories } from './categories';
import { useClients } from './clients';
import {
  createRecordForm,
  createRows,
  filterByCategory,
  filterByName,
  sumTotal,
  sumTypes,
} from 'src/services/manager/helpers';
import { PromptValues } from 'src/pages/IndexPage.vue';

export interface Record {
  categoria_id: number | null;
  cliente_id: number | null;
  tipo: string | undefined;
  valor: number | undefined;
}

export interface IndexRows {
  categoria: string | null;
  cliente: string | null;
  tipo: string | null;
  valor: string | null;
}

const categoriesStore = useCategories();
const clientsStore = useClients();

export const useManager = defineStore({
  id: 'manager',
  state: () => ({
    records: [] as Record[],
    defaultRecords: [] as Record[],
  }),
  getters: {
    rows(): IndexRows[] {
      return createRows(this.records);
    },
    total(): string {
      return sumTotal(this.records);
    },
    entries(): string {
      return sumTypes(this.records, 'entrada');
    },
    expenses(): string {
      return sumTypes(this.records, 'saida');
    },
  },
  actions: {
    async init() {
      this.records = await getValores();
      categoriesStore.categories = await getCategorias();
      clientsStore.clients = await getClientes();
    },
    async addRecord(promptValues: PromptValues) {
      const form = createRecordForm(promptValues);
      const response = await postRecord(form);
      this.records.push(response);
    },
    async filterRecords(filter: string | number) {
      if (this.defaultRecords.length === 0) {
        this.defaultRecords = await getValores();
      }
      const filteredRecords = await filterByCategory(
        filter,
        this.defaultRecords
      );
      this.records = filteredRecords;
    },
    async findRecords(filter: string) {
      if (this.defaultRecords.length === 0) {
        this.defaultRecords = await getValores();
      }
      const filteredRecords = await filterByName(filter, this.defaultRecords);
      this.records = filteredRecords;
    },
  },
});
