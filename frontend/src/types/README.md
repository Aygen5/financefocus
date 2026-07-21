# Global TypeScript Types Directory

Bu klasör, FinanceFocus projesinde tüm uygulamayı ilgilendiren, birden fazla özellik/sayfa (feature) tarafından ortaklaşa kullanılacak olan genel global TypeScript tip tanımlamalarını barındırmak amacıyla yapılandırılmıştır.

## Örnek Kullanım Amaçları:
- `api.types.ts`: Ortak API hata yanıt yapıları (`ApiError`) veya paginated liste veri yapıları (`PaginatedResponse<T>`).
- `common.types.ts`: Birden fazla bileşende paylaşılan genel etiketler, renk variant'ları veya ortak arayüz tipleri.

> [!NOTE]
> Belirli bir özelliğe (örn: `auth`, `transactions` vb.) özel olan tipler bu klasör yerine, kendi özellik dizinleri (örn: `src/features/auth/auth.types.ts`) altında konumlandırılmalıdır.
