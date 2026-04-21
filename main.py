# # # import argparse
# # # from datetime import datetime
# # # from pathlib import Path
# # # import sys
# # # import base64
# # # from typing import Dict, List, Optional
# # # from collections import OrderedDict
# # # from fastapi import FastAPI
# # # from fdb import Connection, Cursor, connect
# # # from pydantic import BaseModel
# # # from fastapi.middleware.cors import CORSMiddleware
# # # import uvicorn


# # # if getattr(sys, "frozen", False):
# # #     BASE_DIR = Path(sys.executable).parent
# # # else:
# # #     BASE_DIR = Path(__file__).parent


# # # parser = argparse.ArgumentParser(description="Users API Server")
# # # parser.add_argument("--port", type=int, default=8000, help="Порт для запуска сервера")
# # # parser.add_argument(
# # #     "--db-path",
# # #     type=str,
# # #     help="Путь к файлу базы данных",
# # #     default=BASE_DIR / "Global.fdb",
# # # )
# # # parser.add_argument("--db-host", type=str, default="localhost", help="Хост базы данных")
# # # args = parser.parse_args()


# # # app = FastAPI(title="Users API", version="1.0")

# # # # Настройка CORS
# # # app.add_middleware(
# # #     CORSMiddleware,
# # #     allow_origins=["*"],
# # #     allow_credentials=True,
# # #     allow_methods=["*"],
# # #     allow_headers=["*"],
# # # )


# # # class UserResponse(BaseModel):
# # #     num: int
# # #     username: str
# # #     act_date: Optional[datetime]
# # #     photo: Optional[str]
# # #     job_title: str


# # # class GroupedUsersResponse(BaseModel):
# # #     users: Dict[str, List[UserResponse]]


# # # def binary_to_base64(binary_data) -> Optional[str]:
# # #     """Преобразует бинарные данные в base64 строку"""
# # #     if binary_data is None:
# # #         return None
# # #     try:
# # #         if isinstance(binary_data, bytes):
# # #             return base64.b64encode(binary_data).decode("utf-8")
# # #         elif isinstance(binary_data, str):
# # #             try:
# # #                 base64.b64decode(binary_data)
# # #                 return binary_data
# # #             except:
# # #                 return base64.b64encode(binary_data.encode("latin-1")).decode("utf-8")
# # #         return None
# # #     except Exception as e:
# # #         print(f"Error converting photo to base64: {e}")
# # #         return None


# # # def get_connection() -> Connection:
# # #     conn: Connection = connect(
# # #         host=args.db_host,
# # #         user="sysdba",
# # #         password="masterkey",
# # #         sql_dialect=1,
# # #         charset="WIN1251",
# # #         database=args.db_path,
# # #     )

# # #     return conn


# # # prop_name = "Должность"

# # # conn = get_connection()
# # # if not conn:
# # #     sys.exit(1)

# # # cur: Cursor = conn.cursor()
# # # prop_id: int | None = cur.execute(
# # #     f"SELECT ID FROM USER_PROP_TYPES WHERE PROP_NAME = '{prop_name}'"
# # # ).fetchone()
# # # if not prop_id:
# # #     prop_id = cur.execute("SELECT count(*) FROM USER_PROP_TYPES").fetchone()[0] + 1
# # #     cur.execute(
# # #         f"INSERT INTO USER_PROP_TYPES (ID, PROP_NAME) VALUES({prop_id}, '{prop_name}')"
# # #     )
# # #     conn.commit()
# # # else:
# # #     prop_id = prop_id[0]

# # # conn.close()


# # # def get_users() -> List[dict]:
# # #     """Получает пользователей с группировкой"""
# # #     conn = get_connection()
# # #     cur: Cursor = conn.cursor()

# # #     # cur.execute(
# # #     #     """
# # #     #     SELECT
# # #     #         u.NUM,
# # #     #         u.USERNAME,
# # #     #         do.ACT_DATE,
# # #     #         u.PHOTO,
# # #     #         COALESCE(g.GROUPNAME, 'Без группы') as GROUP_NAME
# # #     #     FROM users u
# # #     #     LEFT JOIN D_OWNERS do ON u.num = do.USER_REF
# # #     #     LEFT JOIN GROUPS g ON u.USERGROUP = g.NUM
# # #     #     ORDER BY GROUP_NAME, u.USERNAME
# # #     # """
# # #     # )

