//basic functionality section
const BASE_URL = 'http://localhost:4747/index.php?';
const main = document.querySelector('.main');
const caseAddButton = document.querySelector('.case-add');
const caseDeleteButton = document.querySelector('.case-delete');
const casesTable = document.querySelector('.cases table')
const $ = {};

const commonRest = async (controller, method) => {
    const res = await fetch(`${BASE_URL}c=${controller}&m=${method}`);
    if (res.ok) {
        return res;            
    } else {
        throw new Error(`Cannot get data from ${BASE_URL}`);
    }
}

const testRestFilters = () => [{id: 1, name: 'Поликлинический'}, {id: 2, name: 'Госпитализации'}, {id: 3, name: 'Неотложной помощи'}, {id: 999, name: 'Еще какой-нить'}];
//end of basic functionality section

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//filters section
$.filters = () => {
    let str = "";
    testRestFilters().forEach(element => str += `<option value="${element.id}">${element.name}</option>
            `);
    console.log('Filters successfully loaded.');
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

main.insertAdjacentHTML('afterbegin',$.filters());

const doFilter = document.querySelector('.do-filter');
const cancelFilter = document.querySelector('.cancel-filter');
const caseTypeFilter = document.querySelector('.case-type');
const openDateFilter = document.querySelector('.open-date');

//TODO: rewrite test realization below
doFilter.addEventListener('click', e => console.log(caseTypeFilter.value, openDateFilter.value));

cancelFilter.addEventListener('click', e => {
    caseTypeFilter.value = "";
    openDateFilter.value = "";
})
//end of filters section

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//validation section
const validationWrapper = document.querySelector('.validation-wrapper');

//TODO: rewrite test realization below
const testValidations = () => [{validationLevel: undefined, validationText:""},{validationLevel: "error", validationText: "Дата закрытия случая не может быть меньше даты открытия!"},{validationLevel: "warning", validationText: "В Вашем МО не оказывается неотложная помощь!"},{validationLevel: "error", validationText: "Дата открытия случая не может быть больше текущей даты!"}];

const validationIsSet = v => v.validationLevel != undefined && v.validationLevel != null && v.validationLevel != '' && v.validationText != undefined && v.validationText != null && v.validationText != '';

const wrapValidation = v => {
    return validationIsSet(v) ?
`
<div class="validation-item ${v.validationLevel}">
    <p>${v.validationLevel = "error" ? '&#x2620;' : '&#128078;'}   ${v.validationText}</p>
</div>`
: '';
}

const allValidations = () => {
    let res = '';
    testValidations().forEach(v => res += wrapValidation(v));
    return res;
}

const validate = () => {
    validationWrapper.textContent = '';
    validationWrapper.insertAdjacentHTML('afterbegin', allValidations());
    validationWrapper.classList.remove('hide');
    setTimeout(() => {validationWrapper.classList.add('hide');}, 5000);
}

validate();
//end of validation section

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//modal section
$.modal = () => {

    function _createModal() {
        let str = "";
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
                <select name="typeCase">
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
        `);
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
console.log('Modal successfully loaded.');
//end of modal section

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//table section
const renderTable = (options, data) => {
    let result = `
<tr>
`;
    options.forEach(col => result += `<th align="center" ${col.colWidth != undefined ? 'width="'+col.colWidth+'"' : ''}>${col.colName}</th>
`);
    result += `
</tr>
`;
    data.forEach(element => {
        result += `
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
        console.log(result);
    return result;
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

const testCasesData = [
    {uid: "1", caseType: "Поликлинический", openDate: "01.05.2020", closeDate: "20.05.2020", patientFio: "Васин Вася Васянович", patientBd: "01.01.1990", comment: "блаблаблаблабла"},
    {uid: "2", caseType: "Госпитализации", openDate: "01.01.2020", closeDate: "открыт", patientFio: "Иванов Иван Иванович", patientBd: "21.07.1989", comment: ""},
    {uid: "3", caseType: "Поликлинический", openDate: "03.03.2020", closeDate: "20.05.2020", patientFio: "Петров Петр Петрович", patientBd: "11.03.1965", comment: ""},
    {uid: "4", caseType: "Госпитализации", openDate: "25.05.2020", closeDate: "20.05.2020", patientFio: "Фроскин Фроска Молодецович", patientBd: "23.07.1992", comment: "ваще крутой дядька он"},
    {uid: "5", caseType: "Скорой помощи", openDate: "06.05.2020", closeDate: "открыт", patientFio: "Габеллян Арменка", patientBd: "14.03.1995", comment: ""},
    {uid: "1", caseType: "Поликлинический", openDate: "01.05.2020", closeDate: "20.05.2020", patientFio: "Васин Вася Васянович", patientBd: "01.01.1990", comment: "блаблаблаблабла"},
    {uid: "2", caseType: "Госпитализации", openDate: "01.01.2020", closeDate: "открыт", patientFio: "Иванов Иван Иванович", patientBd: "21.07.1989", comment: ""},
    {uid: "3", caseType: "Поликлинический", openDate: "03.03.2020", closeDate: "20.05.2020", patientFio: "Петров Петр Петрович", patientBd: "11.03.1965", comment: ""},
    {uid: "4", caseType: "Госпитализации", openDate: "25.05.2020", closeDate: "20.05.2020", patientFio: "Фроскин Фроска Молодецович", patientBd: "23.07.1992", comment: "ваще крутой дядька он"},
    {uid: "5", caseType: "Скорой помощи", openDate: "06.05.2020", closeDate: "открыт", patientFio: "Габеллян Арменка", patientBd: "14.03.1995", comment: ""}
];


let table = renderCasesTable(testCasesData);
casesTable.insertAdjacentHTML('afterbegin',table);
//end of table section

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//actions section
caseAddButton.addEventListener('click', e => {
    console.log('Case adding...');
    modal.open();
});

caseDeleteButton.addEventListener('click', e => {
    console.log('Case deleting...');
})