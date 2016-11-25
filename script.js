let nlp = nlp_compromise;

const resultCellName = $('#result-names');
const resultCellNoun = $('#result-nouns');


//interface semantic-ui stuff :
//sidebar
$('#side-menu').on('click', function () {
    $('.ui.labeled.icon.sidebar')
        .sidebar('toggle');
});

//need can button
const needcanBTN = $('.needcan-btn');

needcanBTN.on('click', function () {
    needcanBTN.removeClass('active needcan-active');
    $(this).addClass('active needcan-active');
});

function checkNeedCanButton() {
    let result = $('.needcan-active').attr('id').split('-');
    return result[1];
}


//knobject constructor
//placeholder
function Knobject(username, needcan, tags) {
    this.username = username;
    this.needcan = needcan;
    this.tags = tags;
}


//NLP stuff
function processNames() {
    let data = $('#inputData');
    resultCellName.empty();
    let result = nlp.text(data.val()).people();
    result.forEach(function (item, index, arr) {
        resultCellName.append(arr[index].firstName + ' - ');
    });
}

function processNouns() {
    let tags = [];
    let data = nlp.text($('#inputData').val());
    resultCellNoun.empty();
    let sentences = data.sentences;
    for (var i = 0; i < sentences.length; i++) {
        let terms = sentences[i].terms;
        for (var j = 0; j < terms.length; j++) {
            if (terms[j].tag == 'Noun') {
                tags.splice(j, 0, terms[j].text);
            }
        }
    }
    return tags;
}


function processData() {
    let username = $('#username').val();

    processNames();

    let knob = new Knobject(username, checkNeedCanButton(), processNouns());
    $('#result-print').html(printResults(knob.username, knob.needcan, knob.tags));
    console.log(knob);

}


//print results
function printResults(username, needType, tags) {
    return `<table class="ui celled table">
<tbody>
<tr>
<td>Username</td>
<td>${ username }</td>
</tr>
<tr>
<td>NEED/CAN</td>
<td>${ needType }</td>
</tr>
<tr>
<td>Tags</td>
<td>${ tags }</td>
</tr>
</tbody>
</table>`;
}

