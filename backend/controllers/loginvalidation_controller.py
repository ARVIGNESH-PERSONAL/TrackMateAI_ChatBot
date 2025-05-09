from flask import Blueprint, request, jsonify
from services.loginvalidation_service import LoginValidation_Service

email_service = LoginValidation_Service()

loginvalidation_controller = Blueprint('loginvalidation_controller', __name__)

@loginvalidation_controller.route('/api/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    exists = email_service.check_email_exists(email)
    return jsonify({'exists': exists})

@loginvalidation_controller.route("/api/verify-password", methods=["POST"])
def verify_password():
    data = request.get_json()  # Use get_json() for consistency
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Verify password using the service
    is_valid = email_service.verify_password(email, password)
    
    return jsonify({"valid": is_valid})