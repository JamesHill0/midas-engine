from dateutil.parser import parse
from datetime import datetime, timezone

parsed_date = parse('01/01/1955')

formatted_date = parsed_date.strftime('%Y-%m-%d')

print(str(formatted_date))
