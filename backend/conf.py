import os


debug = os.path.exists('DEBUG')

host = '0.0.0.0' if debug else 'localhost'
port = 5000 if debug else 4431
