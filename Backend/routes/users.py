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
        if user_role == "masteradmin":
            users_returned = User.objects()
        if user_role == "locationadmin":
            accepted_roles = ['locationadmin', 'admin', 'user']
            users_returned = User.objects(Q(role__in=accepted_roles)& Q(location=user_location))
        if user_role == "admin":
            accepted_roles = ['admin', 'user']
            users_returned = User.objects(Q(role__in=accepted_roles)& Q(location=user_location)& Q(group=user_group))
    return jsonify({"users": users_returned})

@login_required
@app.route('/edit-user', methods=['POST'])
def edit_user():
    user_data = request.get_json()
    user_id = user_data.get('userId')

    if user_id is None:
        return jsonify({'message': 'User ID is required'})

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
        
    
