FROM python:latest

RUN pip install chromadb

EXPOSE 443

CMD ["chroma", "run", \
     "--port", "443", \
     "--host", "https://monorepo-production-33c8.up.railway.app"]
