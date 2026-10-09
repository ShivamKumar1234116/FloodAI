import re

with open('e:/FloodAI/BACKEND/app/database/mongodb.py', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = """    def _ensure_seed_data_live(self):
        \"\"\"If connected to live MongoDB, insert seeds if collection is empty.\"\"\"
        if not self.is_connected or self.db is None:
            return
            
        try:
            # Seed safe zones
            safe_zones_col = self.db['safe_zones']
            if safe_zones_col.count_documents({}) == 0:
                seed_safe_zones = self.collections['safe_zones'].docs
                safe_zones_col.insert_many(seed_safe_zones)
                print('[Database] Seeded safe_zones')

            # Seed alerts
            alerts_col = self.db['alerts']
            if alerts_col.count_documents({}) == 0:
                seed_alerts = self.collections['alerts'].docs
                alerts_col.insert_many(seed_alerts)
                print('[Database] Seeded alerts')
                
            # Seed data source status
            status_col = self.db['data_source_status']
            if status_col.count_documents({}) == 0:
                seed_status = self.collections['data_source_status'].docs
                status_col.insert_many(seed_status)
                print('[Database] Seeded data_source_status')
        except Exception as e:
            print(f"[Database] Error seeding data: {e}")"""

old_str = '    def _ensure_seed_data_live(self):\n        """If connected to live MongoDB, insert seeds if collection is empty."""\n        pass'

text = text.replace(old_str, replacement)

with open('e:/FloodAI/BACKEND/app/database/mongodb.py', 'w', encoding='utf-8') as f:
    f.write(text)
