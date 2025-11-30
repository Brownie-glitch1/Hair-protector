# External Barcode API Configuration Guide

## Overview
This guide explains how to integrate external barcode lookup services to automatically fetch product information when scanning barcodes.

---

## Available Barcode APIs

### 1. Open Food Facts API (FREE) ⭐ Recommended
**Best for:** Food & beauty products

**Features:**
- ✅ Completely FREE
- ✅ No API key required
- ✅ Millions of products worldwide
- ✅ Open database (crowdsourced)
- ✅ Includes ingredient lists
- ✅ 1000+ requests/day allowed

**Data Provided:**
- Product name
- Brand
- Categories
- Ingredients list (perfect for our app!)
- Barcode/UPC
- Images
- Nutrition facts

**API Endpoint:**
```
GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json
```

**Example Response:**
```json
{
  "status": 1,
  "product": {
    "product_name": "Shea Moisture Curl Enhancing Smoothie",
    "brands": "SheaMoisture",
    "categories": "Hair care, Hair styling",
    "ingredients_text": "Water, Butyrospermum Parkii (Shea) Butter, Cocos Nucifera (Coconut) Oil...",
    "code": "764302215066"
  }
}
```

**Pros:**
- No registration needed
- Perfect for hair care products
- Already includes ingredients
- Great for MVP/testing

**Cons:**
- Not all products available
- Data quality varies (crowdsourced)
- May not have niche products

---

### 2. UPC Database API
**Best for:** General products, wide coverage

**Pricing:**
- FREE tier: 100 requests/day
- Basic: $10/month (1,000 requests/day)
- Pro: $30/month (10,000 requests/day)

**Registration:**
```
1. Visit: https://upcdatabase.com/api
2. Sign up for account
3. Get API key from dashboard
```

**Features:**
- Large product database
- Includes many categories
- Good for non-food items
- JSON and XML responses

**API Endpoint:**
```
GET https://api.upcdatabase.org/product/{barcode}
Header: Authorization: Bearer YOUR_API_KEY
```

**Example Response:**
```json
{
  "success": true,
  "product": {
    "title": "Product Name",
    "brand": "Brand Name",
    "description": "Product description",
    "upc": "123456789012",
    "category": "Health & Beauty"
  }
}
```

**Pros:**
- Professional API
- Good coverage
- Reliable uptime
- Support available

**Cons:**
- Requires API key
- Rate limits on free tier
- May not include ingredients

---

### 3. Barcode Lookup API
**Best for:** Enterprise use, highest accuracy

**Pricing:**
- Free trial: 100 lookups
- Starter: $19/month (2,000 lookups)
- Pro: $49/month (10,000 lookups)

**Registration:**
```
1. Visit: https://www.barcodelookup.com/api
2. Create account
3. Subscribe to plan
4. Get API key
```

**API Endpoint:**
```
GET https://api.barcodelookup.com/v3/products?barcode={barcode}&key={api_key}
```

**Pros:**
- Very accurate data
- Good documentation
- Multiple data sources
- Amazon integration

**Cons:**
- Paid only (after trial)
- May not include ingredients
- Overkill for MVP

---

### 4. Nutritionix API
**Best for:** Food products with nutrition data

**Pricing:**
- Free tier: 200 requests/day
- Pro: $30/month (5,000 requests/day)

**Registration:**
```
1. Visit: https://www.nutritionix.com/business/api
2. Sign up for developer account
3. Get API key and App ID
```

**API Endpoint:**
```
GET https://trackapi.nutritionix.com/v2/search/item?upc={barcode}
Headers:
  x-app-id: YOUR_APP_ID
  x-app-key: YOUR_API_KEY
```

**Pros:**
- Nutrition-focused
- Good for food products
- Includes ingredients
- Free tier available

**Cons:**
- Limited to food/beverages
- Not ideal for hair products
- Requires registration

---

## Implementation Guide

### Step 1: Choose Your API

**Recommendation for Hair Product Scanner:**
1. **Primary:** Open Food Facts (FREE, no key needed)
2. **Fallback:** UPC Database (if product not found)

**Why Open Food Facts?**
- Includes many hair care products
- Has ingredient lists
- Completely free
- No setup required

---

### Step 2: Get API Keys (if needed)

#### For Open Food Facts:
✅ No API key needed! Skip to Step 3.

#### For UPC Database:
```bash
1. Go to: https://upcdatabase.com/api
2. Click "Sign Up"
3. Verify email
4. Go to Dashboard
5. Copy your API key
6. Example: upc_abc123xyz456
```

