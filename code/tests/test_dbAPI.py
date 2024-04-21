
"""
These are the unit tests for the datasbase API used in the Team Six Project 
Last Modifeied: 4/20/2024 By: Patrick Sharp
"""


# Imports
import sqlite3
from datetime import datetime
import unittest
import os
import sys

# Add the project's root directory to sys.path 
# (This is the only working way I have to grab the dbAPI file, If you know a better way feel free to change)
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)
import dbAPI


# Global Variables
db_filename = 'testDB'


class dbAPITestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        pass

    @classmethod
    def tearDownClass(cls):
        pass

    # Setup by making the db and tables and filling them
    def setUp(self):
        global db_filename
        dbAPI.create(db_filename)

    # Remove the db file
    def tearDown(self):
        try:
            global db_filename
            os.remove(db_filename)
        except:
            print("Error deleting test database")
            
            
            
            
    """
    This test checks for input errors in the database filename, starting off with ValueTypeErrors
    This test also checks that the function works as intended
    Author(s): Patrick Sharp
    Last Modified: 3/15/2024
    """
    def test_create(self):
        
        global db_filename
        
        # Test to check for a valid db_filename data types
        invalid_db_filename_data_types = [
            None,
            '',
            7,
            3.14,
            ['db_filename'],
            {'db_filename':0}
        ]
        
        for dataType in invalid_db_filename_data_types:
            with self.assertRaises(ValueError, msg="The database file name given is not a valid option"):
                dbAPI.create(dataType)
            
        # Test the function returns sucsessfully when given a valid db_filename
        assert (dbAPI.create(db_filename)) == 0, "The create() function failed (did not return a value of 0)"
        
        # Testing the table creation in the global test database
        conn = sqlite3.connect(db_filename)
        c = conn.cursor()
        c.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = c.fetchall()
        
        # Check that the needed tables are created and named properly
        assert tables[0][0] == "Players", "The create() function did not make a Players table"
        assert tables[1][0] == "Scores", "The create() function did not make Scores table"
        assert tables[2][0] == "Games", "The create() function did not make a Games table"
    
    
    
    
    
    """
    This test checks for input errors in the database filename, playerId, and/or score. 
    This test also checks that the function works as intended
    Author(s): Patrick Sharp
    Last Modified: 3/29/2024
    """
    def test_addScore(self):
        
        global db_filename
        playerID = 1
        playerName = 'ABC'
        score = 420
        
        # Grab the date that should be appened to the Scores table from the call above YYYY-MM-DD format
        date = str(datetime.now())
        date = date[0:10] 
        
        # Test to check for a valid db_filename data types
        invalid_db_filename_data_types = [
            None,
            '',
            7,
            3.14,
            ['db_filename'],
            {'db_filename':0}
        ]
        
        for dataType in invalid_db_filename_data_types:
            with self.assertRaises(ValueError, msg="The database file name given is not a valid option: {}".format(dataType)):
                dbAPI.addScore(dataType, playerID, playerName, score)
            
        # Test tocheck that the playerID is a valid data type (int > 0)
        invalid_playerIDs = [
            None,
            '',
            'playerID',
            3.14,
            ['playerID'],
            [1],
            0,
            -1,
            {'playerID':1}
        ]
        
        for dataType in invalid_playerIDs:
            with self.assertRaises(ValueError, msg="The playerID given is not a valid option: {}".format(dataType)):
                dbAPI.addScore(db_filename, dataType, playerName, score)
                
                
        # Test tocheck that the playerName is a valid data type len() == 3
        invalid_playerName_types = [
            None,
            'ABCD',
            '',
            7,
            3.14,
            ['ABC'],
            {'ABC':0}
        ]
        
        for dataType in invalid_playerName_types:
            with self.assertRaises(ValueError, msg="The playerName given is not a valid option: {}".format(dataType)):
                dbAPI.addScore(db_filename, playerID, dataType, score)
            
        # Test to check that the score is a valid data type (int > 0)
        # NOTE: MIGHT WANT TO STORE A SCORE OF ZERO SO REMOVE THAT IF THAT"S THE CASE
        invalid_score = [
            None,
            '',
            '777',
            0,
            -1,
            [777],
            {'score':7777},
            (777)
        ]
        
        for dataType in invalid_playerIDs:
            with self.assertRaises(ValueError, msg="The score given is not a valid option: {}".format(dataType)):
                dbAPI.addScore(db_filename, playerID, playerName, dataType)
                
        
        # Test the function returns sucsessfully when given a valid db_filename
        assert (dbAPI.addScore(db_filename, playerID, playerName, score)) == 0, "The addScore() function failed (did not return a value of 0)"
        
        
        # Testing if the addScores function used above inserted the supplied values to the Scores table
        conn = sqlite3.connect(db_filename)
        c = conn.cursor()
        c.execute("SELECT * FROM Scores;")
        tables = c.fetchall()
        
        assert tables[-1][0] == 1, "The addScores() function did not append the values to the Scores table with the supplied playerID"
        assert tables[-1][1] == 'ABC', "The addScores() function did not append the playerName to the Scores table with the supplied playerName"
        assert tables[-1][2] == 420, "The addScores() function did not append the values to the Scores table with the supplied score"
        assert tables[-1][3] == date, "The addScores() function did not append the values to the Scores table with the supplied date"      

        
        
    """
    This test checks for input errors in the playerName and/or playerEmail in the addPlayer() function. 
    This test also checks that the function works as intended
    Author(s): Patrick Sharp
    Last Modified: 3/16/202
    """       
    def test_addPlayer(self):
        
        global db_filename
        playerName = 'ABC'
        playerEmail = 'test@gmail.com'
        
        # Grab the date that should be appened to the Scores table from the call above YYYY-MM-DD format
        date = str(datetime.now())
        date = date[0:10] 
        
        # Test to check for a valid playerName data types and inputs (str w/ len() == 3)
        # NOTE: MIGHT NEED TO CHANGE THIS TEST TO CHECK FOR VALID CHARACTERS IN NAME ONCE ESTABLISHED
        invalid_playerName_types = [
            None,
            'ABCD',
            '',
            7,
            3.14,
            ['ABC'],
            {'ABC':0}
        ]
        
        for dataType in invalid_playerName_types:
            with self.assertRaises(ValueError, msg="The player name given is not a valid option: {}".format(dataType)):
                dbAPI.addPlayer(db_filename,dataType,playerEmail)
        
        
        # Test to check for a valid playerEmail data types and inputs (valid email)
        invalid_playerEmail_types = [
            None,
            'ABCD',
            'TestEmailGmail.com',
            'user@invalid-tld.123',
            'user#domain.com',
            'user#domain.con',
            'user&name@email-provider.net',
            'spaced user@domain.info',
            'double..dots@email.org',
            '@.com',
            'user@domain with space.com',
            'user@domain..com',
            '',
            7,
            3.14,
            ['test@gmail.com'],
            {'test@gmail.com':0},
            ('test@gmail.com')
        ]
        
        for dataType in invalid_playerName_types:
            with self.assertRaises(ValueError, msg="The player email given is not a valid option: {}".format(dataType)):
                dbAPI.addPlayer(db_filename,playerName,dataType)
                
        # Test the function returns sucsessfully when given a valid db_filename
        assert (dbAPI.addPlayer(db_filename,playerName, playerEmail)) == 0, "The addPlayer() function failed (did not return a value of 0)"
        
        
        # Testing if the addScores function used above inserted the supplied values to the Scores table
        conn = sqlite3.connect(db_filename)
        c = conn.cursor()
        c.execute("SELECT * FROM Players;")
        tables = c.fetchall()
        assert tables[-1][0] == len(tables), "The addPlayer() function did not append the values to the Players table with the supplied playerID"
        assert tables[-1][1] == playerName, "The addPlayer() function did not append the values to the Players table with the supplied player name"
        assert tables[-1][2] == date, "The addPlayer() function did not append the values to the Players table with the current date"  
        assert tables[-1][3] == playerEmail, "The addPlayer() function did not append the values to the Players table with the supplied Email"
                

    
    """
    This test checks for errors in the in the getTopTenScores() function. 
    This test also checks that the function works as intended
    Author(s): Patrick Sharp
    Last Modified: 3/29/202
    """
    def test_getTopTenScores(self):
        
        # Info to insert into the Scores table to query for the test 
        global db_filename
        playerID = 2
        playerName = 'TST'
        scores = [
            1,
            777,
            84,
            354325,
            8554,
            74658899,
            8534,
            5,
            321,
            543,
            6,
            5345,
            64311234,
            667654,
            5432,
            333,
            246523,
            3
        ]
        
        # Add the scores to the table
        for score in scores:
            dbAPI.addScore(db_filename, playerID, playerName, score)
        
        # Sort the scores using the python sort function to ease the assert comparrisons
        scores.sort()
        
        #Grab the score from the function
        topTen = dbAPI.getTopTenScores(db_filename)
        
        #check that the top ten scores are given in descending order
        assert topTen[0][2] == scores[-1]
        assert topTen[1][2] == scores[-2]
        assert topTen[2][2] == scores[-3]
        assert topTen[3][2] == scores[-4]
        assert topTen[4][2] == scores[-5]
        assert topTen[5][2] == scores[-6]
        assert topTen[6][2] == scores[-7]
        assert topTen[7][2] == scores[-8]
        assert topTen[8][2] == scores[-9]
        assert topTen[9][2] == scores[-10]
    
    
    """
    This test checks for errors in the in the getTopTenPersonalScores() function. 
    This test also checks that the function works as intended
    Author(s): Patrick Sharp
    Last Modified: 4/20/202
    """
    def test_getTopTenPersonalScores(self):
        
        global db_filename
        
        # Define the first player and their scores
        playerID_1 = 3
        playerName_1 = 'WRG'
        playerOneScores = [
            345,
            573245,
            354637,
            2425566,
            6542,
            6777854,
            745678,
            14566,
            7888456,
            5463546,
            765474765,
            6543773,
            34567888756,
            6543,
            536774,
            5636773
        ]
        
        # insert scores
        for score in playerOneScores:
            dbAPI.addScore(db_filename, playerID_1, playerName_1, score)
        
        # Define the second player and their scores
        playerID_2 = 4
        playerName_2 = 'CRT'
        playerTwoScores= [
            1325324,
            5243662,
            74356,
            654367788,
            6345656,
            24566,
            26554367,
            75436645,
            6543777,
            645377773,
            523666655642,
            4254266,
            52435666,
            6543234,
            2453652,
            5342,
            54326462
        ]
        
        # insert scores
        for score in playerTwoScores:
            dbAPI.addScore(db_filename, playerID_2, playerName_2, score)
        
        # Define the third player and their scores
        playerID_3 = 5
        playerName_3 = "WNG"
        playerThreeScores = [
            42345,
            5234,
            2352666,
            234566234534266,
            4235565,
            5342663462,
            2346454325,
            54235,
            3425666423,
            4355345,
            3456643,
            52436,
            5234,
            5,
            23478,
            234,
            8
        ]
        
        # insert scores
        for score in playerThreeScores:
            dbAPI.addScore(db_filename, playerID_3, playerName_3, score)
            
        # Grab playerID_2's top ten scores
        topTen = dbAPI.getTopTenPersonalScores(db_filename, playerID_2)
        
        #sort scores for comparrison
        playerTwoScores.sort()
        
        
        # Check the top ten scores and confirm they have the same playerID and playerName
        assert topTen[0][0] == playerID_2
        assert topTen[0][1] == playerName_2
        assert topTen[0][2] == playerTwoScores[-1]
        
        assert topTen[1][0] == playerID_2
        assert topTen[1][1] == playerName_2
        assert topTen[1][2] == playerTwoScores[-2]
        
        assert topTen[2][0] == playerID_2
        assert topTen[2][1] == playerName_2
        assert topTen[2][2] == playerTwoScores[-3]
        
        assert topTen[3][0] == playerID_2
        assert topTen[3][1] == playerName_2
        assert topTen[3][2] == playerTwoScores[-4]
        
        assert topTen[4][0] == playerID_2
        assert topTen[4][1] == playerName_2
        assert topTen[4][2] == playerTwoScores[-5]
        
        assert topTen[5][0] == playerID_2
        assert topTen[5][1] == playerName_2
        assert topTen[5][2] == playerTwoScores[-6]
        
        assert topTen[6][0] == playerID_2
        assert topTen[6][1] == playerName_2
        assert topTen[6][2] == playerTwoScores[-7]
        
        assert topTen[7][0] == playerID_2
        assert topTen[7][1] == playerName_2
        assert topTen[7][2] == playerTwoScores[-8]
        
        assert topTen[8][0] == playerID_2
        assert topTen[8][1] == playerName_2
        assert topTen[8][2] == playerTwoScores[-9]
        
        assert topTen[9][0] == playerID_2
        assert topTen[9][1] == playerName_2
        assert topTen[9][2] == playerTwoScores[-10]
        
        
    
if __name__ == '__main__':
    unittest.main()    