from flask import render_template
from flask import Flask, request
import dbAPI

app = Flask(__name__)


## Use the code below for Flask

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/game')
# def game():
#     return render_template('webgame.html')

# @app.route('/myBestScore')
# def myBestScore():
#     return render_template('myBestScore.html')

# @app.route('/leaderboard')
# def leaderboard():
#     return render_template('leaderboard.html')

# @app.route('/gamerules')
# def gamerules():
#     return render_template('gamerules.html')

# @app.route('/settings')
# def settings():
#     return render_template('settings.html')


## Database part

#dbName = 'teamSix.db' # Store my local scores
#dbAPI.create(dbName)

# @app.route('/add_score', methods=['POST'])
# def add_score():
#     # Add score to myScore table

if __name__ == '__main__':
    app.run(debug=True)
