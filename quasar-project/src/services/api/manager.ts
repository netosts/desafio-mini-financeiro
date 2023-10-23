import { api } from 'boot/axios';
import { Record } from 'src/types/manager';

export async function getCategorias() {
  return api
    .get('/categorias')
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err;
    });
}
export async function getClientes() {
  return api
    .get('/clientes')
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err;
    });
}
export async function getValores() {
  return api
    .get('/valores')
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err;
    });
}

export async function postRecord(value: Record) {
  try {
    const response = await api.post('/valores/', value);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export async function putRecord(newRecord: Record) {
  try {
    const response = await api.put(`/valores/${newRecord.id}`, newRecord);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export async function delRecord(record_id: number) {
  try {
    const response = api.delete(`/valores/${record_id}`);
    return response;
  } catch (err) {
    console.error(err);
  }
}
