import re

with open('e:/FloodAI/BACKEND/app/database/mongodb.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix timeout
text = text.replace('serverSelectionTimeoutMS=1200', 'serverSelectionTimeoutMS=5000')

# 2. Add ensure_seed_data_live call
text = text.replace(
    'print(f"[Database] Successfully connected to live MongoDB at {settings.MONGODB_URI}")',
    'print(f"[Database] Successfully connected to live MongoDB at {settings.MONGODB_URI}")\n            self._ensure_seed_data_live()'
)

# 3. Rewrite ensure_seed_data_live
replacement = """    def _ensure_seed_data_live(self):
        \"\"\"If connected to live MongoDB, insert seeds if collection is empty.\"\"\"
        if not self.is_connected or self.db is None:
            return
            
        self._init_memory_store()
        try:
            safe_zones_col = self.db['safe_zones']
            if safe_zones_col.count_documents({}) == 0 and len(self.collections['safe_zones'].docs) > 0:
                safe_zones_col.insert_many(self.collections['safe_zones'].docs)
                print('[Database] Seeded safe_zones')

            alerts_col = self.db['alerts']
            if alerts_col.count_documents({}) == 0 and len(self.collections['alerts'].docs) > 0:
                alerts_col.insert_many(self.collections['alerts'].docs)
                print('[Database] Seeded alerts')
                
            status_col = self.db['data_source_status']
            if status_col.count_documents({}) == 0 and len(self.collections['data_source_status'].docs) > 0:
                status_col.insert_many(self.collections['data_source_status'].docs)
                print('[Database] Seeded data_source_status')
                
            self.collections = {}
        except Exception as e:
            print(f"[Database] Error seeding data: {e}")"""

old_str = '    def _ensure_seed_data_live(self):\n        """If connected to live MongoDB, insert seeds if collection is empty."""\n        pass'
text = text.replace(old_str, replacement)

with open('e:/FloodAI/BACKEND/app/database/mongodb.py', 'w', encoding='utf-8') as f:
    f.write(text)
