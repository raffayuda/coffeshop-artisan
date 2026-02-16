## 🔧 Critical Vercel Deployment Checklist

### ✅ STEP-BY-STEP: Set Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Open https://vercel.com/dashboard
   - Select your project: `coffeeshop-artisan...`

2. **Navigate to Settings**
   - Click **Settings** tab (top navigation)
   - Click **Environment Variables** (left sidebar)

3. **Add Required Variables** (click "Add" for each):

   **Variable 1: DATABASE_URL**
   ```
   Name: DATABASE_URL
   Value: postgresql://user:password@host:5432/database?schema=public
   Environment: ✅ Production ✅ Preview ✅ Development
   ```

   **Variable 2: NUXT_SESSION_PASSWORD**
   ```bash
   # Generate in terminal first:
   openssl rand -base64 32
   
   # Then add in Vercel:
   Name: NUXT_SESSION_PASSWORD
   Value: [paste-hasil-generate-32-characters]
   Environment: ✅ Production ✅ Preview ✅ Development
   ```

   **Variable 3: NODE_ENV**
   ```
   Name: NODE_ENV
   Value: production
   Environment: ✅ Production
   ```

4. **Click "Save" for each variable**

5. **Redeploy** (IMPORTANT!)
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**
   - Wait for build to complete

---

## 🐛 Debugging Production Issues

### Check Vercel Logs

**Option 1: Via Dashboard**
1. Go to your project in Vercel
2. Click **Deployments** tab
3. Click on the latest deployment
4. Scroll to **Runtime Logs** or **Function Logs**
5. Look for errors with `[requireAuth]` prefix

**Option 2: Via CLI**
```bash
npm i -g vercel
vercel login
vercel logs --follow
```

### Expected Log Output After Fix

**✅ GOOD - Login Success:**
```
POST /api/auth/login 200
GET /api/admin/orders/stats 200
GET /api/cart 200
```

**❌ BAD - Still Getting 401:**
```
POST /api/auth/login 200
POST /api/orders/create 401
[requireAuth] No session or user found
```

If you still see `401` errors:
1. Check `NUXT_SESSION_PASSWORD` is set correctly
2. Verify it's 32+ characters long
3. Ensure you clicked "Save" in Vercel
4. Redeploy after adding variables

---

## 🔍 Test Production Authentication

### Test 1: Check Environment Variables Are Loaded
```bash
# Add this temporarily to server/api/auth/login.post.ts (AFTER login success, BEFORE return)
console.log('[DEBUG] Session password exists:', !!process.env.NUXT_SESSION_PASSWORD)
```

### Test 2: Manual API Test
```bash
# Test login endpoint
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}' \
  -c cookies.txt

# Test protected endpoint with cookies
curl -X GET https://your-app.vercel.app/api/admin/orders/stats \
  -b cookies.txt
```

Should return JSON, not 401 error.

---

## 📝 Files Modified Summary

| File | Change | Reason |
|------|--------|--------|
| `nuxt.config.ts` | Added `runtimeConfig` | Configure nuxt-auth-utils session |
| `nuxt.config.ts` | Added `nitro.preset` | Vercel serverless compatibility |
| `server/utils/auth.ts` | Added debug logging | Track auth failures in production |
| `server/api/auth/login.post.ts` | Reduced session data | Avoid cookie size limit (4KB) |
| `server/api/auth/register.post.ts` | Reduced session data | Same as login |
| `package.json` | Added `prisma generate` | Auto-generate client on deploy |

---

## ⚠️ Common Issues & Solutions

### Issue 1: "401 Unauthorized" after login
**Cause:** Session cookie not being set/read
**Solution:**
1. Verify `NUXT_SESSION_PASSWORD` exists in Vercel (Settings → Environment Variables)
2. Check it's 32+ characters
3. Ensure `NODE_ENV=production` is set
4. Redeploy after adding variables

### Issue 2: Login works but dashboard is empty
**Cause:** Database connection or query error
**Solution:**
1. Check `DATABASE_URL` format is correct
2. Ensure database is accessible from internet
3. Run `npx prisma db push` to sync schema
4. Check Vercel function logs for Prisma errors

### Issue 3: "Prisma Client not generated"
**Cause:** Build didn't run postinstall
**Solution:**
- Already fixed in `package.json` with `postinstall: "nuxt prepare && prisma generate"`
- Redeploy to trigger new build

### Issue 4: Login button doesn't change to dropdown
**Cause:** Page uses `navigateTo` instead of full reload
**Solution:**
- Already fixed in `pages/login.vue` using `window.location.href`
- Ensures session loads correctly after login

---

## ✅ Final Verification Checklist

After redeploying with environment variables:

- [ ] Navigate to your Vercel app URL
- [ ] Open browser DevTools → Network tab
- [ ] Login with admin account
- [ ] Check response cookies include `nuxt-session`
- [ ] Navigate to `/admin/dashboard`
- [ ] Verify dashboard shows data (orders, revenue, etc.)
- [ ] Try placing an order as customer
- [ ] Verify payment succeeds (not 401)

**All green?** ✅ You're done!

**Still seeing errors?** Check Vercel logs and look for `[requireAuth]` messages.

---

## 📞 Next Steps If Still Failing

1. **Share Vercel Logs:** Copy the full error log from Vercel
2. **Check Browser Console:** F12 → Console tab for client-side errors
3. **Verify Environment Variables:**
   ```bash
   # Add to any API route temporarily:
   console.log('ENV CHECK:', {
     hasSessionPassword: !!process.env.NUXT_SESSION_PASSWORD,
     hasDatabaseUrl: !!process.env.DATABASE_URL,
     nodeEnv: process.env.NODE_ENV
   })
   ```

4. **Test Database Connection:**
   - Can you connect to your database from your local machine?
   - Is the database URL in Vercel exactly the same as local?
   - Does it include `?schema=public` at the end?

---

**Last Updated:** After adding session configuration and debug logging
**Status:** Ready to test - environment variables must be set in Vercel first!
