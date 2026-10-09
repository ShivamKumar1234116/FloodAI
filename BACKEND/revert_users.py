import re

with open('e:/FloodAI/BACKEND/app/routes/auth.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Change flood_users back to users
text = text.replace('db_manager.get_collection("flood_users")', 'db_manager.get_collection("users")')

# Add a unique username field to bypass the unique index requirement of their users collection
if '"username":' not in text:
    text = text.replace(
        '"name": req.name,',
        '"name": req.name,\n        "username": req.email.lower() + "_" + str(uuid.uuid4())[:8],'
    )

with open('e:/FloodAI/BACKEND/app/routes/auth.py', 'w', encoding='utf-8') as f:
    f.write(text)

with open('e:/FloodAI/BACKEND/app/routes/user.py', 'r', encoding='utf-8') as f:
    text_user = f.read()

# Change flood_users back to users
text_user = text_user.replace('db_manager.get_collection("flood_users")', 'db_manager.get_collection("users")')

with open('e:/FloodAI/BACKEND/app/routes/user.py', 'w', encoding='utf-8') as f:
    f.write(text_user)
