var ticTacToe = angular.module('ticTacToe', ['firebase']);

ticTacToe
	
	.controller('TicTacToeController', function($scope, $firebase, $window) {
	
		$scope.remoteGameContainer = $firebase(new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remoteGameContainer"));
		$scope.remoteTurn = $firebase(new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remoteTurn"));
		$scope.remotePlayerCounter = $firebase(new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remotePlayerCounter"));
		$scope.remotePlayerLobby = $firebase(new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remotePlayerLobby"));
		$scope.gamesOnline = $firebase(new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/gamesOnline"));
		var playersRef = new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remotePlayers");
		var gameRef = new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remoteGames");

		// -------- View Different Screens -------- //

		//There are three different views available to the user:
		//the Welcome screen, the Game Screen, and the Past Games Screen.
		//These are set to true or flase according to whether or not they
		//should be viewable at that moment.

		$scope.welcomeView = true;
		$scope.waitView = false;
		$scope.gameView = false;
		$scope.pastView = false;


		// -------- Game Container Data -------- //

		//Contains data on the board and data on the players.


		$scope.remotePlayers = $firebase(playersRef);
		$scope.players;

		$scope.games = $firebase(gameRef);
		$scope.localGames;

		$scope.playerName = "";

		$scope.playerCounter;

		// -------- Storing Past Games -------- //

		$scope.pastGamesContainer = {
				pastGames: []
			};

		
		// -------- Turns and Other  -------- //

		$scope.turn = 0; //will change every turn

		$scope.gameOver = false;

		$scope.tie = false;



		// In order to start the game over with a clean board and player data, 
		// we make a copy of the first dataset.

		$scope.games.$bind($scope, "localGames");
		$scope.remoteTurn.$bind($scope, "turn");
		$scope.remotePlayerLobby.$bind($scope, "playerLobby");
		$scope.gamesOnline.$bind($scope, "localGamesOnline");
		$scope.remotePlayers.$bind($scope, "players")

		$scope.remotePlayerCounter.$bind($scope, "playerCounter");


		// -------- Enter the Game -------- //

		$scope.gameEnter = function(){
			if ($scope.playerName){
				$scope.playerId = playersRef.push({ name: $scope.playerName, symbol: ($scope.playerCounter % 2 == 0 ? "X" : "O"), row0: 0, row1: 0, row2: 0, column0: 0, column1: 0, column2: 0, diagonal0: 0, diagonal1: 0}).name();
				$scope.playerLobby.playerIds.push($scope.playerId);
				$scope.playerCounter++;
			}
			else{
				$scope.turn = 0;
				$scope.nameWarning = true; //Tell players that they must input a valid name
			}
			if ($scope.playerCounter < 2){
				$scope.waitView = true;
			}
			else{
				$scope.waitView = false;
				$scope.gameView = true;
				$scope.generateBoard();
			}
		};

		//Watch the player lobby to see if there are more than one player. If so, update
		//the waitView variable to change the view.

		$scope.$watch('games', function(){
			$scope.$watch('playerCounter', function(){
				if ($scope.playerCounter >= 2){
					$scope.waitView = false;
					$scope.gameView = true;
					$scope.welcomeView = false;
					$scope.gameId = $scope.gamesOnline.gameIds[1];
					$scope.removePlayerFromLobby();
					
				}
			})
		});



		// -------- Generate the Board -------- //

		$scope.generateBoard = function(){
					$scope.opponent = $scope.players[$scope.remotePlayerLobby.playerIds[1]]
					$scope.welcomeView = false;
					$scope.newPlayers = angular.copy($scope.players);
					$scope.gameId = gameRef.push(
						{
							player1: $scope.opponent,
							player2: $scope.remotePlayers[$scope.playerId],
							turn: 0,
							gameOver: false,
							tie: false,
							boxes: [
								{id: 0, player:2, clicked:false, colorMe: false, symbol: ""},
								{id: 1, player:2, clicked:false, colorMe: false, symbol: ""},
								{id: 2, player:2, clicked:false, colorMe: false, symbol: ""},
								{id: 3, player:2, clicked:false, colorMe: false, symbol: ""},
								{id: 4, player:2, clicked:false, colorMe: false, symbol: ""},
								{id: 5, player:2, clicked:false, colorMe: false, symbol: ""},
								{id: 6, player:2, clicked:false, colorMe: false, symbol: ""},
								{id: 7, player:2, clicked:false, colorMe: false, symbol: ""},
								{id: 8, player:2, clicked:false, colorMe: false, symbol: ""}
							],
							winner: ""
						}).name();
					$scope.localGamesOnline.gameIds.push($scope.gameId);
					$scope.newBoard = angular.copy($scope.games[$scope.gameId]);
					$scope.removePlayerFromLobby();
					
			
		};


		
		// -------- Game Logic ---------- //

		//Executes upon clicking any box in Tic Tac Toe board

		$scope.box = function(cellIndex){
				var cellId = cellIndex.id;
				var playTurn = $scope.games[$scope.gameId].turn %2 ;
				if (playTurn == 0){
					var player = $scope.players[$scope.playerId];
					var playerString = "players['" + $scope.playerId + "']";
				}
				else{
					var player = $scope.players[$scope.playerId];
					var playerString = "players['" + $scope.playerId + "']";
				}
				var playerName = player.name;
				eval("$scope."+ playerString +".row"+(Math.floor(cellId / 3))+"++");
				eval("$scope."+playerString+".column"+(cellId % 3)+"++");

				if (cellId % (4) == 0){
					eval("$scope."+playerString+".diagonal0++");
				}
				if (cellId % (2) == 0 && cellId > 0 && cellId < 8){
					eval("$scope."+playerString+".diagonal1++");
				}
				cellIndex.clicked = true;
				cellIndex.player = playTurn;
				cellIndex.symbol = player.symbol;

				for (props in player){
						if(player[props] == 3){
							$scope.winFunc(props, player); //Call the win function, which is created below
						}
				}
				
				if($scope.localGames[$scope.gameId].turn == 8 && $scope.gameOver == false){
						$scope.tieFunc();
				}
				
				$scope.localGames[$scope.gameId].turn++;
				console.log($scope.games[$scope.gameId]);
		};




		// -------- Win Function -------- //

		//This function will run every time a player wins.

		$scope.winFunc = function(props, player){
			$scope.currentPlayer = player;
			$scope.gameOver = true;
			$scope.winningPlay = props;
			$scope.colorCombo(props, player.symbol);
			$scope.localGames[$scope.gameId].winner = player.name; //set a property for player winner to be viewed in stats
			$scope.pastGamesContainer.pastGames.push(angular.copy($scope.localGames[$scope.gameId])); //store past games
		};

		// -------- Tie Function -------- //

		$scope.tieFunc = function(){
			$scope.tie = true;
			$scope.gameOver = true;
			$scope.localGames[$scope.gameId].winner = "NA";
			$scope.pastGamesContainer.pastGames.push(angular.copy($scope.localGames[$scope.gameId])); //store past games
			$scope.localGames[$scope.gameId].tie = true;
		};

		// -------- Add Stats Function -------- //



		// -------- Start New Game -------- //

		$scope.playAgain = function(){
			$scope.players = $scope.newPlayers;
			$scope.localGames[$scope.gameId] = $scope.newBoard;
			$scope.gameOver = false;
			$scope.newPlayers = angular.copy($scope.players);
			$scope.newBoard = angular.copy($scope.localGames[$scope.gameId]);
			$scope.localGames[$scope.gameId].turn = 0;
			$scope.tie = false;
			$scope.pastView = false;
			$scope.gameView = true;
			$scope.players[$scope.playerId] = { name: $scope.playerName, symbol: "O", row0: 0, row1: 0, row2: 0, column0: 0, column1: 0, column2: 0, diagonal0: 0, diagonal1: 0};
			$scope.opponent =  { name: $scope.playerName, symbol: "X", row0: 0, row1: 0, row2: 0, column0: 0, column1: 0, column2: 0, diagonal0: 0, diagonal1: 0}
		};

		// -------- View Past Games -------- //

		$scope.viewPastGames = function(){
			$scope.gameView = false;
			$scope.pastView = true;
		};

		// -------- Color the Winning Combinations -------- //

		//Create an array of possible winning combos, which wll be checked against
		//the winning combo identified in the box function's win logic

		$scope.combos = {
			row0: [0,1,2],
			row1: [3,4,5],
			row2: [6,7,8],
			column0: [0,3,6],
			column1: [1,4,7],
			column2: [2,5,8],
			diagonal0: [0,4,8],
			diagonal1: [2,4,6]
		};

		//Create a for loop that sets a property (colorMe) in winning combo boxes.
		//When true, these boxes will get the class winColor, which will color the letters.

		$scope.colorCombo = function(prop, symbol){
			for (c in $scope.combos){
				if ($scope.winningPlay == c){
					$scope.winCombo = $scope.combos[c];
					for (d in $scope.winCombo){
						$scope.localGames[$scope.gameId].boxes[$scope.winCombo[d]].colorMe = symbol;
					}
				}
			}
		};

		// -------- Remove Players and Gmes from Lobbies When Leaving the Page or Initiating New Game -------- //

		$scope.removePlayerFromLobby = function(){

			if($scope.playerCounter > 0){
				counterUrl = new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remotePlayerCounter").set($scope.playerCounter - 1)
			}
			for (i = 0; i < $scope.remotePlayerLobby.playerIds.length; ++i){
				if ($scope.playerId == $scope.remotePlayerLobby.playerIds[i]){
					var url = new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remotePlayerLobby/playerIds/" + i);
					url.remove();
				}
			}
		};

		$scope.removeGameFromLobby = function(){

			for (i = 0; i < $scope.gamesOnline.gameIds.length; ++i){
				if ($scope.gameId == $scope.gamesOnline.gameIds[i]){
					var url = new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/gamesOnline/gameIds/" + i);
					url.remove();
				}
			}
		};

		$scope.removePlayerFromGame = function(){
			var playerUrl = new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remotePlayers/" + $scope.playerId);
			playerUrl.remove();
		}

		$window.onunload = function(){
			$scope.removePlayerFromLobby();
			$scope.removePlayerFromGame();
		}



		// $scope.$watch("gameContainer", function() {
		// 	console.log("Model changed!")
		// });
		// $scope.$watch("players", function() {
		// 	console.log("Model changed!")
		// });
	
});