#### For Barcode Lookup:
```bash
1. Go to: https://www.barcodelookup.com/api
2. Register account
3. Choose plan (free trial available)
4. Get API key from account settings
5. Example: bl_abc123xyz456
```

---

### Step 3: Configure Backend

#### Add API Keys to Environment File

Edit `/app/backend/.env`:

```env
# External Barcode APIs

# Open Food Facts (no key needed)
OPEN_FOOD_FACTS_ENABLED=true

# UPC Database (optional)
UPC_DATABASE_API_KEY=your_upc_database_key_here
UPC_DATABASE_ENABLED=false

# Barcode Lookup (optional)
BARCODE_LOOKUP_API_KEY=your_barcode_lookup_key_here
BARCODE_LOOKUP_ENABLED=false

# Nutritionix (optional)
NUTRITIONIX_APP_ID=your_nutritionix_app_id_here
NUTRITIONIX_API_KEY=your_nutritionix_api_key_here
NUTRITIONIX_ENABLED=false
```

**Set to true to enable:**
```env
OPEN_FOOD_FACTS_ENABLED=true
UPC_DATABASE_ENABLED=true
```

---

### Step 4: Update Backend Code

The barcode service is already set up for external API integration!

**File:** `/app/backend/services/barcode_service.py`

**Current Implementation:**
```python
async def lookup_product(barcode: str) -> Optional[Dict]:
    # 1. Check local database first
    product = await db.products.find_one({"barcode": barcode})
    if product:
        return {"source": "local", ...}
    
    # 2. Check external APIs (TODO)
    # This is where external APIs will be called
```

**To Enable External APIs:**

Create a new file: `/app/backend/services/external_barcode.py`

```python
import os
import requests
from typing import Optional, Dict
import logging

logger = logging.getLogger(__name__)

class ExternalBarcodeService:
    
    @staticmethod
    async def lookup_open_food_facts(barcode: str) -> Optional[Dict]:
        """Query Open Food Facts API (FREE)"""
        if not os.getenv('OPEN_FOOD_FACTS_ENABLED', 'false').lower() == 'true':
            return None
        
        try:
            url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 1:
                    product = data.get('product', {})
                    return {
                        'source': 'open_food_facts',
                        'name': product.get('product_name', 'Unknown Product'),
                        'brand': product.get('brands', ''),
                        'category': product.get('categories', ''),
                        'ingredients_text': product.get('ingredients_text', ''),
                        'barcode': barcode,
                        'image_url': product.get('image_url', '')
                    }
        except Exception as e:
            logger.error(f"Open Food Facts API error: {e}")
        
        return None
    
    @staticmethod
    async def lookup_upc_database(barcode: str) -> Optional[Dict]:
        """Query UPC Database API"""
        api_key = os.getenv('UPC_DATABASE_API_KEY')
        enabled = os.getenv('UPC_DATABASE_ENABLED', 'false').lower() == 'true'
        
        if not enabled or not api_key:
            return None
        
        try:
            url = f"https://api.upcdatabase.org/product/{barcode}"
            headers = {'Authorization': f'Bearer {api_key}'}
            response = requests.get(url, headers=headers, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    product = data.get('product', {})
                    return {
                        'source': 'upc_database',
                        'name': product.get('title', 'Unknown Product'),
                        'brand': product.get('brand', ''),
                        'category': product.get('category', ''),
                        'ingredients_text': product.get('description', ''),
                        'barcode': barcode
                    }
        except Exception as e:
            logger.error(f"UPC Database API error: {e}")
        
        return None
    
    @staticmethod
    async def lookup_barcode_lookup(barcode: str) -> Optional[Dict]:
        """Query Barcode Lookup API"""
        api_key = os.getenv('BARCODE_LOOKUP_API_KEY')
        enabled = os.getenv('BARCODE_LOOKUP_ENABLED', 'false').lower() == 'true'
        
        if not enabled or not api_key:
            return None
        
        try:
            url = f"https://api.barcodelookup.com/v3/products"
            params = {'barcode': barcode, 'key': api_key}
            response = requests.get(url, params=params, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                products = data.get('products', [])
                if products:
                    product = products[0]
                    return {
                        'source': 'barcode_lookup',
                        'name': product.get('title', 'Unknown Product'),
                        'brand': product.get('brand', ''),
                        'category': product.get('category', ''),
                        'ingredients_text': product.get('description', ''),
                        'barcode': barcode
                    }
        except Exception as e:
            logger.error(f"Barcode Lookup API error: {e}")
        
        return None
    
    @staticmethod
    async def lookup_all(barcode: str) -> Optional[Dict]:
        """Try all external APIs in sequence"""
        
        # Try Open Food Facts first (free, no key needed)
        result = await ExternalBarcodeService.lookup_open_food_facts(barcode)
        if result:
            return result
        
        # Try UPC Database
        result = await ExternalBarcodeService.lookup_upc_database(barcode)
        if result:
            return result
        
        # Try Barcode Lookup
        result = await ExternalBarcodeService.lookup_barcode_lookup(barcode)
        if result:
            return result
        
        return None
```

