FROM python:3.10.2-slim

COPY requirements.txt /

RUN pip3 install --upgrade pip

RUN pip3 install -r /requirements.txt

COPY . /webapp

WORKDIR /webapp

EXPOSE 8888

ENV PYTHONPATH "${PYTHONPATH}:/webapp/src"

CMD ["gunicorn", "--config", "gunicorn_config.py", "src.app:app"]
