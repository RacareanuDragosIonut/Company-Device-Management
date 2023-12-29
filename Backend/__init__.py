from flask import Flask
from .database.db import initialize_db
from flask_cors import CORS
from flask_login import LoginManager

app = Flask("__name__")
initialize_db(app)
CORS(app)
from .routes.users import app
from .routes.devices import app
from .routes.auth import app
from .routes.device_set import app