var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

let game = {
    init: () => {
        events.init();
        table.create_table();
        game.history_json = [];
        game.score_html_el = document.getElementById('score');
    },
    start: (mode) => {
        table.max_value_cell = mode == 'easy' ? 5 : mode == 'medium' ? 7 : mode == 'hard' ? 9 : 1;
        document.getElementById('pre_game').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        game.history_json = [];
        table.recording_table_rand_nums(1, table.max_value_cell);
        table.calcutaled_sum_cells();
        table.start_sum_cells = table.sum_cells;
        game.refresh_progress();
        game.update_history_json();
        table.draw_table();
    },
    game_is_over: () => {
        table.calcutaled_sum_cells();
        if (table.sum_cells == 0) {
            ctx.fillStyle = 'rgba(35, 95, 15, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            game.score_html_el.innerHTML = 'u win :)'
        } else {
            for (let i = 0; i < table.count_rows; i++) {
                for (let j = 0; j < table.count_collums; j++)
                    if (table.array[i][j] != 0) {
                        for (let n = i - 1; n < i + 2; n++) {
                            for (let m = j - 1; m < j + 2; m++) {
                                if (n >= 0 && n <= 9 && m >= 0 && m <= 9) {
                                    if (table.array[n][m] != 0 && (n != i || m != j)) {
                                        return;
                                    }
                                }
                            }
                        }
                    }
            }
            ctx.fillStyle = 'rgba(115, 95, 15, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            game.score_html_el.innerHTML = 'u lose:('
        }
    },
    update_history_json: () => {
        game.history_json.push(JSON.stringify(table.array));
    },
    back_step: () => {
        console.log('back_step');
        if (game.history_json.length > 1) {
            game.history_json.pop();
            let temp_table = JSON.parse(
                game.history_json[game.history_json.length - 1]);
            table.array = temp_table;
            game.refresh_progress();
            table.draw_table();
            game.game_is_over();
        }
    },
    refresh_progress: () => {
        table.calcutaled_sum_cells();
        game.score_html_el.innerHTML = `progress: ${game.get_progress_game_now()}%`;
    },
    get_progress_game_now: () => {
        return Math.round((table.start_sum_cells - table.sum_cells) / table.start_sum_cells * 100);
    }
};

let table = {
    count_rows: 10,
    count_collums: 10,
    rectColors: ['#ffefe0',
        '#fdcb9e', '#fdcb9e',
        '#00b7c2', '#00b7c2',
        '#0f4c75', '#0f4c75',
        '#1b262c', '#1b262c'
    ],
    create_table: () => {
        table.array = [];
        for (let i = 0; i < table.count_collums; i++) {
            table.array[i] = [];
        }
    },
    draw_table: () => {
        for (let i = 0; i < table.count_rows; i++) {
            for (let j = 0; j < table.count_collums; j++) {
                table.draw_cell(i, j);
                table.draw_text_on_cell(i, j);
            }
        }
    },
    draw_cell: (x, y) => {
        ctx.fillStyle = table.rectColors[table.array[x][y]];
        ctx.fillRect(x * 40, y * 40, 40, 40);
    },
    draw_text_on_cell: (x, y) => {
        let text = table.array[x][y];
        if (text == 0) return;
        ctx.fillStyle = 'white';
        ctx.font = "30px Arial";
        ctx.fillText(text, x * 40 + 10, y * 40 + 30);
    },
    recording_table_rand_nums: (min, max) => {
        do {
            for (let i = 0; i < table.count_rows; i++) {
                for (let j = 0; j < table.count_collums; j++) {
                    table.array[i][j] = table.getRandomInt(min, max);
                }
            }
        }
        while (!table.check_change_win())


    },
    check_change_win: () => {
        for (let x = 0; x < table.count_rows; x++) {
            for (let y = 0; y < table.count_collums; y++) {
                let center_cell = table.array[x][y];
                let count_cell_less_center_cell = 0;
                let count_cell_checked = 0;
                for (let i = x - 1; i < x + 2; i++) {
                    for (let j = y - 1; j < y + 2; j++) {
                        if (i >= 0 && i <= 9 && j >= 0 && j <= 9 && (i != x || y != j)) {
                            count_cell_checked++;
                            if (center_cell > table.array[i][j])
                                count_cell_less_center_cell++;
                        }
                    }
                }
                if (count_cell_less_center_cell == count_cell_checked) {
                    console.log('нереальна')
                    return false;
                }

            }
        }
        return true;
    },
    recording_table: (min, max) => {
        for (let i = 0; i < table.count_rows; i++)
            for (let j = 0; j < table.count_collums; j++)
                table.array[i][j] = 1;

        for (let n = 0; n < 20; n++) {
            let x = table.getRandomInt(0, 10);
            let y = table.getRandomInt(0, 10);
            console.log(x, y);
            for (let i = x - 1; i < x + 2; i++) {
                for (let j = y - 1; j < y + 2; j++) {
                    if ((i >= 0 && i <= 9 && j >= 0 && j <= 9))
                        if (table.array[i][j] < max - 1)
                            table.array[i][j]++;
                }
            }
        }
    },
    check_click: (event) => {
        let x = Math.floor(event.offsetX / 40);
        let y = Math.floor(event.offsetY / 40);
        console.log(`click on cell x=${x},y=${y}`);

        if (table.array[x][y] == 0) return;
        let flag;

        for (let i = x - 1; i < x + 2; i++) {
            for (let j = y - 1; j < y + 2; j++) {
                if ((i >= 0 && i <= 9 && j >= 0 && j <= 9))
                    if (table.array[i][j] > 0 && (i != x || j != y)) {
                        flag = true;
                        table.array[i][j] -= 1;
                    }
            }
        }
        if (flag) {
            table.array[x][y] -= 1;
            game.update_history_json();
        }
        game.refresh_progress();
        table.draw_table();
        game.game_is_over();
    },
    calcutaled_sum_cells: () => {
        table.sum_cells = 0;
        for (let i = 0; i < table.count_rows; i++)
            for (let j = 0; j < table.count_collums; j++)
                table.sum_cells += table.array[i][j];
    },
    getRandomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }
};


let events = {
    init: () => {
        canvas.addEventListener('click', (event) => {
            table.check_click(event);
        });

        document.getElementById('btn_lvl_easy').addEventListener('click', () => game.start('easy'));
        document.getElementById('btn_lvl_medium').addEventListener('click', () => game.start('medium'));
        document.getElementById('btn_lvl_hard').addEventListener('click', () => game.start('hard'));


        document.getElementById('btn_new_game').addEventListener('click', () => {
            document.getElementById('pre_game').style.display = 'block';
            document.getElementById('game').style.display = 'none';
        });
        document.getElementById('btn_restart').addEventListener('click', () => {
            table.array = JSON.parse(game.history_json[0]);
            game.history_json = [];
            game.update_history_json();
            game.refresh_progress();
            table.draw_table();
        });
        document.getElementById('btn_backstep').addEventListener('click', () => game.back_step());
    }
}

game.init();