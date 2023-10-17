import { useCategories } from 'src/stores/categories';
import { useClients } from 'src/stores/clients';
import { Record, IndexRows } from 'src/stores/manager';
import { PromptValues } from 'src/pages/IndexPage.vue';

const categoriesStore = useCategories();
const clientsStore = useClients();

export function createRecordForm(promptValues: PromptValues): Record {
  const categoria = categoriesStore.categories.find(
    (item) => item.label === promptValues.categoria
  );
  const cliente = clientsStore.clients.find(
    (item) => item.cliente === promptValues.cliente
  );
  return {
    categoria_id: categoria ? categoria.id : null,
    cliente_id: cliente ? cliente.id : null,
    tipo: promptValues.tipo,
    valor: promptValues.valor,
  };
}

export function createRows(records: Record[]): IndexRows[] {
  const transformedRows = records.map((record) => {
    const translatedCategory = categoriesStore.categories.find(
      (item) => item.id === record.categoria_id
    );
    const translatedClient = clientsStore.clients.find(
      (item) => item.id === record.cliente_id
    );
    return {
      categoria: translatedCategory ? translatedCategory.label : null,
      cliente: translatedClient ? translatedClient.cliente : null,
      tipo: record.tipo ? record.tipo : null,
      valor: record.valor ? `R$${record.valor.toFixed(2)}` : null,
    };
  });
  return transformedRows;
}

export async function filterByCategory(
  filter: string | number,
  defaultRecords: Record[]
) {
  categoriesStore.categoryFilter = filter;

  const filteredClients = clientsStore.clients.filter((item) =>
    item.cliente.toLowerCase().includes(clientsStore.clientFilter.toLowerCase())
  );

  const filteredRecords = defaultRecords.filter((record: Record) => {
    const foundClient = filteredClients.find(
      (client) => client.id === record.cliente_id
    );
    if (filter === 'All' && (clientsStore.clientFilter === '' || foundClient)) {
      return record;
    } else if (
      record.categoria_id === filter &&
      (clientsStore.clientFilter === '' || foundClient)
    ) {
      return record;
    }
  });
  return filteredRecords;
}

export async function filterByName(filter: string, defaultRecords: Record[]) {
  clientsStore.clientFilter = filter;

  const filteredClients = clientsStore.clients.filter((item) =>
    item.cliente.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredRecords = defaultRecords.filter((record: Record) => {
    if (filteredClients) {
      const foundClient = filteredClients.find(
        (client) => client.id === record.cliente_id
      );
      if (
        foundClient &&
        (categoriesStore.categoryFilter === 'All' ||
          record.categoria_id === categoriesStore.categoryFilter)
      ) {
        return record;
      }
    }
  });
  return filteredRecords;
}

export function sumTotal(records: Record[]): string {
  return records
    .reduce((sumTotal, record) => {
      if (record.valor) {
        if (record.tipo === 'Entrada') {
          return sumTotal + record.valor;
        } else if (record.tipo === 'Saída') {
          return sumTotal - record.valor;
        }
      }
      return sumTotal;
    }, 0)
    .toFixed(2);
}
export function sumTypes(records: Record[], type: string): string {
  return records
    .reduce((sumTotal, record) => {
      if (record.valor) {
        if (record.tipo === type) {
          return sumTotal + record.valor;
        }
      }
      return sumTotal;
    }, 0)
    .toFixed(2);
}
