var orders = [];
var dayOrders = [];
var processingOrders = [];
var readyOrders = [];

var processingButtons = document.querySelectorAll('.processingOrder');
var readyButtons = document.querySelectorAll('.readyOrder');
var removeButtons = document.querySelectorAll('.removeOrder');

var ordersTable = document.getElementById('ordersTable');
var setTestOrdersButton = document.getElementById('setTestOrders');
var ordersListFragment = document.createDocumentFragment();

var addNewOrderButton = document.getElementById('addNewOrderButton');
var newOrderNumber = document.getElementById('newOrderNumber');

var todayDate = new Date();
todayDate.setMinutes(0);
todayDate.setSeconds(0);
todayDate.setMilliseconds(0);

var todayISODate = todayDate.toISOString();

function getOrdersFromLocalStorage() {
    orders = JSON.parse(localStorage.getItem('orders'));

    generateOrderTable();
    calculateProcessingButtonsElements();
    calculateReadyButtonsElements();
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
    setOrdersToLocalStorage();
    getOrdersFromLocalStorage();
}

/**
 * Изменение ранее добавленного заказа
 * @param order
 * @param newOrderNumber
 * @param newStatus
 */
function editOrder(order, newOrderNumber, newStatus) {
    if (newOrderNumber) {
        for (var i in orders) {
            if (orders[i].orderNumber === order.orderNumber) {
                orders[i].orderNumber = newOrderNumber;
                break;
            }
        }
    }

    if (newStatus) {
        for (var i in orders) {
            if (orders[i].orderNumber === order.orderNumber) {
                orders[i].status = newStatus;
                break;
            }
        }
    }

    console.log('edited orders', orders);

    setOrdersToLocalStorage(orders);
    getOrdersFromLocalStorage();
}

/**
 * Удаление заказа
 * @param orderId
 */
function deleteOrder(orderId) {
    const updatedOrders = orders.filter((order) => order.id !== +orderId);

    setOrdersToLocalStorage(updatedOrders);
    getOrdersFromLocalStorage();
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
        '<button class="processingOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Отправить в "Готовится"</button> ' +
        '<button class="readyOrder" orderId="' + order.id + '" orderNumber="\' + order.orderNumber + \'">Отправить в "Готовые"</button> ' +
        '<button class="removeOrder" orderId="' + order.id + '" orderNumber="\' + order.orderNumber + \'">Удалить</button>' +
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

/**
 * Обработка кнопки "Отправить в Готовые" для заказов
 */
function calculateReadyButtonsElements() {
    var processingButtons = document.querySelectorAll('.readyOrder');

    for (var i = 0; i < processingButtons.length; i++) {
        processingButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");

            // Определяем, над каким заказом производим действия
            let order = orders.filter((order) => order.id === +orderId)[0];

            // Обновляем статус заказа на "Готовится"
            editOrder(order, orderId, 'ready');
        });
    }
}

/**
 * Обработка кнопки "Отправить в Готовится" для заказов
 */
function calculateProcessingButtonsElements() {
    var processingButtons = document.querySelectorAll('.processingOrder');

    for (var i = 0; i < processingButtons.length; i++) {
        processingButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");

            // Определяем, над каким заказом производим действия
            let order = orders.filter((order) => order.id === +orderId)[0];

            // Обновляем статус заказа на "Готовится"
            editOrder(order, orderId, 'processing');
        });
    }
}

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

/**
 * Обработчик кнопки "Добавить тестовые заказы"
 */
setTestOrdersButton.addEventListener('click', function() {
    setTestOrdersToLocalStorage();
    getOrdersFromLocalStorage();
});

newOrderNumber.addEventListener('change', function() {
    if (this.value) {
        addNewOrderButton.disabled = false;
    } else {
        addNewOrderButton.disabled = true;
    }
});


// Получаем все заказы из localStorage
getOrdersFromLocalStorage();
addNewOrderButton.disabled = true;