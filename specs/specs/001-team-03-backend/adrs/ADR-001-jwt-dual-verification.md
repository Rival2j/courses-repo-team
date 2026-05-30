# ADR-001: Verificación JWT Dual (JWKS ES256 + HS256 Fallback)

**Estado**: Aceptado  
**Fecha**: 2026-05-22  
**Autores**: TEAM-03 Backend  
**Contexto**: F0, T023A

---

## Contexto

El sistema usa Supabase Auth como proveedor de identidad. Supabase emite JWTs firmados con ES256 (ECDSA) usando un par de claves rotable. En entorno de desarrollo local y tests de integración, necesitamos generar tokens válidos sin depender de Supabase Auth activo.

## Decisión

Implementar verificación de dos pasos en `src/lib/jwt.ts`:

1. **Primario**: Verificar con JWKS endpoint de Supabase (`/auth/v1/.well-known/jwks.json`) — usa ES256.
2. **Fallback**: Si JWKS falla (timeout, red no disponible, token no-ES256), verificar con HS256 usando `JWT_SECRET` del entorno.

```typescript
export async function verifyJwt(token: string, secret: string): Promise<JwtPayload> {
  try {
    return await verifyWithJWKS(token); // ES256 primario
  } catch {
    return verifyWithSecret(token, secret); // HS256 fallback
  }
}
```

## Alternativas consideradas

| Opción | Pros | Contras |
|--------|------|---------|
| Solo JWKS | Más seguro, clave rotable | Falla en tests locales sin red |
| Solo HS256 | Simple, siempre disponible | Menos seguro — secreto compartido |
| **Dual (elegida)** | Seguridad en prod, funcional en dev | Fallback puede ser explotado si JWT_SECRET es débil |

## Consecuencias

- En producción: JWKS funciona siempre — el fallback no se activa.
- En desarrollo/tests: `JWT_SECRET=dev-local-jwt-secret-please-change-before-production-2026` permite generar tokens sin Supabase.
- **Riesgo**: Si `JWT_SECRET` llega a producción sin cambiar, un atacante con conocimiento del secreto podría emitir tokens válidos. Mitigación: documentación prominente en `.env.example` y validación en CI.

## Trazabilidad

- Implementado en: `projects/rest-api/lms_api/src/lib/jwt.ts`
- Tests: `src/middleware/auth.ts` usa `verifyJwt()` en cada request protegido
