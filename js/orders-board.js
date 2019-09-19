var orders = [];
var dayOrders = [];
var processingOrders = [];
var readyOrders = [];

var processingOrdersList = document.getElementById('processingOrders');
var readyOrdersList = document.getElementById('readyOrders');

var processingOrdersListFragment = document.createDocumentFragment();
var readyOrdersListFragment = document.createDocumentFragment();

var todayDate = new Date();
todayDate.setMinutes(0);
todayDate.setSeconds(0);
todayDate.setMilliseconds(0);

var todayISODate = todayDate.toISOString();

function setOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
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

    setOrders();

}

/**
 * Удаление заказа
 * @param currentOrder
 */
function deleteOrder(currentOrder) {
    orders.filter((order) => order.id !== currentOrder.id);

    setOrders();
}

/**
 * Рендерим внешний вид записи о заказе
 * @param order
 * @returns {HTMLDivElement}
 */
function renderOrder(order) {
    var orderRecord = document.createElement("div");
    orderRecord.className="order";
    orderRecord.innerHTML = '<p>' + order.orderNumber + '</p>';
    return orderRecord;
}

/**
 * Генерируем в html списки заказов ("готовятся" и "готовы")
 */
function generateOrderLists() {
    let processingResult = [];
    let readyResult = [];

    getObjectFromLocalStorage('orders').forEach((order) => {

        if (order.status === 'processing') {
            processingResult.push(renderOrder(order));
        } else if (order.status === 'ready') {
            readyResult.push(renderOrder(order));
        }

    });

    for(var i = 0; i < processingResult.length; i++) {
        processingOrdersListFragment.appendChild(processingResult[i]);
    }
    for(var i = 0; i < readyResult.length; i++) {
        readyOrdersListFragment.appendChild(readyResult[i]);
    }

    processingOrdersList.appendChild(processingOrdersListFragment);
    readyOrdersList.appendChild(readyOrdersListFragment);
}

/**
 * Возвращает объект из localStorage
 * @param objectName
 * @returns {any}
 */
function getObjectFromLocalStorage(objectName) {
    return JSON.parse(localStorage.getItem(objectName));
}

orders = [
    {
        id: 1,
        status: 'ready',
        orderNumber: '12'
    },
    {
        id: 2,
        status: 'processing',
        orderNumber: '13'
    },
    {
        id: 2,
        status: 'processing',
        orderNumber: '14'
    },
];

setOrders();
generateOrderLists();
