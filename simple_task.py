from celery import Celery

celery = Celery("simple_task", broker="redis://localhost:6379/1", backend="redis://localhost:6379/2")

@celery.task()
def add(x, y):
    return x + y

if __name__ == "__main__":
    result = add.delay(4, 6)
    print(f"Task result: {result.get(timeout=10)}")
