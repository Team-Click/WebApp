from flask import Flask, request, jsonify, render_template
from flask_mysqldb import MySQL
import bcrypt

app = Flask(
    __name__,
    static_folder='../../static',
    template_folder='../../templates'
)

# 데이터베이스 설정
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'sejongclick'
app.config['MYSQL_PASSWORD'] = 'click0308!'
app.config['MYSQL_DB'] = 'sejongclick'

mysql = MySQL(app)

@app.route('/')
def index():
    return render_template('SignUp.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    student_id = data.get('studentId')
    name = data.get('name')
    password = data.get('password')

    # 비밀번호 해싱
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        cursor = mysql.connection.cursor()
        query = """
            INSERT INTO Student (student_id, name, password)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (student_id, name, hashed_password.decode('utf-8')))
        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True})
    except Exception as e:
        print("Error:", e)
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
