

from api.router.index import Routes


app = Routes().starting()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
