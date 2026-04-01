# LEX_SITE09 — Fase 4: Upload de Imagens — Pipeline WebP

## Objetivo
Pipeline completo de otimização de imagens com conversão WebP, múltiplos tamanhos e galeria integrada.

## Dependência
- Fase 3e (Histórico + Auto-save + Preview)

## Estrutura de Arquivos

### Backend
- `backend/src/controllers/imagesController.ts` - Rota POST/GET para imagens
- `backend/src/services/imageOptimizer.ts` - Sharp converter para WebP
- `backend/src/middleware/uploadMiddleware.ts` - Validação e parser multipart

### Frontend
- `frontend/src/services/imageApi.ts` - Cliente HTTP para APIs de imagem
- `frontend/src/hooks/useImageUpload.ts` - Hook para upload com progresso
- `frontend/src/components/ImageUploader/ImageUploader.tsx` - Drop zone + preview
- `frontend/src/components/ImageGallery/ImageGallery.tsx` - Modal galeria
- `frontend/src/components/ImageGallery/ImageCard.tsx` - Card individual

## Implementação Detalhada

### Backend: imagesController.ts

```typescript
import express from 'express';
import multer from 'multer';
import imageOptimizer from '../services/imageOptimizer';
import db from '../database';

const router = express.Router();

// Configurar multer para upload
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Tipo de arquivo não permitido'));
    }

    cb(null, true);
  },
});

// POST /api/page/:id/images
router.post('/:pageId/images', upload.single('image'), async (req, res) => {
  try {
    const { pageId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida' });
    }

    // 1. Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Tipo de arquivo inválido' });
    }

    // 2. Otimizar com sharp: WebP quality 85 em 4 tamanhos
    const { original, size1200, size800, size400 } = await imageOptimizer.convert(file.buffer);

    // 3. Gerar nomes únicos
    const timestamp = Date.now();
    const userId = req.user.id; // Do middleware auth
    const baseFileName = `page/${userId}/${pageId}/${timestamp}`;

    // 4. Upload para Firebase Storage
    const bucket = admin.storage().bucket();

    const uploadPromises = [
      bucket.file(`${baseFileName}-original.webp`).save(original, { metadata: { contentType: 'image/webp' } }),
      bucket.file(`${baseFileName}-1200.webp`).save(size1200, { metadata: { contentType: 'image/webp' } }),
      bucket.file(`${baseFileName}-800.webp`).save(size800, { metadata: { contentType: 'image/webp' } }),
      bucket.file(`${baseFileName}-400.webp`).save(size400, { metadata: { contentType: 'image/webp' } }),
    ];

    await Promise.all(uploadPromises);

    // 5. Gerar URLs publicamente assinadas
    const urlOriginal = await bucket.file(`${baseFileName}-original.webp`).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 ano
    });

    const url1200 = await bucket.file(`${baseFileName}-1200.webp`).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
    });

    const url800 = await bucket.file(`${baseFileName}-800.webp`).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
    });

    const url400 = await bucket.file(`${baseFileName}-400.webp`).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
    });

    // 6. Salvar metadados em banco
    const asset = {
      id: `img_${timestamp}`,
      pageId,
      userId,
      fileName: file.originalname,
      mimeType: 'image/webp',
      sizeBytes: original.length,
      dimensions: {
        original: { width: 1920, height: 1440 }, // Será preenchido por sharp
        size1200: { width: 1200, height: 900 },
        size800: { width: 800, height: 600 },
        size400: { width: 400, height: 300 },
      },
      urls: {
        original: urlOriginal[0],
        size1200: url1200[0],
        size800: url800[0],
        size400: url400[0],
      },
      uploadedAt: new Date().toISOString(),
    };

    await db.collection('page_assets').doc(asset.id).set(asset);

    // 7. Retornar resposta
    return res.status(201).json({
      id: asset.id,
      url: urlOriginal[0],
      url1200: url1200[0],
      url800: url800[0],
      urlThumb: url400[0],
      width: 1920,
      height: 1440,
      sizeKB: Math.round(original.length / 1024),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
});

// GET /api/page/:id/images
router.get('/:pageId/images', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { page = 1, limit = 20, filterScope = 'current' } = req.query;

    // Paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = db.collection('page_assets').where('pageId', '==', pageId);

    if (filterScope === 'all') {
      query = db.collection('page_assets').where('userId', '==', req.user.id);
    }

    const snapshot = await query
      .orderBy('uploadedAt', 'desc')
      .offset(offset)
      .limit(parseInt(limit))
      .get();

    const images = snapshot.docs.map((doc) => doc.data());

    return res.json({
      images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: snapshot.size,
      },
    });
  } catch (error) {
    console.error('Fetch images error:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
});

// DELETE /api/page/:id/images/:imageId
router.delete('/:pageId/images/:imageId', async (req, res) => {
  try {
    const { pageId, imageId } = req.params;

    // Deletar de Firebase Storage
    const bucket = admin.storage().bucket();
    await bucket.deleteFiles({
      prefix: `page/${req.user.id}/${pageId}/${imageId.split('_')[1]}`,
    });

    // Deletar documento do banco
    await db.collection('page_assets').doc(imageId).delete();

    return res.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Erro ao deletar imagem' });
  }
});

export default router;
```

