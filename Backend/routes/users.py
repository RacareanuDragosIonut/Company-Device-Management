from Backend import app
from Backend.routes.auth import login_required, session
from database.models import User
from flask import request, jsonify, json, make_response
from mongoengine.queryset.visitor import Q
@login_required
@app.route('/users', methods=['GET'])
def get_users():
    user_id = session.get('user_id')
    user = User.objects(userId = user_id).first()
    if user:
        user_role = user.role
        user_location = user.location
        user_group = user.group
        user_username = user.username
        if user_role == "masteradmin":
            users_returned = User.objects(Q(username__ne=user_username))
        if user_role == "locationadmin":
            accepted_roles = ['locationadmin', 'admin', 'user']
            users_returned = User.objects(Q(role__in=accepted_roles)& Q(location=user_location) & Q(username__ne=user_username))
        if user_role == "admin":
            accepted_roles = ['admin', 'user']
            users_returned = User.objects(Q(role__in=accepted_roles)& Q(location=user_location)& Q(group=user_group) & Q(username__ne=user_username))
    return jsonify({"users": users_returned})

@login_required
@app.route('/edit-user', methods=['POST'])
def edit_user():
    user_data = request.get_json()
    user_id = user_data.get('userId')
    
    if user_id is None:
        user_id = session.get('user_id')

    update_fields = {
        'role': user_data.get('role'),
        'location': user_data.get('location'),
        'group': user_data.get('group'),
        'username': user_data.get('username')
    }

    result = User.objects(userId=user_id).update(**update_fields)

    if result:
        return jsonify({'message': 'User updated successfully'})
    else:
        return jsonify({'message': 'User not found or no changes made'})


@login_required
@app.route('/change-password', methods=['POST'])
def change_password():
    user_data = request.get_json()
    print(user_data)
    user_id = session.get('user_id')
    original_password = user_data.get('originalPassword')
    new_password = user_data.get('newPassword')
    confirm_new_password = user_data.get('confirmNewPassword')
    user = User.objects(Q(userId=user_id) & Q(password=original_password))
    if not user:
        return jsonify({'message': 'The old password is not correct'})
    if new_password != confirm_new_password:
        return jsonify({'message': 'The passwords of the last 2 inputs should be identical'})
    if original_password == new_password:
        return jsonify({'message': 'The new password should be different that the old password'})
    
    result = User.objects(userId=user_id).update(**{'password': new_password})

    if result:
        return jsonify({'message': 'Password updated successfully'})
    else:
        return jsonify({'message': 'User not found or no changes made'})
    
@login_required
@app.route('/delete-user', methods=['POST'])
def delete_user():
    user_data = request.get_json()
    user_id = user_data.get('userId')

    if user_id is None:
        return jsonify({'message': 'User ID is required'})

    user = User.objects(userId=user_id).first()

    if user:
        user.delete()
        return jsonify({'message': 'User deleted successfully'})
    else:
        return jsonify({'message': 'User not found'})
    
@login_required
@app.route('/get-username/<id>', methods=['GET'])
def get_username(id):
    if id is None:
        return jsonify({'message': 'User ID is required'})

    user = User.objects(userId=id).first()
    if user:
        username = user.username
        return jsonify({'message': 'Username retrived successfully', 'username': username})
    else:
        return jsonify({'message': 'User not found'})

        
    
