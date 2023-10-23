import { defineStore } from 'pinia';
import { useCategories } from './categories';
import { useClients } from './clients';
import {
  createRows,
  filterByCategory,
  filterByName,
  sumTotal,
  sumTypes,
} from 'src/services/manager/helpers';
import { IndexRows, Record } from 'src/types/manager';
import {
  delRecord,
  getCategorias,
  getClientes,
  getValores,
  postRecord,
  putRecord,
} from 'src/services/api/manager';

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
    async addRecord(promptValues: Record) {
      const response = await postRecord(promptValues);
      this.records.push(response);
    },
    async updateRecord(promptValues: Record) {
      promptValues.tipo = promptValues.tipo === 'Entrada' ? 'entrada' : 'saida';
      const form = {
        id: promptValues.id,
        categoria_id: promptValues.categoria_id,
        cliente_id: promptValues.cliente_id,
        tipo: promptValues.tipo,
        valor: promptValues.valor,
      };
      const response = await putRecord(form);
      if (promptValues.id) {
        const index = this.records.findIndex(
          (item) => item.id === promptValues.id
        );
        this.records[index] = response;
      }
    },
    async deleteRecord(record_id: number) {
      const response = await delRecord(record_id);
      if (response) {
        const index = this.records.findIndex((item) => item.id === record_id);
        this.records.splice(index, 1);
      }
    },
    async filterRecords(filter: string | number) {
      this.defaultRecords = await getValores();
      const filteredRecords = await filterByCategory(
        filter,
        this.defaultRecords
      );
      this.records = filteredRecords;
    },
    async findRecords(filter: string) {
      this.defaultRecords = await getValores();
      const filteredRecords = await filterByName(filter, this.defaultRecords);
      this.records = filteredRecords;
    },
  },
});
