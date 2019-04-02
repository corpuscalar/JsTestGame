/*-------------МЕХАНИКА САЙТА--------------*/
var _isLogin;
function authCheck() {
    if (_.isNull(localStorage.getItem('_isLogin'))) {
        _isLogin = false;
        localStorage.setItem('_isLogin', _isLogin);
    }
    else {
        _isLogin = localStorage.getItem('_isLogin');
    }
}

function exitFunction() {
    localStorage.setItem('_isLogin' , false);
    localStorage.removeItem('_isLogin');

    location.reload();
    initAPP();
}

var guest = 'Гость';
var USERNAME;


function initAPP() {
    USERNAME = localStorage.getItem('USERNAME');
    $(function () {

            _isLogin=localStorage.getItem('_isLogin');

        if (_isLogin) {
            $('#user').text('Пользователь: '+USERNAME);
            $('#greeting').text('Приветствуем тебя, ' + USERNAME + '!');

            $('#authButton').hide();
            $('#regButton').hide();
            $('#blockingOverlay').hide();
            $('#blockingModal').modal('hide');
            $('#startGame').attr('disabled', false);
            $('#exitButton').show();

        }
        else {
            $('#user').text('Пользователь: '+guest);
            $('#greeting').text('Приветствуем тебя, ' + guest + '!');

            $('#exitButton').hide();
            $('#blockingOverlay').show();
            $('#blockingModal').modal('show');
            $('#startGame').attr('disabled', true);
        }

    })
}



/*-------------ОБРАБОТКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ--------------*/
var userInfo = [];
var codeDBQuery;
var user = { };
var selectionCode;
var boolQuery;

function initRegForm() {
    if (localStorage.getItem('_isAuth') == 1) {
        $(function () {
            document.getElementById('regAuthHeader').innerHTML = 'Авторизация'; })
        }

    else {
        $(function () {
            document.getElementById('regAuthHeader').innerHTML = 'Регистрация'; })
    }

    }

function regAuthManager(code) {
    localStorage.setItem('_isAuth', code);
    initRegForm();

}

function getUserNamePassword() {


    var login = document.getElementById('regAuthUsername').value;
    var password = document.getElementById('regAuthPassword').value;


        boolQuery = localStorage.getItem('_isAuth');
        boolQuery == 1 ? DBQuery(login, password, 0): DBQuery(login, password, 1);




}

function DBQuery(login, password, codeDBQuery) { // ОБРАБОТКА ЗАПРОСА

    user['userName'] = login;
    user['userPassword'] = password;

    if (login ==='' || password==='') {
        document.getElementById('errorText').innerHTML = "Имеются пустые поля";
    }
    else {
    codeDBQuery ? regUSER(): authUSER(login, password) ; //ВЫБОР ФУНКЦИИ ПО КОДУ ЗАПРОСА
}

function checkTextField() {

}

function regUSER() {


    if (_.isNull(localStorage.getItem('userINFO'))) {
        userInfo.push(user);
        localStorage.setItem('userINFO', JSON.stringify(userInfo));
        alert('Отлично, теперь вы можете авторизоваться');
    }
    else {
        userInfo = JSON.parse(localStorage.getItem('userINFO'));
        if(_.findKey(userInfo, ['userName' , login])) {
            document.getElementById('errorText').innerHTML = "Данный пользователь существует";
        }
        else {
            userInfo.push(user);
            localStorage.setItem('userINFO', JSON.stringify(userInfo));
            alert('Отлично, теперь вы можете авторизоваться');
            document.getElementById('errorText').innerHTML = "";
        }


        }
    }
}



var getUserInfo = [];

function authUSER(login, password) {


    getUserInfo = JSON.parse(localStorage.getItem('userINFO'));

    if (_.findKey(getUserInfo, ['userName', login])) {
        if(_.findKey(getUserInfo, ['userPassword', password])) {
            _isLogin = true;
            localStorage.setItem('_isLogin', _isLogin);
            localStorage.setItem('USERNAME',login);
            window.location.replace('index.html');
            initAPP();

        }
        else {
            document.getElementById('errorText').innerHTML = 'Неверный пароль';
        }
    }
    else {
        document.getElementById('errorText').innerHTML = 'Данный пользователь не найден';
    }
}

var startIndex = 0;
function fillTableScores() {
    var tableScoresUserInfo = [];


    var table = document.getElementById('_tableScores');
    if (_.isNull(localStorage.getItem('userSCORES'))) {
        alert('В базе не имеются данные учёта очков');
    }
    else {
        tableScoresUserInfo = JSON.parse(localStorage.getItem('userSCORES'));
        tableScoresUserInfo.sort(function (a, b) {
            return  b.userScores - a.userScores;

        });

    }
        console.log(tableScoresUserInfo);
        while (startIndex < tableScoresUserInfo.length) {
           var newRow = table.insertRow(startIndex);
           newRow.scope = 'row';
           newRow.insertCell(0).innerHTML = startIndex+1;
           newRow.insertCell(1).innerHTML = tableScoresUserInfo[startIndex].userName;
           newRow.insertCell(2).innerHTML = tableScoresUserInfo[startIndex].userScores;
            startIndex++;
        }
    }










