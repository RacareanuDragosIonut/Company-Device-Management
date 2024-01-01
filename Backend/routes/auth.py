

from flask import session, request, jsonify, json, make_response
from Backend import app
from mongoengine.queryset.visitor import Q
import uuid
from Backend.database.models import User
session = {}
def login_required(view_func):
    def wrapper(*args, **kwargs):
        if 'user_id' in session:
            return view_func(*args, **kwargs)

    return wrapper

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    if not username or not password:
        return jsonify({'message': 'Invalid input data'})

    user = User.objects(username=username).first()
    if user:
        if user.password == password:
            session['user_id'] = user.userId
            print("user_id is" + session.get('user_id'))
            return jsonify({'message': 'Successful Login', 'user': user})
        else:
            return jsonify({'message': 'Invalid password'})
    else:
        return jsonify({'message': 'Invalid user'})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    password = data['password']
    location = data['location']
    group = data['group']
    role = data['role']
    existing_user = User.objects(username=username).first()
    if existing_user:
        return jsonify({'message': 'Username already exists. Please choose a different username.'})
    user_id = str(uuid.uuid4())
    new_user = User(
        username=username,
        password=password,
        location=location,
        group=group,
        role=role,
        userId=user_id
    )
    new_user.save()
    return jsonify({'message': 'User successfully registered', 'userId': user_id})

@login_required
@app.route('/logout', methods=['POST'])
def logout():
    try:
        session.pop('user_id', None)
        return jsonify({'message': "User successfully logged out"})
    except Exception as e:
        return jsonify({'message': "Exception" + e})

