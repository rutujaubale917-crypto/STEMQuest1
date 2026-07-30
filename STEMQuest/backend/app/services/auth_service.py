from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from beanie import PydanticObjectId

from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin, Token, UserResponse
from app.config import settings


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="api/auth/login"
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class AuthService:

    @staticmethod
    def verify_password(
        plain_password: str,
        hashed_password: str
    ) -> bool:
        return pwd_context.verify(
            plain_password,
            hashed_password
        )

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def create_access_token(
        data: dict,
        expires_delta: Optional[timedelta] = None
    ) -> str:

        to_encode = data.copy()

        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )

        to_encode.update({"exp": expire})

        return jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )

    @staticmethod
    async def get_current_user_dep(
        token: str = Depends(oauth2_scheme)
    ):
        service = AuthService()
        return await service.get_current_user(token)

    async def register(
        self,
        user_data: UserCreate
    ) -> Token:

        existing_user = await User.find_one(
            {"email": user_data.email}
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        hashed_password = self.get_password_hash(
            user_data.password
        )

        user = User(
            username=user_data.email,
            email=user_data.email,
            password=hashed_password,
            full_name=user_data.name,
            role=user_data.role or "student"
        )

        await user.insert()

        access_token = self.create_access_token(
            {
                "sub": str(user.id),
                "email": user.email
            }
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=str(user.id),
                name=user.full_name or user.username or "",
                email=user.email,
                role=user.role or "student",
                avatar=user.avatar or "",
                bio=user.bio or "",
                enrolled_courses=user.enrolled_courses or [],
                completed_courses=user.completed_courses or [],
                points=user.points or 0,
                achievements=user.achievements or [],
                created_at=user.created_at
            )
        )

    async def login(
        self,
        user_data: UserLogin
    ) -> Token:

        user = await User.find_one(
            {"email": user_data.email}
        )

        if not user or not self.verify_password(
            user_data.password,
            user.password
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        access_token = self.create_access_token(
            {
                "sub": str(user.id),
                "email": user.email
            }
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=str(user.id),
                name=user.full_name or user.username or "",
                email=user.email,
                role=user.role or "student",
                avatar=user.avatar or "",
                bio=user.bio or "",
                enrolled_courses=user.enrolled_courses or [],
                completed_courses=user.completed_courses or [],
                points=user.points or 0,
                achievements=user.achievements or [],
                created_at=user.created_at
            )
        )

    async def get_current_user(
        self,
        token: str
    ) -> User:

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )

            user_id = payload.get("sub")

            if not user_id:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid token"
                )

        except JWTError:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        user = await User.get(
            PydanticObjectId(user_id)
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return user

    async def change_password(
        self,
        user: User,
        password_data
    ):

        if not self.verify_password(
            password_data.current_password,
            user.password
        ):
            raise HTTPException(
                status_code=400,
                detail="Current password incorrect"
            )

        user.password = self.get_password_hash(
            password_data.new_password
        )

        await user.save()

        return True