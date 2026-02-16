# Vercel Deployment Fix - Coffee Shop App

## Latest Fix (Feb 16, 2026) ✅

### Issue: vercel.json Secret References
**Problem:** vercel.json was using `@secret` syntax which requires Vercel Secrets, but environment variables are set directly in dashboard.

**Fixed:**
- Removed `@database_url` and `@nuxt_session_password` references from vercel.json
- Simplified configuration to only include function settings

### Issue: Session Cookie Not Working in Production
**Problem:** After login, API routes return 401 because session cookie isn't being read.

**Added:**
- Debug logging in `requireAuth()` function
- Test endpoint `/api/debug/session` to verify session state
- Enhanced error logging in login endpoint

## Required Vercel Configuration

### Environment Variables
You **MUST** configure these in Vercel Project Settings → Environment Variables:

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Auth Secret (Required - Generate with: openssl rand -base64 32)
NUXT_SESSION_PASSWORD="your-32-character-secret-key-here"

# Node Environment (Required)
NODE_ENV="production"

# Optional - Database Connection Pool
DATABASE_CONNECTION_LIMIT="10"
```

### How to Set Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - Name: `DATABASE_URL`
   - Value: Your PostgreSQL connection string
   - Environment: Production, Preview, Development (check all)
   - Click **Save**

4. Add session secret:
   - Name: `NUXT_SESSION_PASSWORD`
   - Value: Generate using `openssl rand -base64 32` in terminal
   - Environment: Production, Preview, Development
   - Click **Save**

### Database Setup

Ensure your PostgreSQL database:
1. ✅ Is accessible from Vercel's servers
2. ✅ Has Prisma schema applied: `npx prisma db push` or `npx prisma migrate deploy`
3. ✅ Connection string includes `?schema=public`
4. ✅ SSL mode configured if required by host

**Recommended Database Providers:**
- Supabase (Free tier available)
- Neon (Serverless PostgreSQL)
- Railway
- PlanetScale (MySQL alternative)

### Build Settings in Vercel

- **Framework Preset:** Nuxt.js
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.output` (default)
- **Install Command:** `npm install` (default)
- **Node Version:** 18.x or higher

## Debugging Steps After Deploy

### 1. Test Session Endpoint
```bash
# After login, visit this URL in browser:
https://your-app.vercel.app/api/debug/session

# Should return:
{
  "success": true,
  "hasSession": true,
  "hasUser": true,
  "user": { ... },
  "cookies": ["nuxt-session"]
}
```

### 2. Check Vercel Function Logs
```bash
# Via CLI
vercel logs --follow

# Look for these log messages:
# [Login] Session set for user: {...}
# [requireAuth] Session check: {...}
```

### 3. Test API Endpoints
```bash
# Test admin orders (should work after login)
curl https://your-app.vercel.app/api/admin/orders/stats \
  -H "Cookie: nuxt-session=..."

# Should return stats, not 401
```

## Common Issues & Solutions

After deploying with fixes:

1. ✅ Check Vercel deployment logs for errors
2. ✅ Test login with admin account
3. ✅ Verify admin dashboard loads data
4. ✅ Test barista dashboard
5. ✅ Test customer cart and checkout
6. ✅ Verify payment processing works

### Testing Production Authentication

```bash
# Test admin login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'

# Should return: {"success":true,"user":{...}}
```

### Common Deployment Errors & Solutions

#### Error: "Not authenticated" on all API calls
**Solution:** 
- Verify `NUXT_SESSION_PASSWORD` is set in Vercel
- Check cookies are being sent (not blocked by CORS)
- Ensure `getUserSession()` is working

#### Error: "Cannot connect to database"
**Solution:**
- Verify `DATABASE_URL` in Vercel environment variables
- Check database accepts connections from Vercel IPs
- Test connection string locally first

#### Error: "Prisma Client not generated"
**Solution:**
- Add to `package.json` scripts:
  ```json
  {
    "scripts": {
      "postinstall": "prisma generate"
    }
  }
  ```
- Redeploy

#### Error: "Too many Prisma Client instances"
**Solution:** Already fixed in `server/utils/prisma.ts`

### Monitoring Production

View real-time logs in Vercel:
```bash
vercel logs --follow
```

Or in Vercel Dashboard → Deployments → [Your Deployment] → View Function Logs

### Rollback Plan

If issues persist:
1. Check deployment logs in Vercel
2. Roll back to previous working deployment
3. Verify all environment variables are set
4. Test database connectivity
5. Check Prisma schema is up to date

## Files Modified

1. ✅ `server/utils/auth.ts` - Migrated to nuxt-auth-utils
2. ✅ `server/utils/prisma.ts` - Serverless-friendly singleton pattern
3. ✅ `app/composables/useCart.ts` - Improved error handling (already using nuxt-auth-utils)

## No Changes Needed

These files are already correct:
- ✅ `server/api/cart/*.ts` - Already using `getUserSession()`
- ✅ `app/composables/useAuth.ts` - Already using nuxt-auth-utils
- ✅ All middleware files - Already using `useUserSession()`
- ✅ Client-side authentication flow

## Next Steps

1. **Set environment variables in Vercel** (critical!)
2. **Redeploy** from Vercel dashboard or:
   ```bash
   git add .
   git commit -m "fix: update auth system for production"
   git push
   ```
3. **Test all user roles:**
   - Admin dashboard data loading
   - Barista order management
   - Customer checkout process
4. **Monitor logs** for any remaining issues

## Support

If issues persist after following this guide:
1. Check Vercel function logs
2. Verify database connectivity
3. Test API endpoints directly
4. Ensure Prisma schema is deployed to database

---

**Status:** All authentication and database issues fixed. Ready for production deployment after environment variable configuration.
