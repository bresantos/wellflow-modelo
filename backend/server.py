from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.hash import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
SECRET_KEY = "wellflow_secret_key_2025"
ALGORITHM = "HS256"
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password: str
    role: str  # gestor ou funcionario
    full_name: str
    position: str
    sector: str
    photo: str
    age: int
    turno: str
    
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: Dict[str, Any]

class WeeklyForm(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    week: str
    responses: Dict[str, int]
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Environment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    temperature: float
    humidity: float
    air_quality: int
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    icon: str
    read: bool = False
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CorrectiveAction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    target_user_id: Optional[str] = None  # None = geral
    action: str
    description: str
    applied_by: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Auth functions
def create_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

# Initialize DB with sample data
@api_router.post("/init-db")
async def init_db():
    # Check if already initialized
    existing = await db.users.find_one({"username": "gestor"})
    if existing:
        return {"message": "Database already initialized"}
    
    # Create users
    users_data = [
        # Gestor
        {
            "id": "gestor-1",
            "username": "gestor",
            "password": bcrypt.hash("admin"),
            "role": "gestor",
            "full_name": "Marcos Silva",
            "position": "Gestor Operacional",
            "sector": "Gestão",
            "photo": "https://i.pravatar.cc/150?img=12",
            "age": 45,
            "turno": "Integral"
        },
        # Funcionarios
        {
            "id": "func-1",
            "username": "funcionario",
            "password": bcrypt.hash("admin"),
            "role": "funcionario",
            "full_name": "Ana Cai_1",
            "position": "Caixa",
            "sector": "Operacional",
            "photo": "https://i.pravatar.cc/150?img=1",
            "age": 33,
            "turno": "Tarde",
            "stress_personal": 2,
            "stress_professional": 2
        },
        {
            "id": "func-2",
            "username": "beatriz.cai",
            "password": bcrypt.hash("admin"),
            "role": "funcionario",
            "full_name": "Beatriz Cai_2",
            "position": "Caixa",
            "sector": "Operacional",
            "photo": "https://i.pravatar.cc/150?img=5",
            "age": 28,
            "turno": "Tarde",
            "stress_personal": 5,
            "stress_professional": 4
        },
        {
            "id": "func-3",
            "username": "carlos.cha",
            "password": bcrypt.hash("admin"),
            "role": "funcionario",
            "full_name": "Carlos Cha_1",
            "position": "Chapa",
            "sector": "Operacional",
            "photo": "https://i.pravatar.cc/150?img=13",
            "age": 40,
            "turno": "Manhã",
            "stress_personal": 2,
            "stress_professional": 3
        },
        {
            "id": "func-4",
            "username": "fernanda.cha2",
            "password": bcrypt.hash("admin"),
            "role": "funcionario",
            "full_name": "Fernanda Cha_2",
            "position": "Chapa",
            "sector": "Operacional",
            "photo": "https://i.pravatar.cc/150?img=9",
            "age": 35,
            "turno": "Noite",
            "stress_personal": 5,
            "stress_professional": 5
        },
        {
            "id": "func-5",
            "username": "fernanda.cha3",
            "password": bcrypt.hash("admin"),
            "role": "funcionario",
            "full_name": "Fernanda Cha_3",
            "position": "Chapa",
            "sector": "Operacional",
            "photo": "https://i.pravatar.cc/150?img=10",
            "age": 42,
            "turno": "Tarde",
            "stress_personal": 4,
            "stress_professional": 4
        },
        {
            "id": "func-6",
            "username": "juliana.mon",
            "password": bcrypt.hash("admin"),
            "role": "funcionario",
            "full_name": "Juliana Mon_1",
            "position": "Montagem de pedidos",
            "sector": "Operacional",
            "photo": "https://i.pravatar.cc/150?img=24",
            "age": 28,
            "turno": "Tarde",
            "stress_personal": 1,
            "stress_professional": 2
        },
        {
            "id": "func-7",
            "username": "ana.mon",
            "password": bcrypt.hash("admin"),
            "role": "funcionario",
            "full_name": "Ana Mon_2",
            "position": "Montagem de pedidos",
            "sector": "Operacional",
            "photo": "https://i.pravatar.cc/150?img=20",
            "age": 25,
            "turno": "Manhã",
            "stress_personal": 3,
            "stress_professional": 3
        },
        {
            "id": "func-8",
            "username": "lucas.sob",
            "password": bcrypt.hash("admin"),
            "role": "funcionario",
            "full_name": "Lucas Sob_1",
            "position": "Sobremesa",
            "sector": "Operacional",
            "photo": "https://i.pravatar.cc/150?img=15",
            "age": 39,
            "turno": "Manhã",
            "stress_personal": 1,
            "stress_professional": 1
        }
    ]
    
    await db.users.insert_many(users_data)
    
    # Create initial environment data
    env_data = {
        "id": str(uuid.uuid4()),
        "temperature": 23.5,
        "humidity": 65,
        "air_quality": 85,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.environment.insert_one(env_data)
    
    return {"message": "Database initialized successfully"}

# Auth endpoints
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user = await db.users.find_one({"username": request.username}, {"_id": 0})
    if not user or not bcrypt.verify(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    token = create_token({"user_id": user["id"], "role": user["role"]})
    user_data = {k: v for k, v in user.items() if k != "password"}
    
    return {"token": token, "user": user_data}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {k: v for k, v in current_user.items() if k != "password"}

# Employee endpoints
@api_router.get("/employees")
async def get_employees(current_user: dict = Depends(get_current_user)):
    employees = await db.users.find({"role": "funcionario"}, {"_id": 0, "password": 0}).to_list(1000)
    return employees

@api_router.get("/employees/{employee_id}")
async def get_employee(employee_id: str, current_user: dict = Depends(get_current_user)):
    employee = await db.users.find_one({"id": employee_id}, {"_id": 0, "password": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    
    # Get latest form responses
    forms = await db.weekly_forms.find({"user_id": employee_id}, {"_id": 0}).sort("timestamp", -1).limit(4).to_list(4)
    
    return {**employee, "recent_forms": forms}

# Forms endpoints
@api_router.post("/forms")
async def submit_form(form: WeeklyForm, current_user: dict = Depends(get_current_user)):
    form.user_id = current_user["id"]
    form_dict = form.model_dump()
    await db.weekly_forms.insert_one(form_dict)
    
    # Calculate stress levels and update user
    stress_personal = (form.responses.get("q1", 0) + form.responses.get("q2", 0) + form.responses.get("q3", 0)) / 3
    stress_professional = (form.responses.get("q4", 0) + form.responses.get("q5", 0) + form.responses.get("q6", 0) + form.responses.get("q7", 0)) / 4
    
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"stress_personal": stress_personal, "stress_professional": stress_professional}}
    )
    
    # Create notification for user
    notif = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "title": "Formulário Enviado",
        "description": "Seu formulário semanal foi enviado com sucesso",
        "icon": "check",
        "read": False,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.notifications.insert_one(notif)
    
    return {"message": "Formulário enviado com sucesso"}

@api_router.get("/forms/my-forms")
async def get_my_forms(current_user: dict = Depends(get_current_user)):
    forms = await db.weekly_forms.find({"user_id": current_user["id"]}, {"_id": 0}).sort("timestamp", -1).to_list(10)
    return forms

# Environment endpoints
@api_router.get("/environment")
async def get_environment():
    env = await db.environment.find_one({}, {"_id": 0}, sort=[("timestamp", -1)])
    if not env:
        # Return mock data
        return {
            "temperature": 23.5,
            "humidity": 65,
            "air_quality": 85
        }
    return env

# IMPORTANTE: Para integrar sensores IoT Arduino:
# 1. Configure seu Arduino com sensores DHT22 (temperatura/umidade) e MQ-135 (qualidade do ar)
# 2. Use o código abaixo no Arduino para enviar dados via HTTP POST:
#
# #include <ESP8266WiFi.h>
# #include <ESP8266HTTPClient.h>
# #include <DHT.h>
#
# const char* ssid = "SEU_WIFI";
# const char* password = "SUA_SENHA";
# const char* serverUrl = "http://SEU_BACKEND_URL/api/environment";
#
# DHT dht(D4, DHT22);
# int mq135Pin = A0;
#
# void setup() {
#   WiFi.begin(ssid, password);
#   dht.begin();
# }
#
# void loop() {
#   float temp = dht.readTemperature();
#   float humidity = dht.readHumidity();
#   int airQuality = map(analogRead(mq135Pin), 0, 1024, 0, 100);
#
#   HTTPClient http;
#   http.begin(serverUrl);
#   http.addHeader("Content-Type", "application/json");
#   String payload = "{\"temperature\":" + String(temp) + ",\"humidity\":" + String(humidity) + ",\"air_quality\":" + String(airQuality) + "}";
#   http.POST(payload);
#   http.end();
#
#   delay(60000); // Envia a cada 1 minuto
# }

@api_router.post("/environment")
async def update_environment(env: Environment, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "gestor":
        raise HTTPException(status_code=403, detail="Apenas gestores podem atualizar o ambiente")
    
    env_dict = env.model_dump()
    await db.environment.insert_one(env_dict)
    
    # Notify all users
    users = await db.users.find({"role": "funcionario"}, {"_id": 0}).to_list(1000)
    notifications = []
    for user in users:
        notif = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "title": "Ambiente Atualizado",
            "description": f"Temperatura: {env.temperature}°C, Umidade: {env.humidity}%, Qualidade do ar: {env.air_quality}%",
            "icon": "wind",
            "read": False,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        notifications.append(notif)
    
    if notifications:
        await db.notifications.insert_many(notifications)
    
    return {"message": "Ambiente atualizado"}

# Notifications endpoints
@api_router.get("/notifications")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    notifs = await db.notifications.find({"user_id": current_user["id"]}, {"_id": 0}).sort("timestamp", -1).limit(20).to_list(20)
    return notifs

@api_router.put("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, current_user: dict = Depends(get_current_user)):
    await db.notifications.update_one({"id": notif_id, "user_id": current_user["id"]}, {"$set": {"read": True}})
    return {"message": "Notificação marcada como lida"}

# Corrective actions endpoints
@api_router.post("/actions")
async def create_action(action: CorrectiveAction, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "gestor":
        raise HTTPException(status_code=403, detail="Apenas gestores podem criar ações")
    
    action.applied_by = current_user["id"]
    action_dict = action.model_dump()
    await db.corrective_actions.insert_one(action_dict)
    
    # Create notifications
    if action.target_user_id:
        # Individual action
        notif = {
            "id": str(uuid.uuid4()),
            "user_id": action.target_user_id,
            "title": "Ação Corretiva Aplicada",
            "description": f"Gestor aplicou: {action.action}",
            "icon": "alert-circle",
            "read": False,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.notifications.insert_one(notif)
    else:
        # General action - notify all
        users = await db.users.find({"role": "funcionario"}, {"_id": 0}).to_list(1000)
        notifications = []
        for user in users:
            notif = {
                "id": str(uuid.uuid4()),
                "user_id": user["id"],
                "title": "Ação Corretiva Geral",
                "description": f"Gestor aplicou: {action.action}",
                "icon": "alert-circle",
                "read": False,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            notifications.append(notif)
        if notifications:
            await db.notifications.insert_many(notifications)
    
    return {"message": "Ação criada com sucesso"}

@api_router.get("/actions")
async def get_actions(current_user: dict = Depends(get_current_user)):
    actions = await db.corrective_actions.find({}, {"_id": 0}).sort("timestamp", -1).limit(20).to_list(20)
    return actions

# Stats for charts
@api_router.get("/stats/employee-stress")
async def get_employee_stress(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "gestor":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    employees = await db.users.find({"role": "funcionario"}, {"_id": 0}).to_list(1000)
    return [{"name": e["full_name"], "professional": e.get("stress_professional", 0), "personal": e.get("stress_personal", 0)} for e in employees]

@api_router.get("/stats/team-average")
async def get_team_average(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "gestor":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    employees = await db.users.find({"role": "funcionario"}, {"_id": 0}).to_list(1000)
    if not employees:
        return {"professional": 0, "personal": 0}
    
    avg_prof = sum(e.get("stress_professional", 0) for e in employees) / len(employees)
    avg_pers = sum(e.get("stress_personal", 0) for e in employees) / len(employees)
    
    return {"professional": round(avg_prof, 1), "personal": round(avg_pers, 1)}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
