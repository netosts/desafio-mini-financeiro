import { defineStore } from 'pinia';
import { getValores, getCategorias, getClientes } from 'src/services/api/get';
import { postRecord } from 'src/services/api/post';

interface Record {
  label: string;
  cliente: string;
  value: number;
}

export const useManager = defineStore({
  id: 'manager',
  state: () => ({
    records: [] as Record[],
  }),
  getters: {
    total(): number {
      return this.records.reduce((sumTotal, record) => {
        console.log(record);
        return sumTotal + record.value;
      }, 0);
    },
  },
  actions: {
    async init() {
      this.records = await getValores();
    },
    async addRecord(inputValue: Record) {
      const response = await postRecord(inputValue);
      return response as Record;
    },
  },
});
