var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;
//#region var
let count_rows = 10,
    count_collums = 10;

let max_value_cell;

let rectColors = ['#ffefe0',
    '#fdcb9e', '#fdcb9e',
    '#00b7c2', '#00b7c2',
    '#0f4c75', '#0f4c75',
    '#1b262c', '#1b262c'
];

let table = create_table();

let sum_cells = 0;
let start_sum_cells = 0;

let score = document.getElementById('score');

let history_json = [];
//#endregion


//#region events
canvas.addEventListener('click', function(event) {
    check_click(event);
});


document.getElementById('btn_new_game').addEventListener('click', () => {
    document.getElementById('pre_game').style.display = 'block';
    document.getElementById('game').style.display = 'none';
});

document.getElementById('btn_restart').addEventListener('click', function() {
    table = JSON.parse(history_json[0]);
    history_json = [];
    update_history_json();
    refresh_progress();
    draw_table();
});

document.getElementById('btn_backstep').addEventListener('click', () => back_step());


document.getElementById('btn_lvl_easy').addEventListener('click', () => game_start('easy'));
document.getElementById('btn_lvl_medium').addEventListener('click', () => game_start('medium'));
document.getElementById('btn_lvl_hard').addEventListener('click', () => game_start('hard'));
//#endregion



//#region functions
function game_start(mode) {
    max_value_cell = mode == 'easy' ? 5 : mode == 'medium' ? 7 : mode == 'hard' ? 9 : 1;
    document.getElementById('pre_game').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    history_json = [];
    recording_table(1, max_value_cell);
    calcutaled_sum_cells();
    start_sum_cells = sum_cells;
    refresh_progress();
    update_history_json();
    draw_table();
}

function game_is_over() {
    calcutaled_sum_cells();
    if (sum_cells == 0) {
        ctx.fillStyle = 'rgba(35, 95, 15, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        for (let i = 0; i < count_rows; i++) {
            for (let j = 0; j < count_collums; j++)
                if (table[i][j] != 0) {
                    for (let n = i - 1; n < i + 2; n++) {
                        for (let m = j - 1; m < j + 2; m++) {
                            if (n >= 0 && n <= 9 && m >= 0 && m <= 9) {
                                if (table[n][m] != 0 && (n != i || m != j)) {
                                    return;
                                }
                            }
                        }
                    }
                }
        }
        ctx.fillStyle = 'rgba(115, 95, 15, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        score.innerHTML = 'u lose:('
    }
}

function update_history_json() {
    history_json.push(JSON.stringify(table));
}

function back_step() {
    console.log('back_step');
    if (history_json.length > 1) {
        console.log('back_access');
        history_json.pop();
        let temp_table = JSON.parse(history_json[history_json.length - 1]);
        table = temp_table;
        refresh_progress();
        draw_table();
        game_is_over();
    }
}

function create_table() {
    let table = []
    for (let i = 0; i < count_collums; i++) {
        table[i] = [];
    }
    return table;
}

function draw_table() {
    for (let i = 0; i < count_rows; i++) {
        for (let j = 0; j < count_collums; j++) {
            draw_cell(i, j);
            draw_text_on_cell(i, j);
        }
    }
}

function recording_table_rand_nums(min, max) {
    for (let i = 0; i < count_rows; i++) {
        for (let j = 0; j < count_collums; j++) {
            table[i][j] = getRandomInt(min, max);
        }
    }
}

function recording_table(min, max) {
    for (let i = 0; i < count_rows; i++)
        for (let j = 0; j < count_collums; j++)
            table[i][j] = 1;

    for (let n = 0; n < 15; n++) {
        let x = getRandomInt(0, 10);
        let y = getRandomInt(0, 10);
        for (let i = x - 1; i < x + 2; i++) {
            for (let j = y - 1; j < y + 2; j++) {
                if ((i >= 0 && i <= 9 && j >= 0 && j <= 9))
                    if (table[i][j] < max - 1)
                        table[i][j]++;
            }
        }
    }
}

function draw_cell(x, y) {
    ctx.fillStyle = rectColors[table[x][y]];
    ctx.fillRect(x * 40, y * 40, 40, 40);
}

function draw_text_on_cell(x, y) {
    let text = table[x][y];
    if (text == 0) return;
    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText(text, x * 40 + 10, y * 40 + 30);
}

function check_click(event) {
    let x = Math.floor(event.offsetX / 40);
    let y = Math.floor(event.offsetY / 40);
    console.log(`click on cell x=${x},y=${y}`);

    if (table[x][y] == 0) return;
    let flag;

    for (let i = x - 1; i < x + 2; i++) {
        for (let j = y - 1; j < y + 2; j++) {
            if ((i >= 0 && i <= 9 && j >= 0 && j <= 9))
                if (table[i][j] > 0 && (i != x || j != y)) {
                    flag = true;
                    table[i][j] -= 1;
                }
        }
    }
    if (flag) {
        table[x][y] -= 1;
        update_history_json();
    }

    refresh_progress();
    draw_table();
    game_is_over();
}

function calcutaled_sum_cells() {
    sum_cells = 0;
    for (let i = 0; i < count_rows; i++)
        for (let j = 0; j < count_collums; j++)
            sum_cells += table[i][j];
}

function refresh_progress() {
    calcutaled_sum_cells();
    score.innerHTML = `progress: ${get_progress_game_now()}%`;
}

function get_progress_game_now() {
    return Math.round((start_sum_cells - sum_cells) / start_sum_cells * 100);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//#endregion