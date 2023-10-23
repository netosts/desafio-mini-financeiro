export interface Record {
  id?: number;
  categoria_id: number | undefined | null;
  cliente_id: number | undefined | null;
  tipo: string | undefined;
  valor: number | undefined;
}

export interface IndexRows {
  categoria: string | null;
  cliente: string | null;
  tipo: string | null;
  valor: number | undefined | null;
}
