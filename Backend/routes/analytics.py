from Backend import app
from Backend.routes.auth import login_required, session
from database.models import User
from database.models import Device
from flask import Request, request, jsonify, json, make_response
from mongoengine.queryset.visitor import Q
import uuid

@login_required
@app.route('/analytics', methods=['GET'])
def get_analytics():
    user_id = session.get('user_id')
    user = User.objects(userId = user_id).first()
    locations = ["Bucharest", "Paris", "Berlin", "London", "Rome", "Budapest"]
    groups = ["Development","Network", "Human Resources", "Sales", "Management"]
    device_types = ["Mobile Phone", "Laptop", "Headphones", "Laboratory Engineer Device"]
    response = {}
    if user['role'] == "companyadmin":
        total_count_devices = Device.objects().count()
        response['deviceTypes'] = {}
        for device_type in device_types:
            response['deviceTypes'][device_type] = Device.objects.filter(Q(type=device_type)).count()
        response['location'] = {}
        for location in locations:
            response['location'][location] = Device.objects.filter(Q(location=location)).count()
        response['group'] = {}
        for group in groups:
            response['group'][group] = Device.objects.filter(Q(group=group)).count()
    if user['role'] == "locationadmin":
        total_count_devices = Device.objects.filter(Q(location=user['location'])).count()
        response['deviceTypes'] = {}
        for device_type in device_types:
            response['deviceTypes'][device_type] = Device.objects.filter(Q(type=device_type) & Q(location=user['location'])).count()
        response['group'] = {}
        for group in groups:
            response['group'][group] = Device.objects.filter(Q(group=group) & Q(location=user['location'])).count()
    if user['role'] == "admin":
        total_count_devices = Device.objects.filter(Q(location=user['location']) & Q(group=user['group'])).count()
        response['deviceTypes'] = {}
        for device_type in device_types:
            response['deviceTypes'][device_type] = Device.objects.filter(Q(type=device_type) & Q(location=user['location']) & Q(group=user['group'])).count()
    return {'response': response, 'total_count_devices': total_count_devices}
            
    
