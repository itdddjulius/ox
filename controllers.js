var ticTacToe = angular.module('ticTacToe', ['firebase']);

ticTacToe
	
	//Set gameboard styling directive

	.directive('gameboard', function() {
		return {
			restrict: 'A',
			template: '<div tile ng-repeat="b in boxes" ng-click="b.clicked || gameOver || box($index)" ng-class="{tile : b.player == null, player1 : b.player == 0, player2 : b.player == 1, clicked : b.clicked}"><div class="symbol">{{boxes[$index].symbol}}</div></div>',
			link: function (s, e, attrs){
				e.addClass('gameboard');
			}
		};
	})

	//Set tile styling directive to make sizes scaleable

	.directive('tile', function() {

		return {
			restrict: 'A',
			link: function (s, e, attrs){
				boardWidth = Math.sqrt(s.boxes.length);

				e.css({
					width: (100 / boardWidth) - (boardWidth / 2) + "%",
					height: (100 / boardWidth) - (boardWidth / 2) + "%",
					margin: boardWidth * 1.3 + 'px',
					fontSize: (18 / boardWidth) + 'em'
				})
			}
		};
	})


	//Set tile styling directive to make sizes scaleable

	.controller('TicTacToeController', function ($scope, $firebase) {
	
		$scope.remoteBoxes = $firebase(new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/remoteBoxes"));
	 		

		// -------- Boxes and Box Data -------- //

		$scope.boxes = [
			{id: 0, player:2, clicked:false, colorMe: false, symbol: ""},
			{id: 1, player:2, clicked:false, colorMe: false, symbol: ""},
			{id: 2, player:2, clicked:false, colorMe: false, symbol: ""},
			{id: 3, player:2, clicked:false, colorMe: false, symbol: ""},
			{id: 4, player:2, clicked:false, colorMe: false, symbol: ""},
			{id: 5, player:2, clicked:false, colorMe: false, symbol: ""},
			{id: 6, player:2, clicked:false, colorMe: false, symbol: ""},
			{id: 7, player:2, clicked:false, colorMe: false, symbol: ""},
			{id: 8, player:2, clicked:false, colorMe: false, symbol: ""}
		];

		
		// -------- Turns and Other  -------- //

		$scope.begin = true;

		$scope.turn = 0; //will change every turn

		$scope.gameOver = false;

		$scope.tie = false;

		// -------- Player Data -------- //

		$scope.players = [
			{
				name: "",
				symbol: "X",
				row0: 0,
				row1: 0,
				row2: 0,
				column0: 0,
				column1: 0,
				column2: 0,
				diagonal0: 0,
				diagonal1: 0
			},
			{
				name: "",
				symbol: "O",
				row0: 0,
				row1: 0,
				row2: 0,
				column0: 0,
				column1: 0,
				column2: 0,
				diagonal0: 0,
				diagonal1: 0
			}
		];



		// In order to start the game over with a clean board and player data, 
		// we make a copy of the first dataset.

		$scope.newBoxes = angular.copy($scope.boxes);


		// -------- Enter the game -------- //

		$scope.gameEnter = function(){
			$scope.begin = false;
			$scope.newPlayers = angular.copy($scope.players);
		}

		
		// -------- Game Logic ---------- //

		$scope.box = function(cellIndex){
				var cellId = cellIndex.id;
				var playTurn = $scope.turn %2 ;
				var player = $scope.players[playTurn];
				var playerString = "players["+playTurn+"]";
				eval("$scope."+playerString+".row"+(Math.floor(cellId / 3))+"++");
				eval("$scope."+playerString+".column"+(cellId % 3)+"++");

				if (cellId % (4) == 0){
					eval("$scope."+playerString+".diagonal0++");
				}
				if (cellId % (2) == 0 && cellId > 0 && cellId < 2){
					eval("$scope."+playerString+".diagonal1++");
				}
				cellIndex.clicked = true;
				cellIndex.player = playTurn;
				cellIndex.symbol = player.symbol;

				for (props in $scope.players[playTurn]){
						if($scope.players[playTurn][props] == 3){
							$scope.win(playTurn, props); //Call the win function, which is created below
						}
						else if($scope.turn == (8)){
							$scope.gameOver = true;
							$scope.tie = true;
						}
					};
				
				$scope.turn++;
		};


		// -------- Win function -------- //

		//This function will run every time a player wins.

		$scope.win = function(playTurn, props){
			$scope.currentPlayer = $scope.players[playTurn];
			$scope.gameOver = true;
			$scope.winningPlay = props;
			$scope.colorCombo(props);
		}


		// -------- Start New Game -------- //

		$scope.startOver = function(){
			$scope.players = $scope.newPlayers.reverse();
			$scope.boxes = $scope.newBoxes;
			$scope.gameOver = false;
			$scope.newPlayers = angular.copy($scope.players);
			$scope.newBoxes = angular.copy($scope.boxes);
			$scope.turn = 0;
			$scope.tie = false;
		}

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
		}


		//Create a for loop that sets a property (colorMe) in winning combo boxes.
		//When true, these boxes will get the class winColor, which will color the letters.

		$scope.colorCombo = function(prop){
			for (c in $scope.combos){
				if ($scope.winningPlay == c){
					$scope.winCombo = $scope.combos[c];
					for (d in $scope.winCombo){
						$scope.boxes[$scope.winCombo[d]].colorMe = true;
					}
				}
			}
		}

		$scope.remoteBoxes.$bind($scope, "boxes");
	
});