---

### Step 5: Update Barcode Service

Edit `/app/backend/services/barcode_service.py`:

```python
from services.external_barcode import ExternalBarcodeService

class BarcodeService:
    
    @staticmethod
    async def lookup_product(barcode: str) -> Optional[Dict]:
        """
        Look up product by barcode.
        1. Check local database
        2. Check external APIs
        3. Save to local database if found externally
        """
        db = get_database()
        
        # 1. Check local database first
        product = await db.products.find_one({"barcode": barcode})
        if product:
            logger.info(f"Product found in local database: {barcode}")
            return {
                "source": "local",
                "product_id": product["product_id"],
                "name": product["name"],
                "brand": product.get("brand"),
                "category": product["category"],
                "ingredients_text": product["ingredients_text"],
                "image_url": product.get("image_url")
            }
        
        # 2. Check external APIs
        logger.info(f"Product not in local DB, checking external APIs: {barcode}")
        external_result = await ExternalBarcodeService.lookup_all(barcode)
        
        if external_result:
            # 3. Save to local database for future lookups
            import uuid
            product_id = str(uuid.uuid4())
            
            product_doc = {
                "product_id": product_id,
                "name": external_result["name"],
                "brand": external_result.get("brand"),
                "barcode": barcode,
                "category": external_result.get("category", "uncategorized"),
                "ingredients_text": external_result["ingredients_text"],
                "image_url": external_result.get("image_url"),
                "source": external_result["source"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "scan_count": 0
            }
            
            await db.products.insert_one(product_doc)
            logger.info(f"Product saved to local database from {external_result['source']}")
            
            return {
                "source": external_result["source"],
                "product_id": product_id,
                **external_result
            }
        
        # Not found anywhere
        return None
```

---

### Step 6: Add requests Library

Edit `/app/backend/requirements.txt`:

```txt
# Add if not already present
requests==2.31.0
```

Install:
```bash
cd /app/backend
pip install requests
pip freeze > requirements.txt
```

---

### Step 7: Restart Backend

```bash
sudo supervisorctl restart backend
```

Check logs:
```bash
tail -f /var/log/supervisor/backend.out.log
```

---

## Testing External APIs

### Test Open Food Facts (No Key Needed)

```bash
# Direct API test
curl "https://world.openfoodfacts.org/api/v2/product/764302215066.json"

# Should return product data for Shea Moisture Conditioner
```

**Test in App:**
1. Login to app
2. Go to Scan page
3. Click Barcode tab
4. Scan barcode: `764302215066`
5. Should find product and show results

### Test UPC Database (Requires Key)

```bash
# Test your API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.upcdatabase.org/product/764302215066"
```

### Test Through Backend

```bash
# Register test user
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","full_name":"Test User"}'

# Get token from response
TOKEN="your_token_here"

# Test barcode scan
curl -X POST http://localhost:8001/api/scans/barcode \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"barcode":"764302215066"}'

# Check response - should include product info
```

---

## Configuration Examples

### Minimal Setup (FREE)

`.env` file:
```env
# Only Open Food Facts
OPEN_FOOD_FACTS_ENABLED=true
```

**Pros:**
- No cost
- No registration
- Works immediately
- Good for MVP

**Cons:**
- Limited product coverage
- May not have all products

---

### Recommended Setup

`.env` file:
```env
# Primary: Open Food Facts (free)
OPEN_FOOD_FACTS_ENABLED=true

# Fallback: UPC Database (paid)
UPC_DATABASE_API_KEY=your_key_here
UPC_DATABASE_ENABLED=true
```

**Lookup Order:**
1. Local database (instant)
2. Open Food Facts (free)
3. UPC Database (paid fallback)

**Benefits:**
- Best coverage
- Cost-effective
- Reliable fallback

---

### Enterprise Setup

