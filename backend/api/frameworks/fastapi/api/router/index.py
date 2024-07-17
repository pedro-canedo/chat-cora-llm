

from logging import Logger

from api.server.index import Api
from api.controller.index import router


logger = Logger('ROUTES')


class Routes:
    def __init__(self):
        self.app = Api().get_app()

    def get_routes(self):
        return [
            router,
        ]

    def origins_allowed(self):
        return self.app.middleware.origins_allowed()

    def add_routes(self, routes: list):
        for router in routes:
            self.app.include_router(router)

    def starting(self):
        try:
            logger.info('STARTING ROUTES')
            self.add_routes(self.get_routes())
            logger.info('ROUTES STARTED')
            return self.app
        except Exception as e:
            logger.error('ERROR STARTING ROUTES')
            logger.error(e)
            raise e
