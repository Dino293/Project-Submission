## Deployment

Aplikasi ini telah dideploy menggunakan Vercel dan dapat diakses di:

🔗 [https://project-submission1-ivory.vercel.app](https://project-submission1-ivory.vercel.app)

## Scripts yang Tersedia

- `npm run dev` – Menjalankan aplikasi dalam mode development.
- `npm run build` – Membangun aplikasi untuk production.
- `npm run lint` – Menjalankan ESLint untuk memeriksa kode.
- `npm run format` – Memformat kode dengan Prettier.
- `npm test` – Menjalankan unit dan integration tests dengan Vitest.
- `npm run e2e` – Menjalankan end-to-end tests dengan Cypress (headless).
- `npm run e2e:open` – Membuka Cypress Test Runner.

## Automation Testing

Aplikasi ini dilengkapi dengan pengujian otomatis:

- **Unit Test Reducer**: 2 file test (`authReducer.test.js`, `threadsReducer.test.js`)
- **Thunk Test**: 2 file test (`authThunks.test.js`, `threadsThunks.test.js`)
- **Component Test**: 2 file test (`CommentForm.test.jsx`, `LoginPage.test.jsx`)
- **E2E Test**: 1 file test (`login.cy.js`) untuk menguji alur login.

Pastikan untuk menjalankan `npm test` dan `npm run e2e` sebelum melakukan pull request.

## CI/CD

Proyek ini menggunakan GitHub Actions untuk Continuous Integration. Setiap pull request ke branch `main` akan menjalankan seluruh rangkaian tes secara otomatis. Branch `main` juga dilindungi dengan aturan:

- Minimal 1 review yang menyetujui.
- Semua status check (termasuk hasil tes) harus lulus sebelum dapat di-merge.