`.env` file:
```env
# All APIs enabled
OPEN_FOOD_FACTS_ENABLED=true

UPC_DATABASE_API_KEY=your_key_here
UPC_DATABASE_ENABLED=true

BARCODE_LOOKUP_API_KEY=your_key_here
BARCODE_LOOKUP_ENABLED=true
```

**Lookup Order:**
1. Local database
2. Open Food Facts
3. UPC Database
4. Barcode Lookup

**Benefits:**
- Maximum coverage
- Multiple fallbacks
- Best for production

---

## Monitoring & Analytics

### Add Logging

```python
# In barcode_service.py
logger.info(f"Barcode lookup: {barcode}")
logger.info(f"Found in: {result['source']}")
logger.info(f"API calls made: {api_calls_count}")
```

### Track API Usage

```python
# Count API calls per source
from collections import Counter

api_usage = Counter()

def track_api_call(source):
    api_usage[source] += 1
    
# Log daily
logger.info(f"API Usage: {dict(api_usage)}")
```

### Monitor Costs

For paid APIs, track:
- Daily request count
- Cost per request
- Monthly projection
- Rate limit status

---

## Troubleshooting

### "Product not found" with valid barcode

**Solutions:**
1. Check if API is enabled in `.env`
2. Verify API key is correct
3. Test API directly with curl
4. Check API rate limits
5. Try different API

### API timeout errors

**Solutions:**
```python
# Increase timeout
response = requests.get(url, timeout=10)  # 10 seconds

# Add retry logic
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504]
)
```

### Rate limit exceeded

**Solutions:**
1. Upgrade API plan
2. Cache results in local DB
3. Add rate limiting on your side
4. Use multiple APIs as fallback

### Invalid API key

**Solutions:**
1. Check `.env` file has correct key
2. Verify no extra spaces
3. Regenerate key in API dashboard
4. Check key hasn't expired

---

## Best Practices

### 1. Always Check Local First
```python
# Fast local lookup
local_result = await db.products.find_one({"barcode": barcode})
if local_result:
    return local_result  # Instant response
```

### 2. Cache External Results
```python
# Save external results locally
if external_result:
    await db.products.insert_one(product_doc)
```

### 3. Handle Errors Gracefully
```python
try:
    result = await external_api.lookup(barcode)
except Exception as e:
    logger.error(f"API error: {e}")
    return None  # Fail gracefully
```

### 4. Set Reasonable Timeouts
```python
response = requests.get(url, timeout=5)  # 5 seconds max
```

### 5. Monitor API Health
```python
# Track success/failure rates
metrics = {
    'total_calls': 0,
    'successful': 0,
    'failed': 0,
    'avg_response_time': 0
}
```

---

## Cost Estimation

### Free Tier (Recommended for MVP)

**Setup:**
- Open Food Facts (unlimited, free)
- Local database caching

**Cost:** $0/month

**Capacity:**
- Unlimited lookups
- Good product coverage
- Perfect for testing

---

### Starter Tier

**Setup:**
- Open Food Facts (free)
- UPC Database ($10/month)

**Cost:** $10/month

**Capacity:**
- 1,000 external API calls/day
- Most calls served from cache
- Good for small user base

---

### Production Tier

**Setup:**
- Open Food Facts (free)
- UPC Database ($30/month)

**Cost:** $30/month

**Capacity:**
- 10,000 external API calls/day
- Scalable for growth
- Professional support

---

## Quick Start Checklist

- [ ] Choose your API (recommend: Open Food Facts)
- [ ] Get API key (if needed)
- [ ] Add key to `/app/backend/.env`
- [ ] Set `ENABLED=true` for chosen API
- [ ] Create `/app/backend/services/external_barcode.py`
- [ ] Update `/app/backend/services/barcode_service.py`
- [ ] Add `requests` to requirements.txt
- [ ] Restart backend: `sudo supervisorctl restart backend`
- [ ] Test with known barcode
- [ ] Monitor logs for errors
- [ ] Verify products are cached locally

---

## Support Resources

**Open Food Facts:**
- Docs: https://openfoodfacts.github.io/api-documentation/
- Forum: https://forum.openfoodfacts.org/

**UPC Database:**
- Docs: https://upcdatabase.com/api-docs
- Support: support@upcdatabase.com

**Barcode Lookup:**
- Docs: https://www.barcodelookup.com/api-docs
- Support: https://www.barcodelookup.com/contact

---

**Status:** Ready for implementation!

**Recommendation:** Start with Open Food Facts (free, no key) and add paid APIs later if needed.

