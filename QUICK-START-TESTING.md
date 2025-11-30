# 🚀 Quick Start Testing Guide

## Access the App
**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:8001  
**API Docs:** http://localhost:8001/docs

---

## Method 1: Use Pre-Created Test Account

### Login Credentials:
```
Email: scanner@test.com
Password: test1234
```

This account already has:
- ✅ Hair profile set up (Low porosity, 4c curl, sensitive scalp)
- ✅ 3 scans in history
- ✅ Ready to scan immediately

**Steps:**
1. Go to http://localhost:3000
2. Click "Login"
3. Enter the credentials above
4. Click "Login"
5. You're on the Scan page - ready to go!

---

## Method 2: Create New Account

### Registration:
1. Click "Get Started" or "Register"
2. Fill in:
   ```
   Full Name: Your Name
   Email: youremail@test.com
   Password: test123 (min 6 chars)
   Confirm Password: test123
   ```
3. Complete 4-step hair profile:
   - **Porosity:** Choose low/medium/high
   - **Curl Pattern:** Choose 3a-4c
   - **Scalp Type:** Choose dry/normal/oily/sensitive
   - **Density:** Choose low/medium/high
4. Click "Complete Setup"

---

## Testing Scans

### Option A: Test with Working Barcode

**Use this barcode that's IN the database:**
```
764302215066
```

**Steps:**
1. On Scan page, click "🔢 Barcode" tab
2. Enter: `764302215066`
3. Click "Scan Barcode"
4. ✅ Success! You'll see results for Shea Moisture Conditioner

---

### Option B: Manual Ingredient Entry (Recommended)

**Test Product 1: Good Product**
```
Product Name: Curl Defining Cream
Brand: Natural Hair Co
Ingredients:
Water, Glycerin, Cetearyl Alcohol, Shea Butter, Coconut Oil, 
Hydrolyzed Wheat Protein, Panthenol, Aloe Vera, Cetyl Alcohol

Expected Result: GREAT (70-85/100)
Reasons: Water-based, humectants present, balanced
```

**Test Product 2: Bad Product**
```
Product Name: Hair Gel
Brand: Generic Brand
Ingredients:
Denatured Alcohol, Isopropyl Alcohol, Mineral Oil, 
Dimethicone, Fragrance, Petrolatum

Expected Result: AVOID (negative score)
Reasons: Drying alcohols, not water-based, scalp irritants
```

**Test Product 3: Caution Product**
```
Product Name: Styling Cream
Brand: Test Brand
Ingredients:
Water, Mineral Oil, Petrolatum, Fragrance, Dimethicone, 
Coconut Oil, Shea Butter, Glycerin

Expected Result: CAUTION (50-70/100)
Reasons: Water-based but heavy oils and potential irritants
```

---

## Understanding Results

### Verdict Colors:
- **🟢 GREAT (70-100):** Safe to use, good match for your hair
- **🟡 CAUTION (50-69):** Use with awareness, monitor effects
- **🔴 AVOID (<50):** Not recommended, high risk

### Score Breakdown:
- **Moisture Score (0-100):** Higher = better hydration
- **Buildup Risk (0-100):** Higher = more buildup (bad)
- **Scalp Safety (0-100):** Higher = safer for scalp

### Key Indicators:
- **Water Based:** Yes/No (water in first 5 ingredients)
- **Heavy Oils:** Yes/No (coconut, castor, mineral oil detected)
- **Protein Heavy:** Yes/No (2+ proteins in top 10)

---

## Common Test Scenarios

### Scenario 1: Low Porosity Hair
**Profile:** Low porosity, 4c curl, dry scalp

**Good Product:**
```
Water, Glycerin, Argan Oil, Jojoba Oil, Aloe Vera
Result: GREAT - Light oils, water-based
```

**Bad Product:**
```
Shea Butter, Coconut Oil, Castor Oil, Cocoa Butter
Result: AVOID - Too heavy, buildup risk
```

---

### Scenario 2: High Porosity Hair
**Profile:** High porosity, 4a curl, normal scalp

**Good Product:**
```
Water, Shea Butter, Coconut Oil, Hydrolyzed Keratin, Glycerin
Result: GREAT - Proteins + sealing oils
```

**Bad Product:**
```
Denatured Alcohol, Isopropyl Alcohol, Water, Fragrance
Result: AVOID - Drying alcohols for already porous hair
```

---

### Scenario 3: Sensitive Scalp
**Profile:** Medium porosity, 3c curl, sensitive scalp

**Good Product:**
```
Water, Glycerin, Aloe Vera, Cetyl Alcohol, Panthenol
Result: GREAT - Fragrance-free, gentle ingredients
```

**Bad Product:**
```
Water, Fragrance, Essential Oils, Peppermint Oil, Glycerin
Result: CAUTION/AVOID - Scalp irritants present
```

---

## Troubleshooting Quick Fixes

### Problem: "Product not found" error
**Solution:** Use test barcode `764302215066` or switch to manual entry

### Problem: "Field required" error
**Solution:** Make sure ingredient text box is filled before submitting

### Problem: "No hair profile" error
**Solution:** Complete the 4-step onboarding wizard

### Problem: Can't login
**Solution:** 
- Check email/password spelling
- Try test account: scanner@test.com / test1234
- Or register new account

### Problem: Page won't load
**Solution:**
- Check if services are running: `sudo supervisorctl status`
- Restart if needed: `sudo supervisorctl restart all`
- Check logs: `tail -f /var/log/supervisor/frontend.*.log`

---

## API Testing with Curl

### Register User:
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test2@example.com",
    "password":"test1234",
    "full_name":"Test User"
  }'
```

### Scan Product:
```bash
# First, get token from login/register response
TOKEN="your-token-here"

curl -X POST http://localhost:8001/api/scans/ingredients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ingredients_text":"Water, Glycerin, Shea Butter, Coconut Oil",
    "product_name":"Test Product"
  }'
```

---

## Feature Checklist

### ✅ What Works:
- User registration & login
- Hair profile setup (4 steps)
- Manual ingredient scanning
- Barcode scanning (limited database)
- Results with verdicts
- Score breakdowns
- Explanation points
- Scan history
- Profile editing

### ⏳ What's Coming:
- Image upload (OCR)
- External barcode API
- Larger product database
- Product recommendations
- Community features

---

## Performance Expectations

**Typical Response Times:**
- Registration: <1s
- Login: <1s
- Hair profile save: <1s
- Ingredient scan: 1-2s
- Barcode scan: 1-2s
- History load: <1s

**If Slower:**
- Check network connection
- Check backend logs
- Restart services if needed

---

## Need More Help?

**Documentation:**
- Full project docs: `/app/docs/PROJECT_COMPLETE.md`
- Troubleshooting: `/app/docs/USER-GUIDE-troubleshooting.md`
- API reference: http://localhost:8001/docs

**Check Services:**
```bash
sudo supervisorctl status
```

**View Logs:**
```bash
# Backend
tail -f /var/log/supervisor/backend.*.log

# Frontend
tail -f /var/log/supervisor/frontend.*.log
```

---

**Happy Testing! 🎉**
