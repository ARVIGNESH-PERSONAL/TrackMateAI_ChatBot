from db import get_db_connection

class LoginValidation_Service:
    def check_email_exists(self, email):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(1) FROM EmployeeRecord WHERE Email = ?", (email,))
        result = cursor.fetchone()
        conn.close()
        return result[0] > 0
    
    def verify_password(self, email, password):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(1) FROM EmployeeRecord WHERE Email = ? AND Password = ?", (email, password))
        result = cursor.fetchone()
        conn.close()
        return result[0] > 0
