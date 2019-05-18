const max_points = 40;
var table_min;
var table_max;
var level;
var count = 0;
var points = 0;
var strength = 0;
var state = 'ask';
var timer;
var icongrat = 0;

function get_table_min(){
    return parseInt(document.getElementById("table_min").value)
}

function get_table_max(){
    return parseInt(document.getElementById("table_max").value)
}

function get_level(){
    return parseInt(document.getElementById("level").value)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function toggle_display(element_id, display_type='block'){
    el_display = document.getElementById(element_id).style.display
    if (el_display == display_type){
        new_display = 'none';
    } else {
        new_display = display_type;
    }
    document.getElementById(element_id).style.display = new_display
}

function toggle_config(){
    toggle_display('change')
    toggle_display('config_detail')
}

function update_config(){
    table_min = get_table_min()
    table_max = get_table_max()
    level = get_level()
    document.getElementById("what").innerHTML = (
        `Learning the tables from <span class="var">${table_min}</span> `
        + `to <span class="var">${table_max}</span> with `
        + `level <span class="var">${level}</span>.`
    )
}

function start(){
    toggle_config();
    count = 0;
    points = 0;
    set_calculation();
}

function update_results(result, text, duration){
    inner = document.getElementById("tbody").innerHTML
    th_width = document.getElementById("th-strength").clientWidth
    arrow_width = 2 * 20  // why we have to double the width of the arrow :/
    gauge_level = Math.round(
        (th_width - arrow_width) * Math.min(strength, 100) / 100
    )
    inner = (
        `<tr>`
        + `<td>${count}</td>`
        + `<td class="${result}">${text}</td>`
        + `<td>${Math.round(duration)}</td>`
        + `<td class="td-strength">`
        + `    <div style="width:100%;position:relative;">`
        + `        <img class="arrow" style="left:${gauge_level}%" src="./arrow.png" />`
        + `    </div>`
        + `</td>`
        + `</tr>`
    ) + inner
    document.getElementById("tbody").innerHTML = inner

}

async function congrats(){
    if (icongrat >= 10) {
        toggle_display('congrats')
        await sleep(5000);
        toggle_display('congrats')
        icongrat = 0
    }
    icongrat += 1
}

function set_calculation(){
    table_min = parseInt(document.getElementById("table_min").value)
    table_max = parseInt(document.getElementById("table_max").value)
    x = table_min + Math.round((Math.random() * (table_max - table_min)))
    if (count <= 10){
        y = count
    } else if (count <= 20) {
        y = 20 - count
    } else if (count <= 25) {
        y = 2 * (count - 20)
    } else if (count <= 30) {
        y = 9 - (2 * (count - 26))
    } else {
        y = Math.round(Math.random() * 10)
    }

    document.getElementById("x").innerHTML = x
    document.getElementById("y").innerHTML = y

    document.getElementById("input").readOnly = false;
    document.getElementById("input").value = ''

    document.getElementById("input").focus();
    document.getElementById('check').style.display = 'inline'
    document.getElementById('next').style.display = 'none'

    timer = Date.now()
    state = 'ask'
    count += 1
};

function check_result(force=false){
    console.log(force)
    if (!force && event && event.which != 13 && event.keyCode != 13) {
        return true;
    }

    if (state == 'ask'){
        x = parseInt(document.getElementById("x").innerHTML)
        y = parseInt(document.getElementById("y").innerHTML)
        input = parseInt(document.getElementById("input").value)
        level = parseInt(document.getElementById("level").value)

        console.log(x)
        console.log(y)
        console.log(input)

        duration = (Date.now() - timer) / 1000
        if ( x * y == input) {
            full_points = 8 - level
            no_point = full_points * 2

            new_points = (
                Math.max(no_point - duration, 0)
                / (no_point - full_points)
            )

            result = 'pass'
            text = "Bravo!"

            console.log("New points: " + new_points)
            points = points + new_points

            congrats()

        } else {
            result = 'fail'
            points = points - 0.05 * level * points
        }



        text = `${x} x ${y} = ${x * y}`

        console.log('points: ' + points)
        strength = Math.min(Math.round(points * 100 / max_points))
        console.log('strength: ' + strength)

        update_results(result, text, duration)
        document.getElementById("input").readOnly = true;
        state = 'answer'
    } else {
        set_calculation();
        document.getElementById("input").focus();
        state = 'ask'
    }
    toggle_display('check', 'inline')
    toggle_display('next', 'inline')

};

update_config();
set_calculation();