# # #     cur.execute(
# # #         f"""
# # #         SELECT
# # #             u.NUM,
# # #             u.USERNAME,
# # #             do.ACT_DATE,
# # #             u.PHOTO,
# # #             COALESCE(g.GROUPNAME, 'Без группы') AS GROUP_NAME,
# # #             COALESCE(up.prop_value, '') AS JOB_TITLE
# # #         FROM users u
# # #         LEFT JOIN D_OWNERS do ON u.num = do.USER_REF
# # #         LEFT JOIN GROUPS g ON u.USERGROUP = g.NUM
# # #         LEFT JOIN user_props up
# # #             ON up.user_num = u.num
# # #         AND up.prop_id = {prop_id}
# # #         ORDER BY GROUP_NAME, u.USERNAME
# # #     """
# # #     )

# # #     rows = cur.fetchall()
# # #     conn.close()

# # #     result = []
# # #     for row in rows:
# # #         try:
# # #             num, username, act_date, photo, group_name = row
# # #         except ValueError:
# # #             num = row[0]
# # #             username = row[1]
# # #             act_date = row[2]
# # #             photo = row[3]
# # #             group_name = row[4]
# # #             job_title = row[5]

# # #         result.append(
# # #             {
# # #                 "num": num,
# # #                 "username": username,
# # #                 "act_date": act_date,
# # #                 "photo": binary_to_base64(photo),
# # #                 "group_name": group_name if group_name else "Без группы",
# # #                 "job_title": job_title,
# # #             }
# # #         )

# # #     return result


# # # @app.get("/users", response_model=GroupedUsersResponse)
# # # async def get_grouped_users():
# # #     users = get_users()

# # #     grouped = OrderedDict()
# # #     for user in users:
# # #         group_name = user.pop("group_name")
# # #         if group_name not in grouped:
# # #             grouped[group_name] = []

# # #         grouped[group_name].append(UserResponse(**user))

# # #     return {"users": grouped}


# # # if __name__ == "__main__":
# # #     print(f"Запуск сервера на порту {args.port}")
# # #     print(f"База данных: {args.db_path}")
# # #     print(f"Хост базы: {args.db_host}")

# # #     uvicorn.run(
# # #         app,
# # #         host="0.0.0.0",
# # #         port=args.port,
# # #         log_level="info",
# # #     )

# # import argparse
# # from datetime import datetime
# # import sys
# # import base64
# # from typing import Dict, List, Optional
# # from collections import OrderedDict
# # from fdb import Connection, Cursor, connect
# # from pydantic import BaseModel


# # parser = argparse.ArgumentParser(description="Users API Server")
# # parser.add_argument(
# #     "--db-path",
# #     type=str,
# #     help="Путь к файлу базы данных",
# # )
# # parser.add_argument("--db-host", type=str, default="localhost", help="Хост базы данных")
# # args = parser.parse_args()


# # class UserResponse(BaseModel):
# #     num: int
# #     username: str
# #     act_date: Optional[datetime]
# #     photo: Optional[str]
# #     job_title: str


# # class GroupedUsersResponse(BaseModel):
# #     users: Dict[str, List[UserResponse]]


# # def binary_to_base64(binary_data) -> Optional[str]:
# #     """Преобразует бинарные данные в base64 строку"""
# #     if binary_data is None:
# #         return None
# #     try:
# #         if isinstance(binary_data, bytes):
# #             return base64.b64encode(binary_data).decode("utf-8")
# #         elif isinstance(binary_data, str):
# #             try:
# #                 base64.b64decode(binary_data)
# #                 return binary_data
# #             except:
# #                 return base64.b64encode(binary_data.encode("latin-1")).decode("utf-8")
# #         return None
# #     except Exception as e:
# #         print(f"Error converting photo to base64: {e}")
# #         return None


