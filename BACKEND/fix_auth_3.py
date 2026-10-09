import re

with open('e:/FloodAI/BACKEND/app/routes/auth.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Make sure uuid is imported
if 'import uuid' not in text:
    text = text.replace('import datetime', 'import datetime\nimport uuid')

# Explicitly set _id to a string UUID so MongoDB saves it as a string instead of ObjectId
if 'user_doc["_id"] = str(uuid.uuid4())' not in text:
    text = text.replace(
        'res = users.insert_one(user_doc)',
        'user_doc["_id"] = str(uuid.uuid4())\n    res = users.insert_one(user_doc)'
    )

with open('e:/FloodAI/BACKEND/app/routes/auth.py', 'w', encoding='utf-8') as f:
    f.write(text)
