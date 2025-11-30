# User Guide: Troubleshooting Common Errors

## Error 1: "Product with barcode not found"

### What You See:
```
Product with barcode 'XXXXX' not found. 
Please scan by ingredients instead.
```

### Why It Happens:
- The barcode you entered doesn't exist in our database yet
- We currently have limited products (this is an MVP)
- External barcode API is not configured

### How to Fix:

**Option 1: Use Test Barcode**
Try this test barcode that's in the database:
```
764302215066
```
This is a Shea Moisture Moisturizing Conditioner with full ingredients loaded.

**Option 2: Use Manual Ingredient Entry (Recommended)**
1. Click the "📝 Paste Ingredients" tab
2. Copy ingredients from the product label
3. Paste them in the text box
4. Click "Analyze Product"

**Example Ingredients to Test:**
```
Water, Glycerin, Cetearyl Alcohol, Shea Butter, Coconut Oil, 
Hydrolyzed Wheat Protein, Panthenol, Aloe Vera, Fragrance
```

---

## Error 2: "Field required" or Validation Error

### What You See:
- Red error box with technical field names
- Form won't submit
- Error mentions "ingredients_text" or similar

### Why It Happens:
- The ingredient list field is empty
- Required field was not filled in
- Browser autofill might have interfered

### How to Fix:

**Step 1: Make sure ingredient field is filled**
- The large text box must have content
- Paste actual product ingredients
- At least a few ingredient names

**Step 2: Clear the error**
- Click in the ingredient text box
- Start typing or paste ingredients
- Error should disappear when you submit again

**Step 3: Valid ingredient format examples**

✅ **Good Examples:**
```
Water, Glycerin, Shea Butter, Coconut Oil
```
```
Aqua, Cetearyl Alcohol, Glycerin, Behentrimonium Chloride
```

❌ **Bad Examples:**
```
(Empty field)
```
```
overall_score
```
```
Just product name without ingredients
```

---

## Error 3: Login/Registration Errors

### Common Issues:

**"Email already registered"**
- The email is already in use
- Try logging in instead
- Or use a different email

**"Invalid credentials"**
- Wrong email or password
- Check for typos
- Passwords are case-sensitive

**"Password must be at least 6 characters"**
- Password is too short
- Use at least 6 characters
- Mix letters and numbers

---

## Error 4: "No hair profile found"

### What You See:
```
No hair profile found. 
Please complete your hair profile before scanning products.
```

### Why It Happens:
- You skipped the hair profile setup
- Profile wasn't saved properly

### How to Fix:
1. You'll be redirected to onboarding automatically
2. Complete all 4 steps:
   - Step 1: Select your porosity (Low/Medium/High)
   - Step 2: Select curl pattern (3A-4C)
   - Step 3: Select scalp type (Dry/Normal/Oily/Sensitive)
   - Step 4: Select hair density (Low/Medium/High)
3. Click "Complete Setup"
4. You'll be taken to the scan page

---

## Quick Fixes Checklist

### If Scan Fails:
- [ ] Check if ingredient field has text
- [ ] Try switching between tabs (Paste/Barcode)
- [ ] Refresh the page and try again
- [ ] Make sure you're logged in
- [ ] Verify you have a hair profile

### If Barcode Doesn't Work:
- [ ] Try the test barcode: `764302215066`
- [ ] Switch to manual ingredient entry
- [ ] Check if barcode has correct digits

### If Form Won't Submit:
- [ ] Look for red error messages
- [ ] Check all required fields (marked with *)
- [ ] Clear any autofill data
- [ ] Try typing manually instead of pasting

---

## Understanding Error Messages

### Technical Errors (Debugging Info)
If you see errors with technical terms like:
- `body → ingredients_text: Field required`
- `validation_error`
- `loc`, `msg`, `ctx`

**What they mean:**
- `body` = Form data
- `ingredients_text` = The ingredient list field
- `Field required` = You need to fill this in

**How to fix:**
Just fill in the missing field mentioned in the error.

---

## Test Data for Quick Testing

### Test User Account:
```
Email: scanner@test.com
Password: test1234
```

### Test Hair Profile:
```
Porosity: Low
Curl Pattern: 4c
Scalp Type: Sensitive
Density: High
```

### Test Product (Manual Entry):
```
Product Name: Curl Cream
Brand: Test Brand
Ingredients: Water, Glycerin, Cetearyl Alcohol, Shea Butter, Coconut Oil, Hydrolyzed Wheat Protein, Panthenol, Aloe Vera
```

### Test Barcode:
```
764302215066
```

---

## Still Having Issues?

### Check These:
1. **Browser:** Use latest Chrome, Firefox, or Safari
2. **JavaScript:** Make sure it's enabled
3. **Internet:** Check your connection
4. **Cache:** Try clearing browser cache (Ctrl+F5)

### Common Solutions:
- **Logout and login again**
- **Refresh the page** (F5)
- **Clear form and start over**
- **Try different browser**
- **Check console for errors** (F12)

---

## Expected Behavior

### Successful Scan Flow:
1. Login → Redirects to Scan page
2. Choose tab (Paste or Barcode)
3. Enter ingredient data
4. Click "Analyze Product"
5. Wait 1-3 seconds
6. See results page with verdict
7. Verdict shows: GREAT / CAUTION / AVOID
8. Detailed scores and explanations displayed

### If Everything Works:
- ✅ No error messages
- ✅ Progress indicator shows
- ✅ Redirects to results page
- ✅ Verdict displayed with colors
- ✅ Explanation points listed
- ✅ Can scan another product

---

## Feature Limitations (MVP)

**What's Working:**
✅ Manual ingredient paste
✅ Barcode lookup (limited database)
✅ Hair profile matching
✅ Scoring and verdicts
✅ Scan history

**What's Not Yet Available:**
⏳ Image upload (OCR)
⏳ External barcode API
⏳ Large product database
⏳ Product recommendations
⏳ Community reviews

---

## Contact & Support

This is an MVP (Minimum Viable Product) - a working prototype with core features.

**For Development Issues:**
- Check the documentation in `/app/docs/`
- Review API docs at http://localhost:8001/docs
- Check backend logs for errors

**Expected Performance:**
- Scan time: 1-3 seconds
- Page load: 2-4 seconds
- Responsive on mobile & desktop

---

**Last Updated:** November 30, 2025