# # def get_connection() -> Connection:
# #     conn: Connection = connect(
# #         host=args.db_host,
# #         user="sysdba",
# #         password="masterkey",
# #         sql_dialect=1,
# #         charset="WIN1251",
# #         database=args.db_path,
# #     )

# #     return conn


# # prop_name = "Должность"

# # conn = get_connection()
# # if not conn:
# #     sys.exit(1)

# # cur: Cursor = conn.cursor()
# # prop_id: int | None = cur.execute(
# #     f"SELECT ID FROM USER_PROP_TYPES WHERE PROP_NAME = '{prop_name}'"
# # ).fetchone()
# # if not prop_id:
# #     prop_id = cur.execute("SELECT count(*) FROM USER_PROP_TYPES").fetchone()[0] + 1
# #     cur.execute(
# #         f"INSERT INTO USER_PROP_TYPES (ID, PROP_NAME) VALUES({prop_id}, '{prop_name}')"
# #     )
# #     conn.commit()
# # else:
# #     prop_id = prop_id[0]

# # conn.close()


# # def get_users() -> List[dict]:
# #     """Получает пользователей с группировкой"""
# #     conn = get_connection()
# #     cur: Cursor = conn.cursor()

# #     cur.execute(
# #         f"""
# #         SELECT
# #             u.NUM,
# #             u.USERNAME,
# #             do.ACT_DATE,
# #             u.PHOTO,
# #             COALESCE(g.GROUPNAME, 'Без группы') AS GROUP_NAME,
# #             COALESCE(up.prop_value, '') AS JOB_TITLE
# #         FROM users u
# #         LEFT JOIN D_OWNERS do ON u.num = do.USER_REF
# #         LEFT JOIN GROUPS g ON u.USERGROUP = g.NUM
# #         LEFT JOIN user_props up
# #             ON up.user_num = u.num
# #         AND up.prop_id = {prop_id}
# #         ORDER BY GROUP_NAME, u.USERNAME
# #     """
# #     )

# #     rows = cur.fetchall()
# #     conn.close()

# #     result = []
# #     for row in rows:
# #         try:
# #             num, username, act_date, photo, group_name = row
# #         except ValueError:
# #             num = row[0]
# #             username = row[1]
# #             act_date = row[2]
# #             photo = row[3]
# #             group_name = row[4]
# #             job_title = row[5]

# #         result.append(
# #             {
# #                 "num": num,
# #                 "username": username,
# #                 "act_date": act_date,
# #                 "photo": binary_to_base64(photo),
# #                 "group_name": group_name if group_name else "Без группы",
# #                 "job_title": job_title,
# #             }
# #         )

# #     return result


# # async def get_grouped_users():
# #     users = get_users()

# #     grouped = OrderedDict()
# #     for user in users:
# #         group_name = user.pop("group_name")
# #         if group_name not in grouped:
# #             grouped[group_name] = []

# #         grouped[group_name].append(UserResponse(**user))

# #     return {"users": grouped}


# # if __name__ == "__main__":
# #     print(get_users())

# import argparse
# from datetime import datetime
# import sys
# import json
# import base64
# from typing import Dict, List, Optional
# from collections import OrderedDict
# from fdb import Connection, Cursor, connect


# def binary_to_base64(binary_data) -> Optional[str]:
#     """Преобразует бинарные данные в base64 строку"""
#     if binary_data is None:
#         return None
#     try:
#         if isinstance(binary_data, bytes):
#             return base64.b64encode(binary_data).decode("utf-8")
#         elif isinstance(binary_data, str):
#             try:
#                 base64.b64decode(binary_data)
#                 return binary_data
#             except:
#                 return base64.b64encode(binary_data.encode("latin-1")).decode("utf-8")
#         return None
#     except Exception as e:
#         print(f"Error converting photo to base64: {e}", file=sys.stderr)
#         return None


