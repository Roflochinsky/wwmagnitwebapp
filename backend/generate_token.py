"""
Скрипт для генерации token.json для Google Drive API.
Скрипт выведет ссылку — откройте её ВРУЧНУЮ в нужном профиле браузера.
"""

from google_auth_oauthlib.flow import InstalledAppFlow
import json

SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
]

flow = InstalledAppFlow.from_client_secrets_file('client_secrets.json', SCOPES)

# НЕ открываем браузер автоматически
print('\n' + '='*60)
print('СКОПИРУЙТЕ ЭТУ ССЫЛКУ И ОТКРОЙТЕ В НУЖНОМ ПРОФИЛЕ БРАУЗЕРА:')
print('='*60 + '\n')

creds = flow.run_local_server(port=8080, open_browser=False)

token_data = {
    'token': creds.token,
    'refresh_token': creds.refresh_token,
    'token_uri': creds.token_uri,
    'client_id': creds.client_id,
    'client_secret': creds.client_secret,
    'scopes': list(creds.scopes)
}

with open('token.json', 'w') as f:
    json.dump(token_data, f, indent=2)

print('\n✅ token.json успешно создан!')
print('Теперь загрузите его на сервер в папку ~/wwmagnitwebapp/backend/')

