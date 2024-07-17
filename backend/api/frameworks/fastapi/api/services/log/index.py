import logging
from datetime import datetime
import os
import colorlog
import pytz

LOGGER_PATH_INFO = 'temp/logs/info_logs.log'
LOGGER_PATH_ERROR = 'temp/logs/error_logs.log'
LOGGER_PATH = 'temp/logs'
AMERICA_SAO_PAULO_TZ = pytz.timezone('America/Sao_Paulo')
HORA_ATUAL_BRASILIA = datetime.now(
    tz=AMERICA_SAO_PAULO_TZ).strftime('%Y-%m-%d %H:%M:%S')


class Logger:
    def __init__(self, context='Log', level=logging.INFO):
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(level)

        handler = logging.StreamHandler()
        color_formatter = colorlog.ColoredFormatter(
            "%(log_color)s%(message)s",
            log_colors={
                'DEBUG': 'cyan',
                'INFO': 'green',
                'WARNING': 'yellow',
                'ERROR': 'red',
                'CRITICAL': 'red,bg_white',
            },
        )
        handler.setFormatter(color_formatter)

        if not self.logger.handlers:
            self.logger.addHandler(handler)

        self.context = context

    def _log(self, level, message):
        timestamp = HORA_ATUAL_BRASILIA
        full_message = f"[{timestamp}]-[HVK-API:{self.context}] {message}. "

        if level == "info":
            message_log = f"INFO:     {full_message}"
            self.logger.info(message_log)
            self.armazena_todos_logs(message_log)
        elif level == "error":
            message_log = f"ERROR:    {full_message}"
            self.logger.error(message_log)
            self.armazena_todos_logs(message_log)
            self.armazena_error_log(message_log)
        elif level == "warning":
            message_log = f"WARNING:  {full_message}"
            self.logger.warning(message_log)
            self.armazena_todos_logs(message_log)

    def info(self, message):
        self._log("info", message)

    def error(self, message):
        self._log("error", message)

    def warning(self, message):
        self._log("warning", message)

    def armazena_todos_logs(self, log):
        """
        Armazena todos os logs em um arquivo localizado em db/logs/logs.txt
        o arquivo de log deve ter no máximo 10MB caso contrário será criado um novo arquivo
        """
        try:
            text = log
            # adicionar uma quebra de linha no final do log
            if not text.endswith('\n'):
                text += '\n'
            # se o arquivo não existir cria um novo
            if not os.path.exists(LOGGER_PATH):
                os.makedirs(LOGGER_PATH)
            if not os.path.exists(LOGGER_PATH_INFO):
                open(LOGGER_PATH_INFO, 'w').close()
            # se o arquivo tiver mais de 10MB cria um novo
            if os.path.getsize(LOGGER_PATH_INFO) > 10000000:
                open(LOGGER_PATH_INFO, 'w').close()
            # abre o arquivo e escreve o log
            with open(LOGGER_PATH_INFO, 'a') as file:
                file.write(text)
        except Exception as e:
            print(e)
            pass

    def armazena_error_log(self, log):
        """
        Armazena todos os logs em um arquivo localizado em db/logs/logs.txt
        o arquivo de log deve ter no máximo 10MB caso contrário será criado um novo arquivo
        """
        try:
            text = log

            # adicionar uma quebra de linha no final do log
            if not text.endswith('\n'):
                text += '\n'
            # se o arquivo não existir cria um novo
            if not os.path.exists(LOGGER_PATH):
                os.makedirs(LOGGER_PATH)
            if not os.path.exists(LOGGER_PATH_ERROR):
                open(LOGGER_PATH_ERROR, 'w').close()
            # se o arquivo tiver mais de 10MB cria um novo
            if os.path.getsize(LOGGER_PATH_ERROR) > 10000000:
                open(LOGGER_PATH_ERROR, 'w').close()
            # abre o arquivo e escreve o log
            with open(LOGGER_PATH_ERROR, 'a') as file:
                file.write(text)
        except Exception as e:
            print(e)
            pass