# def get_connection(db_path: str, db_host: str = "localhost") -> Connection:
#     """Создает подключение к базе данных"""
#     try:
#         conn: Connection = connect(
#             host=db_host,
#             user="sysdba",
#             password="masterkey",
#             sql_dialect=1,
#             charset="WIN1251",
#             database=db_path,
#         )
#         return conn
#     except Exception as e:
#         print(f"Error connecting to database: {e}", file=sys.stderr)
#         sys.exit(1)


# def init_prop_id(conn: Connection) -> int:
#     """Инициализирует ID для свойства 'Должность'"""
#     prop_name = "Должность"
#     cur: Cursor = conn.cursor()

#     # Проверяем существует ли свойство
#     result = cur.execute(
#         f"SELECT ID FROM USER_PROP_TYPES WHERE PROP_NAME = '{prop_name}'"
#     ).fetchone()

#     if not result:
#         # Создаем новое свойство
#         count_result = cur.execute("SELECT count(*) FROM USER_PROP_TYPES").fetchone()
#         prop_id = count_result[0] + 1 if count_result else 1
#         cur.execute(
#             f"INSERT INTO USER_PROP_TYPES (ID, PROP_NAME) VALUES({prop_id}, '{prop_name}')"
#         )
#         conn.commit()
#         return prop_id
#     else:
#         return result[0]


# def get_users(db_path: str, db_host: str = "localhost") -> List[dict]:
#     """Получает пользователей с группировкой"""
#     conn = get_connection(db_path, db_host)
#     prop_id = init_prop_id(conn)
#     cur: Cursor = conn.cursor()

#     cur.execute(
#         f"""
#         SELECT
#             u.NUM,
#             u.USERNAME,
#             do.ACT_DATE,
#             u.PHOTO,
#             COALESCE(g.GROUPNAME, 'Без группы') AS GROUP_NAME,
#             COALESCE(up.prop_value, '') AS JOB_TITLE
#         FROM users u
#         LEFT JOIN D_OWNERS do ON u.num = do.USER_REF
#         LEFT JOIN GROUPS g ON u.USERGROUP = g.NUM
#         LEFT JOIN user_props up
#             ON up.user_num = u.num
#         AND up.prop_id = {prop_id}
#         ORDER BY GROUP_NAME, u.USERNAME
#         """
#     )

#     rows = cur.fetchall()
#     conn.close()

#     result = []
#     for row in rows:
#         num = row[0]
#         username = row[1]
#         act_date = row[2]
#         photo = row[3]
#         group_name = row[4]
#         job_title = row[5] if len(row) > 5 else ""

#         # Преобразуем datetime в строку для JSON
#         if act_date:
#             act_date = (
#                 act_date.isoformat()
#                 if hasattr(act_date, "isoformat")
#                 else str(act_date)
#             )

#         result.append(
#             {
#                 "num": num,
#                 "username": username,
#                 "act_date": act_date,
#                 "photo": binary_to_base64(photo),
#                 "group_name": group_name if group_name else "Без группы",
#                 "job_title": job_title,
#             }
#         )

#     return result


# def group_users(users: List[dict]) -> Dict[str, List[dict]]:
#     """Группирует пользователей по группам"""
#     grouped = OrderedDict()
#     for user in users:
#         group_name = user.pop("group_name")
#         if group_name not in grouped:
#             grouped[group_name] = []
#         grouped[group_name].append(user)
#     return grouped


# def main():
#     parser = argparse.ArgumentParser(description="Users Database CLI")
#     subparsers = parser.add_subparsers(dest="command", help="Commands")

#     # Команда db-path
#     db_path_parser = subparsers.add_parser("db-path", help="Get users from database")
#     db_path_parser.add_argument("db_path", type=str, help="Path to database file")
#     db_path_parser.add_argument(
#         "--db-host", type=str, default="localhost", help="Database host"
#     )

#     # Команда hello (для тестирования)
#     hello_parser = subparsers.add_parser("hello", help="Test command")
#     hello_parser.add_argument("message", type=str, help="Message to print")

#     args = parser.parse_args()

#     if args.command == "db-path":
#         try:
#             users = get_users(args.db_path, args.db_host)
#             grouped_users = group_users(users)

