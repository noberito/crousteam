import json
from datetime import datetime
from pathlib import Path

# Fonction pour convertir les objets datetime en chaînes ISO 8601
def datetime_converter(o):
    for i in o:
        if isinstance(i, datetime):
            i = i.isoformat()


def get_image_path(filename):
    # log.debug(filename)
    # Get the path of the image file
    file_name = Path(filename)
    if file_name.exists():
        return filename, 200
    # file_path = filename
    # Check if the file exists
    # if os.path.exists(file_path):
    # Return the file path

    else:
        return "File not found", 404

print(get_image_path("/home/mobapp/crousteam/back-end/0e31eb6d-32f3-4066-b3ff-7a70e7b05d98.text"))