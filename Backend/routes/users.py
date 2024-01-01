from Backend import app
from Backend.routes.auth import login_required, session
from database.models import User
from flask import request, jsonify, json, make_response
from mongoengine.queryset.visitor import Q
@login_required
@app.route('/users', methods=['GET'])
def get_users():
    user_id = session.get('user_id')
    print(user_id)
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
