(function () {
    'use strict';

    function Gunman() {

        this.domElements = {
            gameField: document.querySelector('.game-field'),
            gunman: document.querySelector('.gunman'),
            currentLevel: document.querySelector('.current-level'),
            buttonNewGame: document.querySelector('.new-game-button'),
            buttonNextLevel: document.querySelector('.next-level-button'),
            buttonSound: document.querySelector('.sound-button'),
            gameStatus: document.querySelector('.game-status'),
            timeGunman: document.querySelector('.time-gunman'),
            timePlayer: document.querySelector('.time-player'),
            gameStatistics: document.querySelector('.game-statistics')
        };

        this.gameSounds = {
            deathSound: new Audio('media/sounds/death.m4a'),
            introSound: new Audio('media/sounds/intro.m4a'),
            fireSound: new Audio('media/sounds/fire.m4a'),
            faultSound: new Audio('media/sounds/foul.m4a'),
            shotSound: new Audio('media/sounds/shot.m4a'),
            shotFallSound: new Audio('media/sounds/shot-fall.m4a'),
            waitSound: new Audio('media/sounds/wait.m4a'),
            winSound: new Audio('media/sounds/win.m4a')
        };

        var self = this;

        this.gunmanGo = function () {
            self.clearAnimation();
            self.domElements.gunman.classList.add('gunman-level-' + self.currentLevel + '-go');
        };

        this.gunmanStand = function () {
            self.clearAnimation();
            self.domElements.gunman.classList.add('gunman-level-' + self.currentLevel + '-stop');
        };

        this.gunmanReady = function () {
            self.clearAnimation();
            self.domElements.gunman.classList.add('gunman-level-' + self.currentLevel + '-ready');
        };

        this.gunmanHit = function () {
            self.clearAnimation();
            self.domElements.gunman.classList.add('gunman-level-' + self.currentLevel + '-hit');
            self.domElements.gameField.classList.add('game-field-lost');
        };

        this.gunmanFall = function () {
            self.clearAnimation();
            self.domElements.gunman.classList.add('gunman-level-' + self.currentLevel + '-fall');
            self.domElements.gameField.classList.add('game-field-win');
        };

        this.gunmanDead = function () {
            self.clearAnimation();
            self.domElements.gunman.classList.add('gunman-level-' + self.currentLevel + '-dead');
            self.domElements.gameField.classList.add('game-field-win');
        };

        // clear gunman animation
        this.clearAnimation = function () {
            for (var i = 1; i <= 5; i++) {
                self.domElements.gunman.classList.remove('gunman-level-' + i + '-go');
                self.domElements.gunman.classList.remove('gunman-level-' + i + '-stand');
                self.domElements.gunman.classList.remove('gunman-level-' + i + '-ready');
                self.domElements.gunman.classList.remove('gunman-level-' + i + '-shooting');
                self.domElements.gunman.classList.remove('gunman-level-' + i + '-fall');
                self.domElements.gunman.classList.remove('gunman-level-' + i + '-dead');
            }
        };

        this.init = function () {
            self.domElements.buttonNewGame.addEventListener('click', self.newGame);
            self.domElements.buttonNextLevel.addEventListener('click', self.nextLevel);
            self.falseStart = false;
            self.readyToFire = false;
            self.shot = new CustomEvent('shot');
        };

        this.newGame = function () {

            self.gameSounds.introSound.pause();
            self.playerBonus = 0;
            self.init();

            self.domElements.buttonNextLevel.addEventListener('click', self.nextLevel);
            self.domElements.gunman.addEventListener('transitionend', self.startBattle);
            self.domElements.gunman.addEventListener('click', self.playerShot);
            self.domElements.gunman.addEventListener('shot', self.gunmanWin);
            self.domElements.gunman.className = 'gunman';

            self.domElements.gameStatus.classList.add('hidden');

            self.domElements.gameStatus.style.left = '70%';

            self.gunmanTime = 1600;

            self.currentLevel = 1;

            self.domElements.buttonNewGame.classList.remove('visible');
            self.domElements.buttonNewGame.classList.add('hidden');
            self.domElements.buttonNewGame.removeEventListener('click', self.nextLevel);

            self.domElements.currentLevel.textContent = 'Level ' + self.currentLevel;
            self.domElements.currentLevel.classList.remove('hidden');

            self.domElements.gameStatistics.classList.add('visible');

            self.getGameStatistics();

            self.getGunmanGo();
        };

        this.getGunmanGo = function () {
            self.domElements.gunman.style.left = '';

            if (self.domElements.gunman.classList.contains('gunman-move')) {
                self.domElements.gunman.classList.remove('gunman-move');
            }
            self.gameSounds.introSound.play();
            self.clearAnimation();
            setTimeout(function () {
                self.domElements.gunman.classList.add('gunman-move');
                self.gunmanGo();
            }, 100);
        };

        this.startBattle = function () {

            self.gameSounds.introSound.pause();

            self.gunmanStand();

            self.gameSounds.waitSound.play();


            setTimeout(function () {
                if (!self.falseStart) {
                    self.readyToFire = true;
                    self.domElements.gameStatus.textContent = 'fire!!!';
                    self.domElements.gameStatus.classList.remove('hidden');
                    self.gunmanReady();
                    self.gameSounds.fireSound.play();
                    self.timeCounter(new Date().getTime());

                    setTimeout(self.gunmanWin, self.gunmanTime);
                }
            }, 1500);
        };

        this.nextLevel = function (level) {

            self.domElements.gameStatus.classList.add('hidden');
            self.domElements.gameStatus.style.left = '70%';

            if (self.domElements.gameField.classList.contains('game-field-win')) {
                self.domElements.gameField.classList.remove('game-field-win');
            }

            if (self.currentLevel == 5) {

                self.domElements.buttonNextLevel.removeEventListener('click', self.nextLevel);
                self.domElements.buttonNextLevel.classList.add('hidden');

                setTimeout(function () {
                    self.gameSounds.winSound.play();
                    self.domElements.gameStatus.textContent = 'it was a trial version of game, please contact me if you want more!';
                    self.domElements.gameStatus.classList.add('visible');
                    self.gameOver();
                }, 500);
            }

            else {
                self.clearAnimation();

                self.domElements.gunman.style.left = '';
                self.domElements.gunman.className = 'gunman';
                self.domElements.gunman.classList.remove('gunman-level-' + self.currentLevel);

                self.domElements.buttonNextLevel.removeEventListener('click', self.nextLevel);
                self.domElements.buttonNextLevel.classList.remove('visible');

                self.domElements.gameStatus.classList.add('hidden');

                self.currentLevel++;
                self.domElements.currentLevel.textContent = 'Level ' + self.currentLevel;
                self.gunmanTime -= self.currentLevel * 90;
                self.domElements.gunman.classList.add('gunman-level-' + self.currentLevel);
                self.domElements.gameStatistics.classList.add('visible');
                self.domElements.gunman.addEventListener('click', self.playerShot);
                self.getGameStatistics();
                self.getGunmanGo();
            }
        };


        this.gunmanWin = function () {
            if (self.readyToFire) {
                self.readyToFire = false;

                self.gameSounds.shotSound.play();

                self.domElements.gunman.dispatchEvent(self.shot);
                self.domElements.gunman.removeEventListener('click', self.playerShot);

                self.gunmanHit();

                self.domElements.gameStatus.textContent = 'gunman won!';
                self.domElements.gameStatus.classList.add('visible');

                setTimeout(function () {
                    self.gameSounds.deathSound.play();
                    self.gameOver();
                }, 1500);
            }
        };


        this.playerShot = function () {
            if (self.readyToFire) {

                self.readyToFire = false;

                self.domElements.gunman.removeEventListener('click', self.playerShot);
                self.gameSounds.shotFallSound.play();
                self.gunmanFall();
                self.domElements.gameStatus.textContent = 'cool shot!';

                setTimeout(self.gunmanDead, 1500);

                setTimeout(
                    function () {

                        self.gameSounds.winSound.play();
                        self.domElements.gameStatistics.classList.remove('visible');

                        self.domElements.buttonNextLevel.addEventListener('click', self.nextLevel);
                        self.domElements.buttonNextLevel.classList.add('visible');

                    }, 1000);
            } else {

                self.falseStart = true;

                self.gameSounds.introSound.pause();
                self.gameSounds.shotSound.play();

                self.clearAnimation();

                self.domElements.gunman.removeEventListener('transitionend', self.startBattle);
                self.domElements.gunman.removeEventListener('click', self.playerShot);

                self.domElements.gameStatus.textContent = 'fault!';
                self.domElements.gameStatus.classList.add('visible');

                setTimeout(function () {
                    self.gameSounds.faultSound.play();
                    self.domElements.currentLevel.classList.add('hidden');
                    self.domElements.gameStatistics.classList.remove('visible');
                    self.domElements.buttonNewGame.addEventListener('click', self.newGame);
                    self.domElements.buttonNewGame.classList.add('visible');

                }, 2000);

                setTimeout(function () {
                    self.domElements.gameStatistics.classList.remove('visible');
                    self.domElements.gameStatus.classList.remove('visible');
                    self.domElements.gunman.classList.add('hidden');
                }, 1500);
            }
        };

        this.timeCounter = function (time) {

            var currentTime;

            function timer() {
                currentTime = new Date().getTime();
                if (self.readyToFire) {
                    self.playerBonus = ((currentTime - time) / 1000).toFixed(2);
                    self.domElements.timePlayer.textContent = 'You ' + self.playerBonus;
                    setTimeout(timer, 5);
                }
            }

            timer();
        };

        this.getGameStatistics = function () {
            self.domElements.timeGunman.textContent = 'gunman ' + (self.gunmanTime / 1000).toFixed(2);
            self.domElements.timePlayer.textContent = 'you 0.00';
        };

        this.gameOver = function () {

            self.domElements.buttonNextLevel.removeEventListener('click', self.nextLevel);
            self.domElements.buttonNextLevel.classList.remove('visible');

            self.domElements.currentLevel.classList.add('hidden');

            self.domElements.gameStatus.style.left = '50%';

            setTimeout(function () {

                self.domElements.gameStatistics.classList.remove('visible');
                self.domElements.gameStatus.classList.add('hidden');
                if (self.domElements.gameField.classList.contains('game-field-lost')) {
                    self.domElements.gameField.classList.remove('game-field-lost')
                }
            }, 3500);

            setTimeout(function () {



            }, 4500);

            setTimeout(function () {
                self.domElements.gameStatus.classList.remove('hidden');
                self.domElements.gunman.className = 'gunman';
                self.domElements.gameStatus.style.left = '110%';
                self.domElements.gameStatus.classList.remove('visible');
                self.domElements.gameStatus.classList.add('hidden');

                self.domElements.buttonNewGame.addEventListener('click', self.newGame);
                self.domElements.buttonNewGame.classList.remove('hidden');
            }, 6000);

            self.clearAnimation();

        };
    }

    var gunman = new Gunman();
    gunman.init();
})();
