# API implementation guide

## Authentication

### Register

```typescript
const register = async (credentials: RegisterCredentials) => {
  const response = await apiClient.register(credentials);
  return response;
};
```

### Verify

```typescript
const verify = async (credentials: VerifyCredentials) => {
  const response = await apiClient.verify(credentials);
  return response;
};
```

### Login

```typescript
const login = async (credentials: LoginCredentials) => {
  const response = await apiClient.login(credentials);
  return response;
};
```
