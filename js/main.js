//basic functionality section

const main = document.querySelector('.main');
const casesTable = document.querySelector('.cases table');
const caseAddButton = document.querySelector('.case-add');
const caseDeleteButton = document.querySelector('.case-delete');

const $ = {};

const testRestFilters = () => [{id: 1, name: 'Поликлинический'}, {id: 2, name: 'Госпитализации'}, {id: 3, name: 'Неотложной помощи'}];
const testValidations = () => [{validationLevel: "error", validationText:"Ошибка!!!"},{validationLevel: undefined, validationText: "Дата закрытия случая не может быть меньше даты открытия!"},{validationLevel: "warning", validationText: "В Вашем МО не оказывается неотложная помощь!"},{validationLevel: "error", validationText: "Дата открытия случая не может быть больше текущей даты!"}];
const testCasesData = () => {
    return [
    {uid: "1", caseType: "Поликлинический", openDate: "01.05.2020", closeDate: "20.05.2020", patientFio: "Васин Вася Васянович", patientBd: "01.01.1990", comment: "блаблаблаблабла"},
    {uid: "2", caseType: "Госпитализации", openDate: "01.01.2020", closeDate: "открыт", patientFio: "Иванов Иван Иванович", patientBd: "21.07.1989", comment: ""},
    {uid: "3", caseType: "Поликлинический", openDate: "03.03.2020", closeDate: "20.05.2020", patientFio: "Петров Петр Петрович", patientBd: "11.03.1965", comment: ""},
    {uid: "4", caseType: "Госпитализации", openDate: "25.05.2020", closeDate: "20.05.2020", patientFio: "Фроскин Фроска Молодецович", patientBd: "23.07.1992", comment: "ваще крутой дядька он"},
    {uid: "5", caseType: "Скорой помощи", openDate: "06.05.2020", closeDate: "открыт", patientFio: "Габеллян Арменка", patientBd: "14.03.1995", comment: ""},
    {uid: "1", caseType: "Поликлинический", openDate: "01.05.2020", closeDate: "20.05.2020", patientFio: "Васин Вася Васянович", patientBd: "01.01.1990", comment: "блаблаблаблабла"},
    {uid: "2", caseType: "Госпитализации", openDate: "01.01.2020", closeDate: "открыт", patientFio: "Иванов Иван Иванович", patientBd: "21.07.1989", comment: ""},
    {uid: "3", caseType: "Поликлинический", openDate: "03.03.2020", closeDate: "20.05.2020", patientFio: "Петров Петр Петрович", patientBd: "11.03.1965", comment: ""}
    ];
}

//end of basic functionality section

/////////////////////////////////////////////////////////////////////////////////////

//filters section

$.filters = () => {
    let str = '';
    testRestFilters().forEach(element => str += `<option value="${element.id}">${element.name}</option>
            `);
    return `
<div class="filters">
    <div class="filter-tabs">
        <label for="casetype">Тип случая:</label>
        <select class="filter case-type" name="casetype" id="casetype">
            <option label=" " value=""></option>
            ${str}
        </select>

        <label for="opendate">Дата открытия:</label>
        <input class="filter open-date" type="date" name="opendate" id="opendate">
        <div class="filter-buttons">
            <button class="filter-button do-filter">Применить фильтры</button>
            <button class="filter-button cancel-filter">Сбросить фильтры</button>
        </div>
    </div>
</div> 
`;
}

main.insertAdjacentHTML('afterbegin', $.filters());

const doFilter = document.querySelector('.do-filter');
const cancelFilter = document.querySelector('.cancel-filter');
const caseTypeFilter = document.querySelector('.case-type');
const openDateFilter = document.querySelector('.open-date');

doFilter.addEventListener('click', e => console.log(caseTypeFilter.value, openDateFilter.value));

cancelFilter.addEventListener('click', e => {
    caseTypeFilter.value = '';
    openDateFilter.value = '';
});

//end of filters section

/////////////////////////////////////////////////////////////////////////////////////

//validation section

const validationWrapper = document.querySelector('.validation-wrapper');

const validationIsSet = v => v.validationLevel != undefined && v.validationLevel != null && v.validationLevel != '' && v.validationText != undefined && v.validationText != null && v.validationText != '';

