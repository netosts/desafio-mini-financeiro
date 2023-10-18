import { api } from 'boot/axios';
import { Record } from 'src/stores/manager';

export async function putRecord(newRecord: Record) {
  try {
    const response = await api.put(`/valores/${newRecord.id}`, newRecord);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}
