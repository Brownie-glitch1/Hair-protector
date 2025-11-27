from fastapi import Request, HTTPException, status
from datetime import datetime, timedelta
from collections import defaultdict
import asyncio

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests = defaultdict(list)
        self.lock = asyncio.Lock()
    
    async def check_rate_limit(self, request: Request):
        """Check if request exceeds rate limit"""
        client_ip = request.client.host
        now = datetime.utcnow()
        
        async with self.lock:
            # Clean old requests
            self.requests[client_ip] = [
                req_time for req_time in self.requests[client_ip]
                if now - req_time < timedelta(minutes=1)
            ]
            
            # Check limit
            if len(self.requests[client_ip]) >= self.requests_per_minute:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Please try again later."
                )
            
            # Add current request
            self.requests[client_ip].append(now)

# Global rate limiter instance
rate_limiter = RateLimiter(requests_per_minute=60)