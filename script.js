var nlp = nlp_compromise;

var resultCellName = $('#result-names');
var resultCellNoun = $('#result-nouns');


//interface semantic-ui stuff :
//sidebar
$('#side-menu').on('click', function () {
    $('.ui.labeled.icon.sidebar')
        .sidebar('toggle');
});

//need can button
var needcanBTN = $('.needcan-btn');

needcanBTN.on('click', function () {
    needcanBTN.removeClass('active needcan-active');
    $(this).addClass('active needcan-active');
});

function checkNeedCanButton() {
    var result = $('.needcan-active').attr('id').split('-');
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
    var data = $('#inputData');
    resultCellName.empty();
    var result = nlp.text(data.val()).people();
    result.forEach(function (item, index, arr) {
        resultCellName.append(arr[index].firstName + ' - ');
    });
}

function processNouns() {
    var tags = [];
    var data = nlp.text($('#inputData').val());
    resultCellNoun.empty();
    var sentences = data.sentences;
    for (var i = 0; i < sentences.length; i++) {
        var terms = sentences[i].terms;
        for (var j = 0; j < terms.length; j++) {
            if (terms[j].tag == 'Noun') {
                resultCellNoun.append(terms[j].text + ' - ');
                tags.splice(j, 0, terms[j].text);
            }

            console.log('i ' + checkNeedCanButton() + ' ' + terms[j].text + " -> " + terms[j].tag);
        }
    }
}


function processData() {
    var username = $('#username').val();

    processNames();
    processNouns();


    var knob = new Knobject(username, checkNeedCanButton(), tags);
    console.log(knob);

}

