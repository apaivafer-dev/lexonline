export interface ImageAsset {
  id: string;
  filename: string;
  url: string;
  url1200: string;
  url800: string;
  urlThumb: string;
  width: number | null;
  height: number | null;
  sizeKB: number;
  createdAt: string;
}

export interface UploadResponse {
  id: string;
  url: string;
  url1200: string;
  url800: string;
  urlThumb: string;
  width: number;
  height: number;
  sizeKB: number;
  filename: string;
}

export interface ListResponse {
  images: ImageAsset[];
  total: number;
  page: number;
  limit: number;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ImageApi {
  // Upload with progress callback via XHR
  upload(
    pageId: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          resolve(JSON.parse(xhr.responseText) as UploadResponse);
        } else {
          try {
            reject(new Error(JSON.parse(xhr.responseText).error));
          } catch {
            reject(new Error('Erro ao fazer upload'));
          }
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Falha na conexão')));
      xhr.addEventListener('abort', () => reject(new Error('Upload cancelado')));

      const token = localStorage.getItem('token');
      xhr.open('POST', `${BASE_URL}/api/images/${pageId}`);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  }

  async list(pageId: string, scope: 'current' | 'all' = 'current', page = 1): Promise<ListResponse> {
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${BASE_URL}/api/images/${pageId}?scope=${scope}&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) throw new Error('Erro ao buscar imagens');
    return res.json() as Promise<ListResponse>;
  }

  async delete(pageId: string, assetId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/images/${pageId}/${assetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erro ao deletar imagem');
  }
}

export default new ImageApi();