#             # Выводим результат в stdout как JSON
#             print(json.dumps(grouped_users, ensure_ascii=False, indent=2))

#         except Exception as e:
#             print(f"Error: {e}", file=sys.stderr)
#             sys.exit(1)

#     elif args.command == "hello":
#         print(f"Hello {args.message}!")

#     else:
#         print("Unknown command. Use 'db-path' or 'hello'", file=sys.stderr)
#         sys.exit(1)


# if __name__ == "__main__":
#     main()

import argparse
from datetime import datetime
import sys
import json
import base64
from typing import Dict, List, Optional
from collections import OrderedDict

# Принудительно устанавливаем UTF-8 для stdout/stderr
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

try:
    from fdb import Connection, Cursor, connect
except ImportError as e:
    print(f"Error importing fdb: {e}", file=sys.stderr)
    sys.exit(1)


def clean_string(s: str) -> str:
    """Очищает строку от невалидных UTF-8 символов"""
    if s is None:
        return ""
    if isinstance(s, bytes):
        try:
            return s.decode("utf-8", errors="replace")
        except:
            try:
                return s.decode("cp1251", errors="replace")
            except:
                return str(s)
    return str(s).encode("utf-8", errors="replace").decode("utf-8")


def binary_to_base64(binary_data) -> Optional[str]:
    """Преобразует бинарные данные в base64 строку"""
    if binary_data is None:
        return None
    try:
        if isinstance(binary_data, bytes):
            return base64.b64encode(binary_data).decode("ascii")
        elif isinstance(binary_data, str):
            try:
                base64.b64decode(binary_data)
                return binary_data
            except:
                return base64.b64encode(binary_data.encode("latin-1")).decode("ascii")
        return None
    except Exception as e:
        print(f"Error converting photo to base64: {e}", file=sys.stderr)
        return None


def get_connection(db_path: str, db_host: str = "localhost"):
    """Создает подключение к базе данных"""
    try:
        conn = connect(
            host=db_host,
            user="sysdba",
            password="masterkey",
            sql_dialect=1,
            charset="WIN1251",  # Используем WIN1251 для базы
            database=db_path,
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}", file=sys.stderr)
        sys.exit(1)


def init_user_prop_id(conn, prop_name: str) -> int:
    """Инициализирует ID для пользовательского свойства по имени"""
    cur = conn.cursor()

    try:
        result = cur.execute(
            f"SELECT ID FROM USER_PROP_TYPES WHERE PROP_NAME = '{prop_name}'"
        ).fetchone()

        if not result:
            count_result = cur.execute(
                "SELECT count(*) FROM USER_PROP_TYPES"
            ).fetchone()
            prop_id = count_result[0] + 1 if count_result else 1
            cur.execute(
                f"INSERT INTO USER_PROP_TYPES (ID, PROP_NAME) VALUES({prop_id}, '{prop_name}')"
            )
            conn.commit()
            return prop_id
        else:
            return result[0]
    except Exception as e:
        print(f"Error in init_user_prop_id ({prop_name}): {e}", file=sys.stderr)
        # Пробуем создать таблицу если её нет
        try:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS USER_PROP_TYPES (
                    ID INTEGER PRIMARY KEY,
                    PROP_NAME VARCHAR(100)
                )
            """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS USER_PROPS (
                    USER_NUM INTEGER,
                    PROP_ID INTEGER,
                    PROP_VALUE VARCHAR(255)
                )
            """
            )
            conn.commit()
            return init_user_prop_id(conn, prop_name)
        except:
            return 1


