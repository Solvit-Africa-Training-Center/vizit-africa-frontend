export const endpoints = {
  auth: {
    login: "/accounts/login/",
    register: "/accounts/users/",
    verifyEmail: "/accounts/users/verify_email/",
    list: "/accounts/users/",
    user: (id: string | number) => `/accounts/users/${id}/`,
    me: "/accounts/users/profile/",
    setPassword: "/accounts/users/set_password/",
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

    // RESTful Quote Management
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
    refund: (id: string | number) => `/bookings/${id}/refund/`,
    transactions: "/bookings/transactions/",
    vendorPayouts: "/bookings/vendor-payouts/",
  },
  services: {
    create: "/services/",
    media: "/services/media/",
    availability: "/services/availability/",
    discounts: "/services/discounts/",
    list: "/services/",
    details: (id: string | number) => `/services/${id}/`,
  },
  locations: {
    create: "/locations/",
    list: "/locations/",
  },
  vendors: {
    create: "/vendors/",
    approve: (id: string | number) => `/vendors/${id}/approve/`,
    list: "/vendors/",
  },
  payments: {
    cashIn: "/payments/cashin/",
    cashOut: "/payments/cashout/",
  },
} as const;
