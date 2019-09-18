var orders = [];
var dayOrders = [];
var processingOrders = [];
var readyOrders = [];

var todayDate = new Date();
todayDate.setMinutes(0);
todayDate.setSeconds(0);
todayDate.setMilliseconds(0);

var todayISODate = todayDate.toISOString();

/**
 * Показать все заказы за сегодня
 * @param todayISODate
 * @returns {*[]}
 */
function showDayOrders(todayISODate) {
    dayOrders = orders.filter((order) => order.date === todayISODate);

    return dayOrders;
}

/**
 * Показать заказы в работе на данный момент
 * @param todayISODate
 * @returns {*[]}
 */
function showProcessingOrders(todayISODate) {
    processingOrders = orders.filter((order) => order.date === todayISODate && order.status === 'processing');

    return processingOrders;
}

/**
 * Показать готовые заказы на данный момент
 * @param todayISODate
 * @returns {*[]}
 */
function showReadyOrders(todayISODate) {
    readyOrders = orders.filter((order) => order.date === todayISODate && order.status === 'ready');

    return readyOrders;
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

}

/**
 * Удаление заказа
 * @param currentOrder
 */
function deleteOrder(currentOrder) {
    orders.filter((order) => order.id !== currentOrder.id);
}