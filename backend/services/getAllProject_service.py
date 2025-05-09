from db import get_db_connection

class GetAllProjectService:
    def getAll_projects_by_email(self, email):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT ProjectName FROM EmployeeProject WHERE Email = ?", (email,))
        rows = cursor.fetchall()
        conn.close()
        return [row[0] for row in rows]