def get_users(db_path: str, db_host: str = "localhost") -> List[dict]:
    """Получает пользователей с группировкой"""
    conn = get_connection(db_path, db_host)
    job_title_prop_id = init_user_prop_id(conn, "Должность")
    department_prop_id = init_user_prop_id(conn, "Отдел")
    cur = conn.cursor()

    try:
        cur.execute(
            f"""
            SELECT
                u.NUM,
                u.USERNAME,
                do.ACT_DATE,
                u.PHOTO,
                COALESCE(g.GROUPNAME, 'Без группы') AS GROUP_NAME,
                COALESCE(job_up.prop_value, '') AS JOB_TITLE,
                COALESCE(dept_up.prop_value, '') AS DEPARTMENT
            FROM users u
            LEFT JOIN D_OWNERS do ON u.num = do.USER_REF
            LEFT JOIN GROUPS g ON u.USERGROUP = g.NUM
            LEFT JOIN user_props job_up
                ON job_up.user_num = u.num
            AND job_up.prop_id = {job_title_prop_id}
            LEFT JOIN user_props dept_up
                ON dept_up.user_num = u.num
            AND dept_up.prop_id = {department_prop_id}
            ORDER BY GROUP_NAME, u.USERNAME
            """
        )

        rows = cur.fetchall()
        conn.close()

        result = []
        for row in rows:
            try:
                num = row[0]
                username = clean_string(row[1])  # Очищаем строку
                act_date = row[2]
                photo = row[3]
                group_name = clean_string(row[4] if row[4] else "Без группы")
                job_title = clean_string(row[5] if len(row) > 5 else "")
                department = clean_string(row[6] if len(row) > 6 else "")

                # Преобразуем дату
                if act_date and hasattr(act_date, "isoformat"):
                    act_date = act_date.isoformat()
                elif act_date:
                    act_date = str(act_date)

                result.append(
                    {
                        "num": num,
                        "username": username,
                        "act_date": act_date,
                        "photo": binary_to_base64(photo),
                        "group_name": group_name,
                        "job_title": job_title,
                        "department": department,
                    }
                )
            except Exception as e:
                print(f"Error processing row: {e}", file=sys.stderr)
                continue

        return result

    except Exception as e:
        print(f"Error in get_users: {e}", file=sys.stderr)
        conn.close()
        return []


def group_users(users: List[dict]) -> Dict[str, List[dict]]:
    """Группирует пользователей по группам"""
    grouped = OrderedDict()
    for user in users:
        group_name = user.pop("group_name", "Без группы")
        if group_name not in grouped:
            grouped[group_name] = []
        grouped[group_name].append(user)
    return grouped


def main():
    parser = argparse.ArgumentParser(description="Users Database CLI")
    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Команда db-path
    db_path_parser = subparsers.add_parser("db-path", help="Get users from database")
    db_path_parser.add_argument("db_path", type=str, help="Path to database file")
    db_path_parser.add_argument(
        "--db-host", type=str, default="localhost", help="Database host"
    )

    # Команда hello (для тестирования)
    # hello_parser = subparsers.add_parser("hello", help="Test command")
    # hello_parser.add_argument("message", type=str, help="Message to print")

    args = parser.parse_args()

    if args.command == "db-path":
        try:
            users = get_users(args.db_path, args.db_host)

            if not users:
                print(json.dumps({"error": "No users found"}, ensure_ascii=False))
                return

            grouped_users = group_users(users)

            # Выводим результат в stdout как JSON с ensure_ascii=False для поддержки русских букв
            output = json.dumps(grouped_users, ensure_ascii=False, indent=2)

            # Дополнительно проверяем что вывод валидный UTF-8
            output_bytes = output.encode("utf-8", errors="replace")
            sys.stdout.buffer.write(output_bytes)
            sys.stdout.buffer.flush()

        except Exception as e:
            error_msg = {"error": clean_string(str(e))}
            error_json = json.dumps(error_msg, ensure_ascii=False)
            sys.stderr.buffer.write(error_json.encode("utf-8", errors="replace"))
            sys.stderr.buffer.flush()
            sys.exit(1)

    # elif args.command == "hello":
    #     message = clean_string(args.message)
    #     output = f"Hello {message}!"
    #     sys.stdout.buffer.write(output.encode("utf-8"))
    #     sys.stdout.buffer.flush()

    else:
        # error_msg = "Unknown command. Use 'db-path' or 'hello'"
        error_msg = "Unknown command. Use 'db-path'"
        sys.stderr.buffer.write(error_msg.encode("utf-8"))
        sys.stderr.buffer.flush()
        sys.exit(1)


if __name__ == "__main__":
    main()
