import re

with open('e:/FloodAI/BACKEND/app/routes/auth.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('db_manager.get_collection("users")', 'db_manager.get_collection("flood_users")')

text = text.replace(
    'user_safe = {k: v for k, v in user.items() if k != "password"}',
    'user["_id"] = str(user.get("_id", "")) \n    user_safe = {k: v for k, v in user.items() if k != "password"}'
)

text = text.replace(
    '        return user\n    except jwt.PyJWTError:',
    '        user["_id"] = str(user.get("_id", ""))\n        return user\n    except jwt.PyJWTError:'
)

with open('e:/FloodAI/BACKEND/app/routes/auth.py', 'w', encoding='utf-8') as f:
    f.write(text)
