# 🍅 Pomodoro Timer App

Ứng dụng Pomodoro Timer được xây dựng với React, TypeScript, Vite và Capacitor - hỗ trợ thông báo địa phương, rung và dialog.

## ✨ Tính năng

### Yêu cầu tối thiểu đã hoàn thành:
- ✅ **Chu kỳ 25/5 phút**: Thiết lập thời gian làm việc 25 phút, nghỉ ngắn 5 phút
- ✅ **Đếm ngược liên tục**: Timer chạy cả khi app ở chế độ nền  
- ✅ **Thông báo + Rung**: Gửi local notification và haptic feedback khi hết phiên
- ✅ **Dialog thông báo**: Hiển thị dialog xác nhận khi phiên kết thúc

### Tính năng mở rộng:
- ✅ **Lịch sử phiên**: Lưu và hiển thị lịch sử các phiên đã hoàn thành
- ✅ **Tùy chọn âm báo**: Cho phép chọn âm thanh thông báo khác nhau
- ✅ **Cài đặt linh hoạt**: Tùy chỉnh thời gian làm việc, nghỉ ngắn, nghỉ dài
- ✅ **Giao diện đẹp**: UI hiện đại với dark mode support
- ✅ **Thống kê**: Hiển thị số phiên hoàn thành và tổng thời gian trong ngày

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
