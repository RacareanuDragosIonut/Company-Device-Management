

from flask import request, jsonify, json, make_response
from Backend import app
from mongoengine.queryset.visitor import Q
import uuid

from Backend.database.models import User
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    if not username or not password:
        return jsonify({'message': 'Invalid input data'}), 400

    user = User.objects(username=username).first()
    if user:
        
        if user.password == password:
            return jsonify({'message': 'Successful Login'}), 200
        else:
            return jsonify({'message': 'Invalid password'}), 401
    else:
        return jsonify({'message': 'Invalid user'}), 401
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    password = data['password']