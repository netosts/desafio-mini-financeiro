import { api } from 'boot/axios';
import { Record } from 'src/stores/manager';

export async function postRecord(value: Record) {
  try {
    const response = await api.post('/valores/', value);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}
