var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

let table = game.create_table();

let game = {
    //#region variables
    count_rows: 10,
    count_collums: 10,
    min_value_cell: 1,
    max_value_cell: 0,
    sum_cells: 0,
    rectColors: ['#ffefe0',
        '#fdcb9e', '#fdcb9e',
        '#00b7c2', '#00b7c2',
        '#0f4c75', '#0f4c75',
        '#1b262c', '#1b262c'
    ],
    score: document.getElementById('score'),
    //#endregion

    //#region functions
    create_table: () => {
        table = [];
        for (let i = 0; i < game.count_collums; i++) {
            table[i] = [];
        }
        return table;
    },
    recording_table_rand_nums: (min, max) => {
        for (let i = 0; i < game.count_rows; i++) {
            for (let j = 0; j < game.count_collums; j++) {
                game[i][j] = game.getRandomInt(min, max);
            }
        }
    },
    draw_table: () => {
        for (let i = 0; i < game.count_rows; i++) {
            for (let j = 0; j < game.count_collums; j++) {
                draw_cell(i, j);
                draw_text_on_cell(i, j);
            }
        }
    },
    draw_cell: () => {
        ctx.fillStyle = rectColors[game[x][y]];
        ctx.fillRect(x * 40, y * 40, 40, 40);
    },
    draw_text_on_cell: () => {
        let text = game[x][y];
        if (text == 0) return;
        ctx.fillStyle = 'white';
        ctx.font = "30px Arial";
        ctx.fillText(text, x * 40 + 10, y * 40 + 30);
    },
    check_click: (event) => {
        let x = Math.floor(event.offsetX / 40);
        let y = Math.floor(event.offsetY / 40);
        console.log(`click on cell x=${x},y=${y}`);

        if (game[x][y] == 0) return;
        let flag;

        for (let i = x - 1; i < x + 2; i++) {
            for (let j = y - 1; j < y + 2; j++) {
                if ((i >= 0 && i <= 9 && j >= 0 && j <= 9))
                    if (game[i][j] > 0 && (i != x || j != y)) {
                        flag = true;
                        game[i][j] -= 1;
                    }
            }
        }
        if (flag)
            game[x][y] -= 1;

        calcutaled_sum_cells();
        score.innerHTML = `score:${sum_cells}`;
        game.draw_table();
    },
    calcutaled_sum_cells: () => {
        game.sum_cells = 0;
        for (let i = 0; i < count_rows; i++)
            for (let j = 0; j < count_collums; j++)
                game.sum_cells += game[i][j];
    },
    refresh_score: () => {
        score.innerHTML = `score:${sum_cells}`;
    },
    getRandomInt: (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        //#endregion
};

//#region events
document.getElementById('btn_restart').addEventListener('click', function() {
    game.recording_table_rand_nums(1, game.max_value_cell);
    game.draw();
});

canvas.addEventListener('click', function(event) {
    game.check_click(event);
});

document.getElementById('btn_new_game').addEventListener('click', () => {
    document.getElementById('pre_game').style.display = 'block';
    document.getElementById('game').style.display = 'none';
});

document.getElementById('btn_lvl_easy').addEventListener('click', () => {
    document.getElementById('pre_game').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    game.max_value_cell = 5;
    game.recording_table_rand_nums(1, game.max_value_cell);
    game.draw();
});
document.getElementById('btn_lvl_medium').addEventListener('click', () => {
    document.getElementById('pre_game').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    game.max_value_cell = 7;
    game.recording_table_rand_nums(1, game.max_value_cell);
    game.draw();
});
document.getElementById('btn_lvl_hard').addEventListener('click', () => {
    document.getElementById('pre_game').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    game.max_value_cell = 9;
    game.recording_table_rand_nums(1, game.max_value_cell);
    game.draw();
});
//#endregion