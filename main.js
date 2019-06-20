'use strict'
///variables
let date = new Date(),
    myMonth = date.getMonth(),
    myYear = date.getFullYear();



const displayedMonth = document.querySelector('.js-displayedMonth');
const container = document.querySelector('#main');

const events = {
    '2019-06-05': "Some test event"
};

initAll(myMonth, myYear);

function initAll(month, year) {
    generateCalendar(month, year);
    displayedMonth.innerHTML = setMonthAndYear(month, year);
}


function generateCalendar(month, year) {
    let calendar = '';

    let classForActualMonth = 'actual-cell';
    let classForNotActualMonth = 'another-cell';

    let firstWeekDayOfActualMonth = mondayFirst(new Date(year, month).getDay());
    let lastWeekDayOfActualMonth = mondayFirst(getLastDay(year, month).getDay());
    let lastDayOfActualMonth = getLastDay(year, month).getDate();

    let startIterator;
    let endIterator;
    let startDate;

    if (firstWeekDayOfActualMonth !== 0) {
        let previousMonth = month - 1;
        let previousYear = year;

        if (previousMonth < 0) {
            previousMonth = 11;
            previousYear -= 1;
        }

        let lastDayOfPreviosMonth = getLastDay(previousYear, previousMonth).getDate();

        startIterator = 0;
        endIterator = firstWeekDayOfActualMonth;
        startDate = lastDayOfPreviosMonth - firstWeekDayOfActualMonth + 1;

        calendar += generateMonthCells(classForNotActualMonth, previousYear, previousMonth, startIterator, endIterator, startDate)
    }

    startIterator = 1;
    startDate = 1;
    endIterator = lastDayOfActualMonth + 1;
    calendar += generateMonthCells(classForActualMonth, year, month, startIterator, endIterator, startDate)


    if (lastWeekDayOfActualMonth < 6) {
        let nextMonth = month + 1;
        if (nextMonth > 11) {
            nextMonth = 0;
            year += 1;
        }

        startIterator = lastWeekDayOfActualMonth;
        endIterator = 6;
        startDate = 1;

        calendar += generateMonthCells(classForNotActualMonth, year, nextMonth, startIterator, endIterator, startDate)
    }
    container.innerHTML = calendar;
}


function createACell(className, date, year, month) {
    if (`${date}`.length === 1) {
        date = "0" + date;
    }
    
    if (`${month}`.length === 1) {
        month = "0" + month;
    }
    
    let dataDay = `${year}-${month}-${date}`;
    let event = '';

    if (events.hasOwnProperty(dataDay)) {
        events[dataDay].split('---').map((item) => {
            event += `<p class='event'>${item}</p>`
        })
    }

    return `<div class="cell ${className}" data-day="${dataDay}">${date}${event}</div>`
}


function generateMonthCells(className, year, month, startIterator, endIterator, startDate) {
    let monthsCells = '';

    for (let i = startIterator, j = startDate; i < endIterator; i++, j++) {
        monthsCells += createACell(className, j, year, month + 1)
    }

    return monthsCells;
}

///Listeners
//назад
document.querySelector('.js-previousMonth').addEventListener('click', function () {
    myMonth -= 1;
    if (myMonth < 0) {
        myMonth = 11;
        myYear--;
    }
    initAll(myMonth, myYear);

})
//вперед
document.querySelector('.js-nextMonth').addEventListener('click', function () {
    myMonth += 1;
    if (myMonth > 11) {
        myMonth = 0;
        myYear++;
    }
    initAll(myMonth, myYear);

})
//сегодня
document.querySelector('.js-actualMonth').addEventListener('click', function () {
    myMonth = date.getMonth(),
        myYear = date.getFullYear();
    initAll(myMonth, myYear);

});


//добавление событий

let cellEvent;
let modal = document.querySelector('.js-modal-overlay');

container.addEventListener('click', function (e) {
    cellEvent = e.target;
console.log(modal);
    modal.classList.remove('close');
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.add('close');
        }
    })

    let event;

    let submitBtn = modal.querySelector('.btn[type="submit"]');
    let closeBtn = modal.querySelector('.btn[type="reset"]');
    closeBtn.addEventListener('click', function () {
        modal.classList.add('close');

    })

    let input = modal.querySelector('input');
    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        event = input.value;
        if (event) {
            if (events[cellEvent.closest('.cell').dataset.day]) {
                events[cellEvent.closest('.cell').dataset.day] += '---' + event
            } else {
                events[cellEvent.dataset.day] = event;
            }
            input.value = '';

            console.log(events)
            modal.classList.add('close');
            generateCalendar(myMonth, myYear);
        } else {
            modal.classList.add('close');
        }

    })
})

/////helpers

//неделя начинается с понедельника
function mondayFirst(weekDay) {
    return (weekDay === 0) ? weekDay = 6 : weekDay -= 1;
}

//отображение названия месяца и года

function setMonthAndYear(month, year) {
    let months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    let currentMonth = months[month];
    return `  ${currentMonth}, ${year}  `;
}

// последний день месяца
function getLastDay(year, month) {
    let date = new Date(year, month + 1, 0);
    return date;
}
