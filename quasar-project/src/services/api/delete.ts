import { api } from 'boot/axios';

export async function delRecord(record_id: number) {
  try {
    const response = api.delete(`/valores/${record_id}`);
    return response;
  } catch (err) {
    console.error(err);
  }
}
