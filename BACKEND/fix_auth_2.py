import re

with open('e:/FloodAI/BACKEND/app/routes/auth.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix get_current_user to query by email instead of _id since _id could be ObjectId or string
text = text.replace(
    'user = users.find_one({"_id": user_id})',
    'user = users.find_one({"email": payload.get("email")})'
)

with open('e:/FloodAI/BACKEND/app/routes/auth.py', 'w', encoding='utf-8') as f:
    f.write(text)

with open('e:/FloodAI/BACKEND/app/routes/user.py', 'r', encoding='utf-8') as f:
    text_user = f.read()

text_user = text_user.replace('db_manager.get_collection("users")', 'db_manager.get_collection("flood_users")')

with open('e:/FloodAI/BACKEND/app/routes/user.py', 'w', encoding='utf-8') as f:
    f.write(text_user)
