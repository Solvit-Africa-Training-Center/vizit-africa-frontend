export const endpoints = {
  auth: {
    login: "/accounts/login/",
    register: "/accounts/users/",
    verifyEmail: "/accounts/users/verify_email/",
    user: (id: string | number) => `/accounts/users/${id}/`,
    me: "/accounts/users/profile/",
    setPassword: "/accounts/users/set_password/",
  },
  bookings: {
    list: "/bookings/",
    items: {
      create: "/bookings/items/create/",
    },
    confirm: "/bookings/confirm/",
    submitTrip: "/bookings/submit-trip/",
    tickets: {
      generate: (id: string | number) => `/bookings/${id}/generate-ticket/`,
      verify: "/bookings/verify-ticket/",
    },
    commission: (id: string | number) => `/bookings/${id}/commission/`,
    payout: (id: string | number) => `/bookings/${id}/payout/`,
    refund: (id: string | number) => `/bookings/${id}/refund/`,
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
