import { api } from 'boot/axios';

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
