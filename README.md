# Vizit Africa

## Description

Vizit Africa is a platform that allows travellers to books flight tickets conveniently and on a good price, it also connects travelers with local guides and tour operators in Africa. It allows users to discover and book tours and activities in different countries in Africa. The platform also provides a way for tour operators to manage their tours and bookings.

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- TanStack Query
- Motion
- Remix Icon
- Sonner
- Next-intl
- Google OAuth

### Backend

- Django
- Django REST Framework
- PostgreSQL
- Stripe

## Deployment

- Frontend: Vercel
- Backend: Render

## How to run

### Frontend

```bash
pnpm install
pnpm dev
```

### Backend

```bash
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

```bash
python manage.py createsuperuser
python manage.py seed_data
python manage.py runserver
```
