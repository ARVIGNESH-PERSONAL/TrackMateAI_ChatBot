# db.py
import pyodbc

def get_db_connection():
    connection = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=337-8DN6YQ2-20\SQLEXPRESS;'  # change to your SQL server
        'DATABASE=TrackMateAI_Chatbot;'
        'UID=NB;'
        'PWD=1234'
    )
    return connection
