

from flask import session, request, jsonify, json, make_response
from Backend import app
from mongoengine.queryset.visitor import Q
import uuid
from Backend.database.models import User
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import base64
key = b'Sixteen byte key'  
iv = b'Sixteen byte IV.'   

def encrypt_password(password: str) -> str:
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_password = padder.update(password.encode('utf-8')) + padder.finalize()

   
    encrypted_password = encryptor.update(padded_password) + encryptor.finalize()

    
    return base64.urlsafe_b64encode(encrypted_password).decode('utf-8')

def decrypt_password(encrypted_password: str) -> str:
    
    encrypted_password_bytes = base64.urlsafe_b64decode(encrypted_password.encode('utf-8'))

    
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    
    padded_password = decryptor.update(encrypted_password_bytes) + decryptor.finalize()

    
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    password = unpadder.update(padded_password) + unpadder.finalize()

    return password.decode('utf-8')


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
        encrypted_password = encrypt_password(password)
        if user.password == encrypted_password:
            session['user_id'] = user.userId
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
    encrypted_password = encrypt_password(password)
    location = data['location']
    group = data['group']
    role = data['role']
    existing_user = User.objects(username=username).first()
    if existing_user:
        return jsonify({'message': 'Username already exists. Please choose a different username.'})
    user_id = str(uuid.uuid4())
    new_user = User(
        username=username,
        password=encrypted_password,
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

