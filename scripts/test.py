from dateutil.parser import parse
from datetime import datetime, timezone

get_date_obj = parse("2023-01-27T12:00:01.089Z")

test = datetime.now() - get_date_obj.replace(tzinfo=None)

print(test.days)
