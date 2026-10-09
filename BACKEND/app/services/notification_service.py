import os
import requests
from typing import List, Dict, Any
from app.database.mongodb import db_manager
from app.services.safe_zone_service import SafeZoneService

class NotificationService:
    @staticmethod
    def send_telegram_alert(chat_id: str, message_body: str) -> bool:
        bot_token = os.getenv('TELEGRAM_BOT_TOKEN', '')
        
        if not bot_token:
            print("[NotificationService] Telegram bot token not configured.")
            return False
            
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message_body,
            "parse_mode": "Markdown"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=5)
            if response.status_code == 200:
                print(f"[NotificationService] Telegram alert sent to {chat_id}")
                return True
            else:
                print(f"[NotificationService] Telegram Error: {response.text}")
                return False
        except Exception as e:
            print(f"[NotificationService] Failed to send Telegram alert: {e}")
            return False

    @staticmethod
    def trigger_critical_alerts(latitude: float, longitude: float, location_name: str, risk_level: str):
        if risk_level != "CRITICAL":
            return
            
        collection = db_manager.get_collection("alert_subscribers")
        subscribers = list(collection.find({"is_active": True}))
        
        from app.services.safe_zone_service import haversine_distance
        
        for sub in subscribers:
            sub_lat = sub.get("latitude")
            sub_lng = sub.get("longitude")
            chat_id = sub.get("phone_number") # We reuse this field to store Telegram Chat ID
            
            if not sub_lat or not sub_lng or not chat_id:
                continue
                
            dist = haversine_distance(latitude, longitude, float(sub_lat), float(sub_lng))
            if dist <= 25.0:
                safe_zones = SafeZoneService.get_nearby_safe_zones(float(sub_lat), float(sub_lng), max_distance_km=100.0)
                zone_info = "Find high ground immediately."
                
                if safe_zones:
                    nearest = safe_zones[0]
                    link = nearest.get('google_maps_url', f"https://maps.google.com/?q={nearest.get('latitude')},{nearest.get('longitude')}")
                    zone_info = f"🛡️ *Nearest Safe Zone:* {nearest['name']} ({nearest.get('distance_km', 'Near')} km away)\n📍 *Directions:* [Open in Google Maps]({link})"
                
                msg = f"🚨 *FLOOD ALERT (CRITICAL RISK)!* 🚨\n\nThe area near *{location_name}* has reached critical flood risk levels. Please evacuate.\n\n{zone_info}"
                
                NotificationService.send_telegram_alert(chat_id, msg)

