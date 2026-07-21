# Global Custom Hooks Directory

Bu klasör, FinanceFocus projesinde tüm uygulamayı ilgilendiren, birden fazla özellik/sayfa (feature) tarafından ortaklaşa kullanılacak olan genel React custom hook'larını barındırmak amacıyla yapılandırılmıştır.

## Örnek Kullanım Amaçları:
- `useWindowSize.ts`: Tarayıcı ekran boyutlarını takip etmek için.
- `useOnClickOutside.ts`: Bir bileşenin dışına tıklanıp tıklanmadığını algılamak için.
- `useDebounce.ts`: Arama girdilerinde veya performans odaklı tetiklemelerde gecikme sağlamak için.
- `useLocalStorage.ts`: Tarayıcı LocalStorage işlemlerini hook seviyesinde sarmalamak için.

> [!NOTE]
> Belirli bir özelliğe (örn: `transactions`, `goals` vb.) özel olan hook'lar bu klasör yerine, kendi özellik dizinleri (örn: `src/features/transactions/hooks/`) altında konumlandırılmalıdır.
