import random
import json

class NgeeAnnCityGame:
    def __init__(self):
        self.board = [['' for _ in range(5)] for _ in range(5)]
        self.coins = float('inf')  # Unlimited coins in Free Play mode
        self.turn_number = 0
        self.score = 0
        self.profit = 0
        self.upkeep = 0
        self.high_scores = self.load_high_scores()
        
    def load_high_scores(self):
        try:
            with open('high_scores.json', 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            return []
    
    def save_high_scores(self):
        with open('high_scores.json', 'w') as file:
            json.dump(self.high_scores, file)
    
    def display_main_menu(self):
        print("Main Menu:")
        print("1. Start New Free Play Game")
        print("2. Load Saved Game")
        print("3. Display High Scores")
        print("4. Exit Game")
        choice = input("Choose an option: ")
        return choice
    
    def start_new_game(self):
        self.__init__()  # Reset the game
        self.game_loop()
    
    def load_game(self):
        try:
            with open('save_game.json', 'r') as file:
                data = json.load(file)
                self.board = data['board']
                self.coins = data['coins']
                self.turn_number = data['turn_number']
                self.score = data['score']
                self.profit = data['profit']
                self.upkeep = data['upkeep']
        except FileNotFoundError:
            print("No saved game found.")
        self.game_loop()
    
    def save_game(self):
        data = {
            'board': self.board,
            'coins': self.coins,
            'turn_number': self.turn_number,
            'score': self.score,
            'profit': self.profit,
            'upkeep': self.upkeep
        }
        with open('save_game.json', 'w') as file:
            json.dump(data, file)
        print("Game saved.")

    def display_high_scores(self):
        print("High Scores:")
        for score in self.high_scores:
            print(score)
    
    def exit_game(self):
        print("Exiting game.")
        exit()
    
    def game_loop(self):
        while True:
            self.turn_number += 1
            self.display_board()
            self.calculate_score()
            self.calculate_profit_and_upkeep()
            self.display_game_status()
            choice = self.display_game_menu()
            if choice == '1':
                self.build_building()
            elif choice == '2':
                self.demolish_building()
            elif choice == '3':
                self.save_game()
            elif choice == '4':
                break
        self.display_main_menu()

    def display_board(self):
        for row in self.board:
            print(' '.join([cell if cell else '.' for cell in row]))

    def display_game_status(self):
        print(f"Turn: {self.turn_number}, Coins: {self.coins}, Score: {self.score}, Profit: {self.profit}, Upkeep: {self.upkeep}")

    def display_game_menu(self):
        print("1. Build a Building")
        print("2. Demolish a Building")
        print("3. Save Game")
        print("4. Exit to Main Menu")
        choice = input("Choose an option: ")
        return choice

    def build_building(self):
        print("Choose a building to construct:")
        print("R: Residential")
        print("I: Industry")
        print("C: Commercial")
        print("O: Park")
        print("*: Road")
        building_type = input("Building type: ")
        if building_type not in ['R', 'I', 'C', 'O', '*']:
            print("Invalid building type.")
            return
        x, y = map(int, input("Enter coordinates (x y): ").split())
        if 0 <= x < len(self.board) and 0 <= y < len(self.board[0]) and not self.board[x][y]:
            self.board[x][y] = building_type
        else:
            print("Invalid coordinates or cell already occupied.")

    def demolish_building(self):
        x, y = map(int, input("Enter coordinates (x y): ").split())
        if 0 <= x < len(self.board) and 0 <= y < len(self.board[0]) and self.board[x][y]:
            self.board[x][y] = ''
        else:
            print("Invalid coordinates or no building to demolish.")

    def calculate_score(self):
        # Implement scoring logic based on the game rules
        pass

    def calculate_profit_and_upkeep(self):
        # Implement profit and upkeep calculation
        pass

game = NgeeAnnCityGame()
while True:
    choice = game.display_main_menu()
    if choice == '1':
        game.start_new_game()
    elif choice == '2':
        game.load_game()
    elif choice == '3':
        game.display_high_scores()
    elif choice == '4':
        game.exit_game()
