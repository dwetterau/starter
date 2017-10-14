import os
from django.db import connection

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "starter.settings")

cursor = connection.cursor()
tables = connection.introspection.table_names()

cursor.execute("ALTER DATABASE starter CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;")

for table in tables:
    print("Fixing table: %s" % table)
    sql = "ALTER TABLE %s CONVERT TO CHARACTER SET utf8mb4;" % table
    cursor.execute(sql)
    print("Table %s set to utf8" % table)

