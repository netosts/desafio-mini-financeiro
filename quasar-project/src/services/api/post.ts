import { api } from 'boot/axios';
import { Record } from 'src/stores/manager';

export async function postRecord(value: Record) {
  try {
    const response = await api.post('/valores/', value);
    console.log(`${value} was successfully added`);
    return response.data;
  } catch (err: any) {
    if (err.response) {
      console.error('Response Data:', err.response.data);
      console.error('Response Status:', err.response.status);
    } else {
      console.error('Request failed:', err.message);
    }
    throw err;
  }
}
