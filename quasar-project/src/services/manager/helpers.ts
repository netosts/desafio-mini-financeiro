import { useCategories } from 'src/stores/categories';
import { useClients } from 'src/stores/clients';
import { Record, IndexRows } from 'src/stores/manager';

const categoriesStore = useCategories();
const clientsStore = useClients();

export function createRows(records: Record[]): IndexRows[] {
  const transformedRows = records.map((record) => {
    const translatedCategory = categoriesStore.categories.find(
      (item) => item.id === record.categoria_id
    );
    const translatedClient = clientsStore.clients.find(
      (item) => item.id === record.cliente_id
    );

    if (record.valor) {
      if (record.valor < 0) {
        record.valor = record.valor * -1;
      }
    }
    return {
      id: record.id,
      categoria_id: record.categoria_id,
      cliente_id: record.cliente_id,
      categoria: translatedCategory ? translatedCategory.label : null,
      cliente: translatedClient ? translatedClient.cliente : null,
      tipo: record.tipo === 'entrada' ? 'Entrada' : 'Saída',
      valor: record.valor ? record.valor : null,
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
        if (record.tipo === 'saida') {
          return sumTotal - record.valor;
        } else {
          return sumTotal + record.valor;
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
