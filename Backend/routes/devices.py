from Backend import app
from Backend.routes.auth import login_required, session
from database.models import User
from database.models import Device
from flask import request, jsonify, json, make_response
from mongoengine.queryset.visitor import Q
import uuid
@login_required
@app.route('/devices', methods=['GET'])
def get_devices():
    user_id = session.get('user_id')
    user = User.objects(userId = user_id).first()
    if user:
        user_role = user.role
        user_location = user.location
        user_group = user.group
        user_username = user.username
        if user_role == "masteradmin":
            devices_returned = Device.objects()
        if user_role == "locationadmin":
            devices_returned = Device.objects(Q(location=user_location) | Q(sharedUsersId__in=user_username))
        if user_role == "admin":
            devices_returned = Device.objects(Q(location=user_location)& Q(group=user_group) | Q(sharedUsersId__in=user_username))
        if user_role == "user":
            devices_returned = Device.objects(Q(owner=user_username) | Q(sharedUsersId__in=user_username))
    return jsonify({"devices": devices_returned})

@login_required
@app.route('/edit-device', methods=['POST'])
def edit_device():
    device_data = request.get_json()
    device_id = device_data.get('deviceId')
    user_id = session.get('user_id')
    user = User.objects(userId = user_id).first()
    user_location = user.location
    user_group = user.group
    user_role = user.role
    error_message = ""
    owner_user = User.objects(username = device_data.get('owner')).first()
    if owner_user is None:
        error_message += "This username is not valid, please write a correct username"
    else:
        if user_role == "locationadmin":
            if owner_user.location != user_location:
                error_message += "You can only change the owner to a user from your own location."
        if user_role == "admin":
             if owner_user.location != user_location or owner_user.group != user_group:
                error_message += "You can only change the owner to a user from your own location and group."
    update_fields = {
        'owner': device_data.get('owner'),
        'location': device_data.get('location'),
        'group': device_data.get('group'),
        'name': device_data.get('name'),
        'type': device_data.get('type'),
        'model': device_data.get('model'),
        'ip': device_data.get('ip'),
        'sharedUsersId': device_data.get('sharedUsersId')
    }

    result = Device.objects(deviceId=device_id).update(**update_fields)

    if result:
        return jsonify({'message': 'Device updated successfully'})
    else:
        return jsonify({'message': 'Device not found or no changes made'})
    

@login_required
@app.route('/delete-device', methods=['POST'])
def delete_device():
    device_data = request.get_json()
    device_id = device_data.get('deviceId')

    if device_id is None:
        return jsonify({'message': 'Device ID is required'})

    device = Device.objects(deviceId=device_id).first()

    if device:
        device.delete()
        return jsonify({'message': 'Device deleted successfully'})
    else:
        return jsonify({'message': 'Device not found'})

@app.route('/add-device', methods=['POST'])
def add_device():
    data = request.get_json()
    name = data['name']
    location = data['location']
    group = data['group']
    owner = data['owner']
    model = data['model']
    ip = data['ip']
    type = data['type']

    shared_users_id = []
    error_message=""
    if Device.objects(Q(name=name)& Q(location=location)& Q(group=group)).first():
        error_message += 'Device Name already exists in location ' + location + 'and in group' + group + '.Please choose a different device name.\n'
    if Device.objects(Q(ip=ip)).first(): 
        error_message += 'IP already exists. Please choose a different IP.\n'
    if error_message != "":
        return {'message': error_message}
    device_id = str(uuid.uuid4())
    new_device = Device(
        deviceId=device_id,
        name=name,
        owner=owner,
        location=location,
        group=group,
        type=type,
        model=model,
        ip=ip,
        sharedUsersId=shared_users_id
    )
    new_device.save()
    return jsonify({'message': 'Device successfully added', 'deviceId': device_id})

@login_required
@app.route('/share-to-user', methods=['POST'])
def share_to_user():
    user_id = session.get('user_id')
    user = User.objects(userId = user_id).first()
    user_role = user.role
    user_location = user.location
    user_group = user.group
    data = request.get_json()
    shared_user_username = data.get('username')
    shared_device_id = data.get('device_id')
    
    shared_user = User.objects(Q(username=shared_user_username)).first()
    if user is None:
        return {'message': 'This username is not valid, please write a correct username'}
    if user_role == "locationadmin":
            if shared_user.location != user_location:
                return {'message': "You can only share the device to a user from your own location."}
    if user_role == "admin":
            if shared_user.location != user_location or shared_user.group != user_group:
                return {'message': "You can only share the device to a user from your own location and group."}
    shared_user_id = shared_user.userId
    device = Device.objects(Q(deviceId=shared_device_id)).first()
    if device:
        result = device.update(push__sharedUsersId=shared_user_id)
        if result:
            return jsonify({'message': 'Device shared successfully'})
        else:
            return jsonify({'message': 'Error when sharing the device'})
    else:
        return {'message': "Device not found"}
    

@login_required
@app.route('/unshare-from-user', methods=['POST'])
def unshare_from_user():
    user_id = session.get('user_id')
    user = User.objects(userId = user_id).first()
    user_role = user.role
    user_location = user.location
    user_group = user.group
    data = request.get_json()
    shared_user_username = data.get('username')
    shared_device_id = data.get('device_id')
    
    unshared_user = User.objects(Q(username=shared_user_username)).first()
    if user is None:
        return {'message': 'This username is not valid, please write a correct username'}
    if user_role == "locationadmin":
            if unshared_user.location != user_location:
                return {'message': "You can only unshare the device from a user from your own location."}
    if user_role == "admin":
            if unshared_user.location != user_location or unshared_user.group != user_group:
                return {'message': "You can only unshare the device from a user from your own location and group."}
    unshared_user_id = unshared_user.userId
    device = Device.objects(Q(deviceId=shared_device_id)).first()
    if device:
        result = device.update(pull__sharedUsersId=unshared_user_id)
        if result:
            return jsonify({'message': 'Device unshared successfully'})
        else:
            return jsonify({'message': 'Error when unsharing the device'})
    else:
        return {'message': "Device not found"}

    

    