### Backend: imageOptimizer.ts

```typescript
import sharp from 'sharp';

class ImageOptimizer {
  async convert(buffer: Buffer) {
    // Original (sem redimensionar, apenas converter para WebP)
    const original = await sharp(buffer)
      .webp({ quality: 85 })
      .toBuffer();

    // 1200px (desktop)
    const size1200 = await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    // 800px (tablet)
    const size800 = await sharp(buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    // 400px (mobile/thumb)
    const size400 = await sharp(buffer)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    return { original, size1200, size800, size400 };
  }

  // Obter dimensões
  async getDimensions(buffer: Buffer) {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
    };
  }
}

export default new ImageOptimizer();
```

### Frontend: imageApi.ts

```typescript
class ImageApi {
  // Upload com callback de progresso
  async upload(
    pageId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Progresso
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          onProgress?.(progress);
        }
      });

      // Sucesso
      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(xhr.responseText));
        }
      });

      // Erro
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `/api/page/${pageId}/images`);
      xhr.send(formData);
    });
  }

  // Listar imagens
  async list(pageId: string, filterScope: 'current' | 'all' = 'current', page: number = 1) {
    const response = await fetch(
      `/api/page/${pageId}/images?filterScope=${filterScope}&page=${page}`
    );

    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  }

  // Deletar imagem
  async delete(pageId: string, imageId: string) {
    const response = await fetch(`/api/page/${pageId}/images/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete image');
    return response.json();
  }
}

