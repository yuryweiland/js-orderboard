var orders = [];
var dayOrders = [];
var processingOrders = [];
var readyOrders = [];

var orderNumberInputs = document.querySelectorAll('.orderNumberInput');
var updateOrderNumberButtons = document.querySelectorAll('.updateOrderNumber');

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
    calculateUpdateOrderNumberButtonsElements();
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
        status: status,
        orderNumber: orderNumber.toString()
    };

    console.log('newOrder', newOrder);

    orders.push(newOrder);

    console.log(orders);

    setOrdersToLocalStorage(orders);
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
            if (orders[i].id === order.id) {
                orders[i].orderNumber = newOrderNumber;
                break;
            }
        }
    }

    if (newStatus) {
        for (var i in orders) {
            if (orders[i].id === order.id) {
                orders[i].status = newStatus;
                break;
            }
        }
    }

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
    let statusMessage = '';

    if (order.status === 'processing') {
        statusMessage = 'Готовится';
    } else if (order.status === 'ready') {
        statusMessage = 'Готов';
    }

    orderRecord.innerHTML = '<td class="order-number"><input value="' + order.orderNumber +'" orderNumber="' + order.orderNumber + '" id="orderNumberInput_'+ order.id +'"> <button class="updateOrderNumber"  orderId="' + order.id + '"  orderNumber="' + order.orderNumber + '">Обновить</button></td>' +
        '<td width="129">' + statusMessage + '</td>' +
        '<td width="400">' +
        '<button class="processingOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Отправить в "Готовится"</button> ' +
        '<button class="readyOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Отправить в "Готовые"</button> ' +
        '<button class="removeOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Удалить</button>' +
        '</td>';
    return orderRecord;
}

/**
 * Генерируем в html таблицу с заказами
 */
function generateOrderTable() {
    let result = [];
    ordersTable.innerHTML = '';

    console.log(getObjectFromLocalStorage('orders'));

    getObjectFromLocalStorage('orders').forEach((order) => {
        result.push(renderOrder(order));
    });

    for(var i = 0; i < result.length; i++) {
        ordersListFragment.appendChild(result[i]);
    }

    ordersTable.appendChild(ordersListFragment);
    reverseChildNodes(ordersTable);

    removeButtons = document.querySelectorAll('.removeOrder');
    processingButtons = document.querySelectorAll('.processingOrder');
    readyButtons = document.querySelectorAll('.readyOrder');
}

/**
 * Обработчик кнопки "Отправить в Готовые" для заказов
 */
function calculateReadyButtonsElements() {
    readyButtons = document.querySelectorAll('.readyOrder');

    for (var i = 0; i < readyButtons.length; i++) {
        readyButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");
            let orderNumber = this.getAttribute("orderNumber");

            // Определяем, над каким заказом производим действия
            let order = orders.filter((order) => order.id === +orderId)[0];

            // Обновляем статус заказа на "Готовится"
            editOrder(order, orderNumber, 'ready');
        });
    }
}

/**
 * Обработчик кнопки "Отправить в Готовится" для заказов
 */
function calculateProcessingButtonsElements() {
    processingButtons = document.querySelectorAll('.processingOrder');

    for (var i = 0; i < processingButtons.length; i++) {
        processingButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");
            let orderNumber = this.getAttribute("orderNumber");

            // Определяем, над каким заказом производим действия
            let order = orders.filter((order) => order.id === +orderId)[0];

            // Обновляем статус заказа на "Готовится"
            editOrder(order, orderNumber, 'processing');
        });
    }
}

/**
 * Обработчик кнопки "Удалить" для заказов
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
 * Обработчик кнопки "Обновить" для номеров заказов
 */
function calculateUpdateOrderNumberButtonsElements() {
    updateOrderNumberButtons = document.querySelectorAll('.updateOrderNumber');
    orderNumberInputs = document.querySelectorAll('.orderNumberInput');

    for (var i = 0; i < updateOrderNumberButtons.length; i++) {
        updateOrderNumberButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");
            let inputId = 'orderNumberInput_' + orderId;

            // Получаем значение из инпута с номером заказа
            let newOrderNumberValue = document.getElementById(inputId).value;

            // Определяем, над каким заказом производим действия
            let order = orders.filter((order) => order.id === +orderId)[0];

            // Обновляем статус заказа на "Готовится"
            editOrder(order, newOrderNumberValue, order.status);
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

addNewOrderButton.addEventListener('click', function() {

    addNewOrder(newOrderNumber.value, 'processing');
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