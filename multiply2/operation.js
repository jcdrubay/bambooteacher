const max_points = 40;
var x1;
var x2;
var y1;
var y2;
var level;
var count = 0;
var points = 0;
var strength = 0;
var state = 'ask';
var timer;
var icongrat = 0;

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
    level = get_level()
    document.getElementById("what").innerHTML = (
        `Learning with level <span class="var">${level}</span>.`
    )
}

function start(){
    toggle_config();
    count = 0;
    points = 0;
    set_calculation();
}

function update_results(result, text, correctness, duration){
    inner = document.getElementById("tbody").innerHTML
    th_width = document.getElementById("th-strength").clientWidth
    arrow_width = 20
    gauge_level = Math.round(
        (th_width - arrow_width) * Math.min(strength, 100) / 100
    )
    inner = (
        `<tr>`
        + `<td>${count}</td>`
        + `<td class="${result}">${text}</td>`
        + `<td>${correctness} of 12</td>`
        + `<td>${Math.round(duration)}</td>`
        + `<td class="td-strength">`
        + `    <div style="width:100%;position:relative;">`
        + `        <img class="arrow" style="left:${gauge_level}%" src="../img/arrow.png" />`
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

function reset_input_by_id(elID){
    console.log(`reset_input_by_id for elID: ${elID}`)
    document.getElementById(elID).readOnly = false;
    document.getElementById(elID).value = '';
    document.getElementById(elID).className = '';
}

function get_inputs(){
    inputs = [
        'a1', 'a2', 'a3', 'a4',
        'b1', 'b2', 'b3', 'b4',
        'c1', 'c2', 'c3', 'c4'
    ]
    return inputs
}


function set_calculation(){

    level = get_level()

    x1 = Math.round(Math.random() * 9)
    if (level >= 4){
        x2 = Math.round(Math.random() * 9)
    } else if (level == 3) {
        x2 = 2
    } else if (level == 2) {
        x2 = 1
    } else {
        x2 = 0
    }
    y1 = Math.round(Math.random() * 9)
    y2 = Math.round(Math.random() * 9)

    tbody = `
    <tbody>
    <tr class="retenues">
        <td><input value="0" type="number" min="0" max="9" tabindex="4"/></td>
        <td><input value="0" type="number" min="0" max="9" tabindex="4"/></td>
        <td><input value="0" type="number" min="0" max="9" tabindex="4"/></td>
        <td><input value="0" type="number" min="0" max="9" tabindex="4"/></td>
        <td></td>
    </tr>

    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>${x2}</td>
        <td>${x1}</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td>x</td>
        <td>${y2}</td>
        <td>${y1}</td>
    </tr>
    <tr class="separator"><td colspan="5">&nbsp;</td></tr>
    <tr>
        <td></td>
        <td><input id="a4" value="0" type="number" min="0" max="9" tabindex="4"/>
        <td><input id="a3" value="0" type="number" min="0" max="9" tabindex="3"/>
        <td><input id="a2" value="0" type="number" min="0" max="9" tabindex="2"/>
        <td><input id="a1" value="0" type="number" min="0" max="9" tabindex="1"/>
    </tr>
    <tr>
        <td>+</td>
        <td><input id="b4" value="0" type="number" min="0" max="9" tabindex="8"/>
        <td><input id="b3" value="0" type="number" min="0" max="9" tabindex="7"/>
        <td><input id="b2" value="0" type="number" min="0" max="9" tabindex="6"/>
        <td><input id="b1" value="0" type="number" min="0" max="9" tabindex="5"/>
    </tr>
    <tr class="separator"><td colspan="5">&nbsp;</td></tr>
    <tr>
        <td>=</td>
        <td><input id="c4" value="0" type="number" min="0" max="9" tabindex="12"/>
        <td><input id="c3" value="0" type="number" min="0" max="9" tabindex="11"/>
        <td><input id="c2" value="0" type="number" min="0" max="9" tabindex="10"/>
        <td><input id="c1" value="0" type="number" min="0" max="9" tabindex="9"/>
    </tr>
    </tbody>
    `

    document.getElementById('operation_table').innerHTML = tbody

    inputs = get_inputs()
    for (i in inputs){
        reset_input_by_id(inputs[i])
    }

    document.getElementById("a1").focus();

    document.getElementById('check').style.display = 'inline'
    document.getElementById('next').style.display = 'none'

    timer = Date.now()
    state = 'ask'
    count += 1
};


function set_result_class(input_id, expected){
    el = document.getElementById(input_id)
    input = parseInt(el.value) || 0
    if (input == expected){
        el.className = "pass";
        correctness += 1
    } else {
        el.className = "fail";
    }
}

function check_result(force=false){
    console.log(force)
    if (!force && event && event.which != 13 && event.keyCode != 13) {
        return true;
    }

    if (state == 'ask'){
        a1 = parseInt(document.getElementById("a1").value)
        a2 = parseInt(document.getElementById("a2").value)
        a3 = parseInt(document.getElementById("a3").value)
        a4 = parseInt(document.getElementById("a4").value)
        b1 = parseInt(document.getElementById("b1").value)
        b2 = parseInt(document.getElementById("b2").value)
        b3 = parseInt(document.getElementById("b3").value)
        b4 = parseInt(document.getElementById("b4").value)
        c1 = parseInt(document.getElementById("c1").value) || 0
        c2 = parseInt(document.getElementById("c2").value) || 0
        c3 = parseInt(document.getElementById("c3").value) || 0
        c4 = parseInt(document.getElementById("c4").value) || 0


        duration = (Date.now() - timer) / 1000  // per sec


        x = x1 + 10 * x2
        y = y1 + 10 * y2
        expected = x * y
        found = c1 + c2 * 10 + c3 * 100 + c4 * 1000

        if ( expected == found) {

            new_points = (Math.round(10 * Math.max(600 - duration, 0) / (600)))

            result = 'pass'
            text = "Bravo!"

            console.log("New points: " + new_points)
            points = points + new_points

            congrats()
            correctness = 12
            for (i in inputs){
                document.getElementById(inputs[i]).className = "pass";
            }

        } else {
            console.log('fail')
            correctness = 0
            set_result_class('a1', (y1 * x) % 10)
            set_result_class('a2', Math.floor((y1 * x) / 10) % 10)
            set_result_class('a3', Math.floor((y1 * x) / 100) % 10)
            set_result_class('a4', 0)
            set_result_class('b1', 0)
            set_result_class('b2', (y2 * x) % 10)
            set_result_class('b3', Math.floor((y2 * x) / 10) % 10)
            set_result_class('b4', Math.floor((y2 * x) / 100) % 10)
            set_result_class('c1', (y * x) % 10)
            set_result_class('c2', Math.floor((y * x) / 10) % 10)
            set_result_class('c3', Math.floor((y * x) / 100) % 10)
            set_result_class('c4', Math.floor((y * x) / 1000) % 10)

            result = 'fail'
            points = points - 0.05 * level * points
        }

        text = `${x} x ${y} = ${x * y}`

        console.log('points: ' + points)
        strength = Math.min(Math.round(points * 100 / max_points))
        console.log('strength: ' + strength)


        update_results(result, text, correctness, duration)

        inputs = get_inputs()
        for (i in inputs){
            document.getElementById(inputs[i]).readOnly = true;
        }
        state = 'answer'
        toggle_display('check', 'inline')
        toggle_display('next', 'inline')
    } else {
        set_calculation();
        document.getElementById("a1").focus();
        state = 'ask'
    }


};

update_config();
set_calculation();

