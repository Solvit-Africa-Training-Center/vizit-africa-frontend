export const endpoints = {
  auth: {
    login: "/accounts/login/",
    register: "/accounts/users/",
    verifyEmail: "/accounts/users/verify_email/",
    list: "/accounts/users/",
    user: (id: string | number) => `/accounts/users/${id}/`,
    me: "/accounts/users/profile/",
    setPassword: (uidb64: string, token: string) =>
      `/accounts/users/set_password/${uidb64}/${token}/`,
    refresh: "/accounts/token/refresh/",
    googleLogin: "/accounts/login/google/",
  },
  accounts: {
    savedItems: {
      list: "/accounts/saved-items/",
      create: "/accounts/saved-items/",
      remove: "/accounts/saved-items/remove/",
    },
    contact: "/accounts/contact/",
  },
  bookings: {
    list: "/bookings/",
    admin: {
      list: "/bookings/admin/bookings/",
      detail: (id: string | number) => `/bookings/admin/bookings/${id}/`,
    },
    detail: (id: string | number) => `/bookings/${id}/`,
    items: {
      create: "/bookings/items/create/",
    },
    confirm: "/bookings/confirm/",
    submitTrip: "/bookings/submit-trip/",

    quote: (id: string | number) => `/bookings/${id}/quote/`,
    accept: (id: string | number) => `/bookings/${id}/accept/`,
    cancel: (id: string | number) => `/bookings/${id}/cancel/`,
    notifyVendor: (id: string | number) => `/bookings/${id}/notify-vendor/`,

    tickets: {
      generate: (id: string | number) => `/bookings/${id}/generate-ticket/`,
      download: (id: string | number) => `/bookings/${id}/download-ticket/`,
      verify: "/bookings/verify-ticket/",
    },
    commission: (id: string | number) => `/bookings/${id}/commission/`,
    payout: (id: string | number) => `/bookings/${id}/payout/`,
    transactions: "/bookings/transactions/",
    vendorPayouts: "/bookings/vendor-payouts/",
  },
  services: {
    create: "/services/",
    media: "/services/media/",
    availability: "/services/availability/",
    checkAvailability: "/services/check-availability/",
    discounts: "/services/discounts/",
    list: "/services/",
    details: (id: string | number) => `/services/${id}/`,
  },
  locations: {
    create: "/locations/",
    list: "/locations/",
  },
  vendors: {
    register: "/vendors/register/",
    create: "/vendors/",
    approve: (id: string | number) => `/vendors/${id}/approve/`,
    list: "/vendors/",
    detail: (id: string | number) => `/vendors/${id}/`,
    dashboard: "/vendors/dashboard/",
    requests: "/vendors/requests/",
    confirmItem: (id: string | number) => `/vendors/requests/${id}/confirm/`,
  },
  payments: {
    stripe: {
      createIntent: "/payments/stripe/create-intent/",
      confirm: "/payments/stripe/confirm/",
      refund: "/payments/stripe/refund/",
      webhook: "/payments/stripe/webhook/",
    },
  },
} as const;
