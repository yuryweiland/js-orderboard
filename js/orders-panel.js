var orders = [];
var dayOrders = [];
var processingOrders = [];
var readyOrders = [];
var removeButtons = document.querySelectorAll('.removeOrder');

var ordersTable = document.getElementById('ordersTable');
var setTestOrdersButton = document.getElementById('setTestOrders');
var ordersListFragment = document.createDocumentFragment();

var todayDate = new Date();
todayDate.setMinutes(0);
todayDate.setSeconds(0);
todayDate.setMilliseconds(0);

var todayISODate = todayDate.toISOString();

function getOrdersFromLocalStorage() {
    orders = JSON.parse(localStorage.getItem('orders'));

    generateOrderTable();
    calculateRemoveButtonsElements();
}

/**
 * Показать все заказы за сегодня
 * @param todayISODate
 * @returns {*[]}
 */
function setDayOrders(todayISODate) {
    dayOrders = orders.filter((order) => order.date === todayISODate);
    localStorage.setItem('dayOrders', JSON.stringify(dayOrders));
}

/**
 * Показать заказы в работе на данный момент
 * @param todayISODate
 * @returns {*[]}
 */
function setProcessingOrders(todayISODate) {
    processingOrders = orders.filter((order) => order.date === todayISODate && order.status === 'processing');
    localStorage.setItem('processingOrders', JSON.stringify(processingOrders));
}

/**
 * Показать готовые заказы на данный момент
 * @param todayISODate
 * @returns {*[]}
 */
function showReadyOrders(todayISODate) {
    readyOrders = orders.filter((order) => order.date === todayISODate && order.status === 'ready');
    localStorage.setItem('readyOrders', JSON.stringify(readyOrders));
}

/**
 * Добавление нового заказа
 * @param orderNumber
 * @param status
 */
function addNewOrder(orderNumber, status) {
    const newOrder = {
        id: orders[orders.length - 1].id + 1,
        orderNumber: orderNumber,
        status: status,
        date: todayISODate
    };

    orders.push(newOrder);
}

/**
 * Изменение ранее добавленного заказа
 * @param order
 * @param newOrderNumber
 * @param newStatus
 */
function editOrder(order, newOrderNumber, newStatus) {
    if (newOrderNumber) {
        order.orderNumber = newOrderNumber;
    }

    if (newStatus) {
        order.status = newStatus;
    }

    setOrdersToLocalStorage();

}

/**
 * Удаление заказа
 * @param orderId
 */
function deleteOrder(orderId) {
    const updatedOrders = orders.filter((order) => order.id !== +orderId);

    console.log('удаляем заказ', orderId);
    console.log('updatedOrders', updatedOrders);

    setOrdersToLocalStorage(updatedOrders);

    getOrdersFromLocalStorage();

    console.log(localStorage);
}

/**
 * Рендерим внешний вид записи о заказе в таблице
 * @param order
 * @returns {HTMLDivElement}
 */
function renderOrder(order) {
    var orderRecord = document.createElement("tr");
    orderRecord.innerHTML = '<td><input value="' + order.orderNumber + '"> <button>Обновить</button></td>' +
        '<td>' + order.status + '</td>' +
        '<td>' +
        '<button>Отправить в "Готовится"</button> ' +
        '<button>Отправить в "Готовые"</button> ' +
        '<button class="removeOrder" orderId="' + order.id + '">Удалить</button>' +
        '</td>';
    return orderRecord;
}

/**
 * Генерируем в html таблицу с заказами
 */
function generateOrderTable() {
    let result = [];
    ordersTable.innerHTML = '<tr><th>Номер заказа</th><th>Текущий статус</th><th>Действия</th></tr>';

    console.log(getObjectFromLocalStorage('orders'));

    getObjectFromLocalStorage('orders').forEach((order) => {
        result.push(renderOrder(order));
    });

    for(var i = 0; i < result.length; i++) {
        ordersListFragment.appendChild(result[i]);
    }

    ordersTable.appendChild(ordersListFragment);
    removeButtons = document.querySelectorAll('.removeOrder');
}

// Загрузить тестовые данные о заказах
// setOrdersToLocalStorage();

// Получаем все заказы из localStorage
getOrdersFromLocalStorage();

/**
 * Обработка кнопки "Удалить" для заказов
 */
function calculateRemoveButtonsElements() {
    removeButtons = document.querySelectorAll('.removeOrder');

    for (var i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");

            deleteOrder(orderId);
        });
    }
}

setTestOrdersButton.addEventListener('click', function() {
    setTestOrdersToLocalStorage();
    getOrdersFromLocalStorage();

});