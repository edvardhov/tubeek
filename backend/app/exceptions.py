from fastapi import HTTPException

from app.schemas import ErrorCode


class TubeekError(HTTPException):
    def __init__(
        self,
        status_code: int,
        code: ErrorCode,
        message: str,
        detail: str | None = None,
    ) -> None:
        super().__init__(
            status_code=status_code,
            detail={"code": code, "message": message, "detail": detail},
        )
        self.code = code
        self.message = message
