# db.py
import pyodbc

def get_db_connection():
    connection = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-P71LOJV\\SQLEXPRESS;'  # change to your SQL server
        'DATABASE=TrackMateAI_Chatbot;'
        'UID=AR;'
        'PWD=utis12345*'
    )
    return connection