export default new ImageApi();
```

### Frontend: useImageUpload.ts

```typescript
export const useImageUpload = (pageId: string) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (filesToUpload: File[]) => {
    // Máximo 5 arquivos simultâneos
    if (filesToUpload.length > 5) {
      setError('Máximo 5 imagens por vez');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = filesToUpload.map((file) =>
        imageApi.upload(pageId, file, (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));
        })
      );

      const results = await Promise.all(uploadPromises);
      setFiles((prev) => [...prev, ...filesToUpload]);

      // Dispatch para adicionar ao estado editor
      return results;
    } catch (err) {
      setError(err.message || 'Erro ao fazer upload');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  return {
    files,
    uploading,
    uploadProgress,
    error,
    handleUpload,
  };
};
```

### Frontend: ImageUploader.tsx

```typescript
const ImageUploader = ({ pageId, onUpload }: Props) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    uploading,
    uploadProgress,
    error,
    handleUpload,
  } = useImageUpload(pageId);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith('image/')
    );

    if (files.length > 0) {
      handleUpload(files as File[]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || []);
    if (files.length > 0) {
      handleUpload(files as File[]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <CloudUpload size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="font-semibold text-gray-700">
          Arraste imagens ou <button onClick={() => inputRef.current?.click()}>
            clique para selecionar
          </button>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Até 5 imagens, máx 10MB cada. Suporta JPEG, PNG, WebP, GIF, SVG
        </p>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle size={16} />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload progress */}
      {uploading && Object.entries(uploadProgress).map(([fileName, progress]) => (
        <div key={fileName} className="space-y-2">
          <p className="text-sm font-medium">{fileName}</p>
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
        </div>
      ))}
    </div>
  );
};
```

### Frontend: ImageGallery.tsx

```typescript
const ImageGallery = ({
  pageId,
  isOpen,
  onClose,
  onSelect,
}: Props) => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [filterScope, setFilterScope] = useState<'current' | 'all'>('current');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await imageApi.list(pageId, filterScope, page);
        setImages(response.images);
        setTotal(response.pagination.total);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [pageId, filterScope, page, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Galeria de Imagens</DialogTitle>
        </DialogHeader>

        {/* Filtro */}
        <div className="flex items-center gap-4 mb-4">
          <Label>Filtrar:</Label>
          <Button
            variant={filterScope === 'current' ? 'default' : 'outline'}
            onClick={() => { setFilterScope('current'); setPage(1); }}
          >
            Página Atual
          </Button>
          <Button
            variant={filterScope === 'all' ? 'default' : 'outline'}
            onClick={() => { setFilterScope('all'); setPage(1); }}
          >
            Todas as Páginas
          </Button>
        </div>

        {/* Grid de imagens */}
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma imagem encontrada
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onSelect={() => {
                  onSelect(image);
                  onClose();
                }}
                onDelete={() => {
                  // Recarregar lista após delete
                }}
              />
            ))}
          </div>
        )}

        {/* Paginação */}
        {total > 20 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Anterior
            </Button>
            <span className="px-4 py-2">{page}</span>
            <Button
              disabled={page * 20 >= total}
              onClick={() => setPage(p => p + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
```

### Frontend: ImageCard.tsx

```typescript
const ImageCard = ({ image, onSelect, onDelete }: Props) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer
                  hover:shadow-lg transition-shadow"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Thumbnail */}
      <img
        src={image.urls.size400}
        alt={image.fileName}
        className="w-full aspect-square object-cover"
      />

      {/* Overlay ao hover */}
      {hovering && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
          <Button
            onClick={() => onSelect(image)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check size={16} className="mr-1" /> Selecionar
          </Button>

          <Button
            onClick={() => onDelete(image.id)}
            size="sm"
            variant="destructive"
          >
            <Trash size={16} />
          </Button>
        </div>
      )}

      {/* Nome do arquivo */}
      <div className="p-2 bg-white text-xs truncate">
        {image.fileName}
      </div>
    </div>
  );
};
```

### Integração no ImageElement

```typescript
const ImageElement = ({ element }: Props) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const dispatch = useDispatch();

  const handleImageSelect = (image: ImageAsset) => {
    dispatch(UPDATE_ELEMENT, {
      id: element.id,
      props: {
        src: image.urls.original,
        srcset: `
          ${image.urls.size1200} 1200w,
          ${image.urls.size800} 800w,
          ${image.urls.size400} 400w
        `,
        sizes: `
          (min-width: 1200px) 1200px,
          (min-width: 800px) 800px,
          100vw
        `,
        alt: image.fileName,
      },
    });
  };

  return (
    <div>
      <img
        src={element.props.src}
        srcSet={element.props.srcset}
        sizes={element.props.sizes}
        alt={element.props.alt}
        style={{
          width: '100%',
          height: 'auto',
        }}
      />

      <Button onClick={() => setGalleryOpen(true)}>
        Escolher da Galeria
      </Button>

      <ImageGallery
        pageId={element.pageId}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
};
```

## HTML Gerado

```html
<img
  src="https://storage.googleapis.com/.../page-1200.webp"
  srcset="
    https://storage.googleapis.com/.../page-1200.webp 1200w,
    https://storage.googleapis.com/.../page-800.webp 800w,
    https://storage.googleapis.com/.../page-400.webp 400w
  "
  sizes="(min-width: 1200px) 1200px, (min-width: 800px) 800px, 100vw"
  alt="Minha imagem"
  loading="lazy"
/>
```

## Critérios de Aceite

- [ ] Upload via drop zone com múltiplos arquivos (máx 5)
- [ ] Barra de progresso por arquivo
- [ ] Validação de tipo (JPEG, PNG, WebP, GIF, SVG)
- [ ] Conversão para WebP quality 85
- [ ] 4 tamanhos gerados (original, 1200px, 800px, 400px)
- [ ] Upload Firebase Storage
- [ ] Galeria com thumbnails grid 4 colunas
- [ ] Filtro: Página Atual | Todas
- [ ] Hover: [Selecionar] [Excluir]
- [ ] Paginação funciona corretamente
- [ ] srcset responsivo no HTML
- [ ] sizes atributo para mobile/tablet/desktop
- [ ] Loading lazy implementado
- [ ] Nomes únicos: page/{userId}/{pageId}/{timestamp}-{tamanho}.webp

## Stack Técnico

- Backend: Express + multer + sharp + Firebase Admin SDK
- Frontend: React + Hooks + Fetch/XHR
- Storage: Firebase Storage (bucket público assinado)
- DB: Firestore (page_assets collection)
