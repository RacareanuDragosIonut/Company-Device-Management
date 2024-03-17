from flask import Flask
from .database.db import initialize_db
from flask_cors import CORS
from flask_login import LoginManager
from mongoengine import connect
from env import secret_key
app = Flask("__name__")
app.secret_key = secret_key
app.config['MONGODB_SETTINGS'] = {
    'db': 'company',  
    'host': 'mongodb://localhost:27017/company',  
}
app.config['DEBUG'] = True
initialize_db(app)

CORS(app)
from .routes.users import app
from .routes.devices import app
from .routes.auth import app
from .routes.analytics import app