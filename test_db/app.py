import json
from pymongo import MongoClient

# MongoDB 클라이언트 연결
client = MongoClient("mongodb+srv://ss82727390:kljbyTp2b70zP8TR@cluster0.1b5o5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

# 데이터베이스 및 컬렉션 선택
db = client.OurTime
user_collection = db.User
timetable_collection = db.timetable

# JSON 파일 이름을 기반으로 ID 생성
file_name = "WebApp/asset/json/22011925_권효정.json"
object_id = file_name.split("_")[0]  # 학번 추출

# 외부 JSON 파일 읽기
with open(file_name, "r", encoding="utf-8") as file:
    data = json.load(file)  # JSON 파일 내용을 Python 딕셔너리로 변환

# info 데이터를 User 컬렉션에 삽입 (학번을 ID로 사용하고, 비밀번호로 설정)
user_info = {
    "_id": object_id,  # 학번을 ID로 사용
    "ID": data["info"]["name"],
    "PW": data["info"]["number"]
}
user_collection.insert_one(user_info)

# schedule 데이터를 timetable 컬렉션에 삽입 (학번을 ID로 사용하고, 전체 스케줄을 배열로 저장)
timetable_data = {
    "_id": object_id,  # 학번을 ID로 사용
    "schedule": data["schedule"]
}
timetable_collection.insert_one(timetable_data)

# 삽입된 데이터 확인
print("\nUser 컬렉션의 데이터:")
for document in user_collection.find():
    print(document)

print("\ntimetable 컬렉션의 데이터:")
for document in timetable_collection.find():
    print(document)
