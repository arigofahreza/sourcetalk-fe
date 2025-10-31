# Filter API Integration

## Fitur Filter yang Terintegrasi dengan Strapi API

### 📋 Filter yang Tersedia:

1. **📅 Date Range Filter**
   - Start Date & End Date picker
   - Quick filters: Last 7 days, Last 30 days, This year, All time
   - Mengirim parameter `dateStart` dan `dateEnd` ke API

2. **📊 Quantity Range Filter**
   - Min/Max quantity input
   - Range slider dengan shadcn/ui
   - Quick filters: Low Stock (1-10), Medium (11-50), High Stock (51+), Out of Stock
   - Mengirim parameter `qtyMin` dan `qtyMax` ke API

3. **⚖️ Weight Range Filter**
   - Min/Max weight input (dengan decimal support)
   - Range slider dengan step 0.1
   - Quick filters: Ultra Light (<0.5kg), Light (0.5-2kg), Medium (2-5kg), Heavy (5kg+)
   - Mengirim parameter `weightMin` dan `weightMax` ke API

4. **🏷️ Codename Filter**
   - Checkbox list untuk multiple selection
   - Search functionality (placeholder)
   - Select All / Clear All buttons
   - Mengirim array `codenames` ke API dengan $or query

### ⏱️ Debounce Implementation:

- **2 detik delay** sebelum filter dikirim ke API
- Menggunakan custom hook `useDebounce`
- Visual indicator countdown saat filter sedang di-debounce
- Immediate update untuk Clear Filters (tanpa debounce)

### 🔧 API Integration:

- Filter dikirim sebagai query parameters ke Strapi API
- Server-side filtering menggantikan client-side filtering
- Pagination tetap berfungsi dengan filter aktif
- Loading states dan error handling

### 🎨 UI/UX Features:

- Accordion layout untuk organized filter sections
- Loading indicator saat applying filters
- Real-time countdown untuk debounce
- Responsive design
- Clear visual feedback

### 📡 API Parameters:

```typescript
interface FetchCatalogsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  codename?: string;
  sort?: string;
  dateStart?: string;
  dateEnd?: string;
  qtyMin?: number;
  qtyMax?: number;
  weightMin?: number;
  weightMax?: number;
  codenames?: string[];
}
```

### 🔄 Filter Flow:

1. User mengubah filter → State update
2. Debounce 2 detik → Visual countdown
3. API call dengan filter parameters
4. Server-side filtering di Strapi
5. Update products dan pagination
6. UI refresh dengan hasil baru