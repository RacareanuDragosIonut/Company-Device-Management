
from bson.objectid import ObjectId
from mongoengine import *
from enum import unique
from .db import db 

class Device(db.Document):
    deviceId = db.StringField(Required=True, unique=True)
    owner = db.StringField(Required=True)
    location = db.StringField(Required=True)
    group = db.StringField(Required=True)
    name = db.StringField(Required=True)
    type = db.StringField(Required=True)
    model = db.StringField(Required=True)
    ip = db.StringField(Required=True)
    productionDate = db.StringField(Required=True)
    returnDate = db.StringField(Required=True)
    sharedUsersId = db.ListField()

class User(db.Document):
    userId = db.StringField(Required=True)
    username = db.StringField(Required=True, unique=True)
    password = db.StringField(Required=True)
    location = db.StringField(Required=True)
    group = db.StringField(Required=True)
    role = db.StringField(Required=True)