/*--------------------ИГРОВАЯ МЕХАНИКА-------------------*/
var startGame = {
    init: function (){
        $(function () {
            $("#blockingOverlay").hide();
            $('#startGame').attr('disabled', true);
            scoresFinal = 0;
            $('#scores').text('Результат: '+scoresFinal.toFixed(0));
            gameObject.init();
            //component.add();
            //destroyObject();

        })
    }
}

function getScores(location, gameZoneWidth) {
    removeComponentScores = 100+((location*(-100))/gameZoneWidth);
    return removeComponentScores;
}
//генерирование случайных чисел в диапазоне
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//рандомное определение и добавление фигуры на игровое поле
var gameObject = {};
var gameZoneWidth;
var gameZoneHeight;
var definedFigure;
var positionFigure;
var scoresBuffer;
var scoresFinal = 0;
var removeComponentScores;
var definedFigure;
var sizeFigure;
var gameTime;
var gameOverTimeout;


$(function () {
    gameZoneWidth = $('#_gameZone').width();
    gameZoneHeight = $('#_gameZone').height();
})

gameObject.init = function() {
    gameObject.createFigure();
    gameObject.behaviour();
    gameObject.gameStatus();

}

gameObject.defineFigure = function () {
    var indexOfSelection = getRandomInteger(0,4);
    var typeFigure = ['square', 'circle', 'diamond', 'triangle'];
    definedFigure = typeFigure[indexOfSelection];
    return definedFigure;
}

gameObject.behaviour = function () {
    $(function () {
        var componentDestroy = $("#transparentSquare");

        componentDestroy.click(function () {
            positionFigure = $('#transparentSquare').position().left.toFixed(0);

            if (componentDestroy.remove()) {
                scoresFinal = scoresFinal + getScores(positionFigure, gameZoneWidth); //возвращает полученные очки при уничтожении объекта

                gameObject.createFigure();
                gameObject.behaviour();
                setUserScore();

                $('#scores').text('Результат: '+scoresFinal.toFixed(0));

            }
        })

    })

}

gameObject.gameStatus = function () {
$(function () {
    if ($('#transparentSquare').position().left+50 > gameZoneWidth+50+(Math.sqrt(sizeFigure))) {
            console.log('AA');

            var TSSQtDestroy = $("#transparentSquare");
            TSSQtDestroy.remove();
            $('#startGame').attr('disabled', false);
            $('#blockingOverlay').show();
            $('#gameOverModal').modal('show');
            $('#finalScore').text('Итоговый счёт: '+scoresFinal.toFixed(0));

            _isGameOver = 1;
            setUserScore();


    }
    else {
        gameObject.gameStatus();
    }
    })

}

gameObject.createFigure = function () {

    var _definedFigure = gameObject.defineFigure();
    gameObject[_definedFigure] = document.createElement('div');
    gameObject['transparentSquare'] = document.createElement('div');
    sizeFigure = getRandomInteger(15, 40);
    var randomTopMargin = getRandomInteger(0, gameZoneHeight-sizeFigure);
    var figurePath = gameZoneWidth+sizeFigure+50;

    $(function () {
        $(gameObject['transparentSquare']).css ({
            'position':'absolute',
            "width": sizeFigure + "px",
            "height": sizeFigure + "px",
            'top': randomTopMargin,
            'left': '-50px',
            'transition': 'transform 7s ease',
            'transform': 'translateX(' + figurePath +'px)',
        })
        $(gameObject[_definedFigure]).css ({
            'display': 'flex',
            'align-items': 'center',
            "width": sizeFigure + "px",
            "height": sizeFigure + "px",

        })
    })
    gameObject['transparentSquare'].className = 'transparent-square';
    gameObject['transparentSquare'].id = 'transparentSquare'
    gameObject[_definedFigure].className = 'transparent-square ' +_definedFigure;

    document.getElementById('_gameZone').appendChild(gameObject['transparentSquare']);
    document.getElementById('transparentSquare').appendChild(gameObject[_definedFigure]);

}

var userScores = [];
var setUserFinalScore = { };
var _isGameOver = 0;
function setUserScore() {

        if (_isGameOver == 1) {
        var settingfinalScore = scoresFinal;
        var userName = localStorage.getItem('USERNAME');

        setUserFinalScore['userName'] = userName;
        setUserFinalScore['userScores'] = settingfinalScore.toFixed(0);

        if(_.isNull(localStorage.getItem('userSCORES'))) {
            userScores.push(setUserFinalScore);
            userScores.sort();
            localStorage.setItem('userSCORES', JSON.stringify(userScores));
            _isGameOver = 0;
        }
        else {
            userScores = JSON.parse(localStorage.getItem('userSCORES'));
            userScores.push(setUserFinalScore);
            userScores.sort();

            localStorage.setItem('userSCORES', JSON.stringify(userScores));}
            _isGameOver = 0;


        }


}