const wrapValidation = v => {
    return validationIsSet(v) ?
`
<div class="validation-item ${v.validationLevel}">
    <p>${v.validationText}</p>
</div>`
: ''
;
}

const getAllValidations = () => {
    let res = '';
    testValidations().forEach(v => res += wrapValidation(v));
    return res;
}

const validate = () => {
    //TODO: rework with real data
    validationWrapper.textContent = '';
    validationWrapper.insertAdjacentHTML('afterbegin', getAllValidations());
    validationWrapper.classList.remove('hide');
    setTimeout(() => validationWrapper.classList.add('hide'), 5000);
}

//end of validation section

/////////////////////////////////////////////////////////////////////////////////////

//modal section

$.modal = () => {

    const _createModal = () => {
        let str = '';
        testRestFilters().forEach(element => str += `<option value="${element.id}">${element.name}</option>
            `);
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.classList.add('hide');
        modal.setAttribute('data-close', true);
        modal.insertAdjacentHTML('afterbegin', `
<div class="modal__block">
    <h2 class="modal__header">Добавить запись</h2>
    <div class="modal__content">
        <form class="modal__submit">

            <label>
                <span>Вид случая:</span>
                <select name="typeCase" required>
                    ${str}
                </select>
            </label>
            
            <label>
                <span>Дата открытия:</span>
                <input name="openDate" type="date" required>
            </label>
            
            <label>
                <span>Дата закрытия:</span>
                <input name="closeDate" type="date">
            </label>

            <label>
                <span>Пациент:</span>
                <input class="patient-fio" name="nameItem" type="text" required>
            </label>					

            <label>
                <span>Дата рождения:</span>
                <input name="birthDate" type="date" required>
            </label>

            <label>
                <span>Комментарий:</span>
                <textarea name="descriptionItem" maxlength="3000"></textarea>
            </label>

            <div class="modal__btn-block">
                <button class="btn modal__btn-submit">Сохранить</button>
            </div>

        </form>
    </div>
    <button class="modal__close" data-close="true">&times;</button>
</div>
`
        );
        document.body.appendChild(modal);
        return modal;
    }

    const $modal = _createModal();
    let destroyed = false;

    const modal = {
        open() {
            !destroyed && $modal.classList.remove('hide');
        },
        close() {
            $modal.classList.add('hide');
        },
        destroy() {
            $modal.parentNode.removeChild($modal);
            $modal.removeEventListener('click', listener);
            destroyed = true;
        }
    };

    const listener = e => {
        if (e.target.dataset.close) {
            modal.close();
        }
    }

    $modal.addEventListener('click', listener);

    return modal;
}

const modal = $.modal();

//end of modal section

////////////////////////////////////////////////////////////////////////////////////

//table section

const renderTable = (options, data) => {
    let res = `
<tr>
`;
    options.forEach(col => res += `<th align="center" ${col.colWidth != undefined ? 'width="'+col.colWidth+'"' : ''}>${col.colName}</th>
`);
    res += `
</tr>
`;
    data.forEach(element => {
        res += `
<tr>
    <td align="center">${element.uid}</td>
    <td align="center">${element.caseType}</td>
    <td align="center">${element.openDate}</td>
    <td align="center">${element.closeDate}</td>
    <td align="center">${element.patientFio}</td>
    <td align="center">${element.patientBd}</td>
    <td align="center">${element.comment}</td>
</tr>
`});
    console.log(res);
    return res;
}


const renderCasesTable = data => {
    const casesOptions = [
        {colWidth: "10%", colName: "Номер случая"},
        {colWidth: "15%", colName: "Вид случая"},
        {colWidth: "10%", colName: "Дата открытия"},
        {colWidth: "10%", colName: "Дата закрытия"},
        {colWidth: "20%", colName: "ФИО пациента"},
        {colWidth: "10%", colName: "Дата рождения"},
        {colName: "Комментарий"}
    ];

    return renderTable(casesOptions, data);
}

casesTable.insertAdjacentHTML('afterbegin', renderCasesTable(testCasesData()));
//end of table section

///////////////////////////////////////////////////////////////////////////////////

//action section

caseAddButton.addEventListener('click', e => {
    console.log('Case adding...');
    modal.open();
})

caseDeleteButton.addEventListener('click', e => {
    console.log('Case deleting...');
})

//end of action section