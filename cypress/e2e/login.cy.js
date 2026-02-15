describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display validation errors when fields are empty', () => {
    // Submit form langsung (lebih andal daripada klik tombol)
    cy.get('form').submit();

    // Tunggu hingga pesan error muncul (gunakan teks langsung)
    cy.contains('Email wajib diisi', { timeout: 5000 }).should('be.visible');
    cy.contains('Password wajib diisi', { timeout: 5000 }).should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    // Mock API login
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        data: {
          token: 'fake-token',
          user: { id: '1', name: 'Test User' },
        },
      },
    }).as('loginRequest');

    // Mock API get own profile
    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: {
        data: {
          user: { id: '1', name: 'Test User', avatar: null },
        },
      },
    }).as('getProfile');

    // Mock API threads
    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: { data: { threads: [] } },
    }).as('getThreads');

    // Isi form
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Tunggu semua request yang dimock
    cy.wait('@loginRequest');
    cy.wait('@getProfile');
    cy.wait('@getThreads');

    // Verifikasi redirect ke halaman utama
    cy.url().should('eq', `${Cypress.config().baseUrl  }/`);

    // Verifikasi nama user muncul di navbar
    cy.contains('Test User').should('be.visible');
  });
});