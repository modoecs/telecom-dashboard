#!/usr/bin/env bash
# Render build script
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Seed only on first deploy (seed_data wipes existing rows)
if [ "$(python manage.py shell -c 'from providers.models import Provider; print(Provider.objects.exists())')" = "False" ]; then
    python manage.py seed_data
fi
