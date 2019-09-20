/**
 * Получаем тестовые заказы из локального массива
 */
function setOrdersToLocalStorage(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * Возвращает объект из localStorage
 * @param objectName
 * @returns {any}
 */
function getObjectFromLocalStorage(objectName) {
    return JSON.parse(localStorage.getItem(objectName));
}

/**
 * Сортируем по убыванию заказы в списках
 * @param node
 * @returns {*}
 */
function reverseChildNodes(node) {
    var parentNode = node.parentNode, nextSibling = node.nextSibling,
        frag = node.ownerDocument.createDocumentFragment();
    parentNode.removeChild(node);
    while(node.lastChild)
        frag.appendChild(node.lastChild);
    node.appendChild(frag);
    parentNode.insertBefore(node, nextSibling);
    return node;
}

/**
 * Устанавливаем тестовые данные о заказах
 */
function setTestOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify([
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
            id: 3,
            status: 'processing',
            orderNumber: '14'
        },
        {
            id: 4,
            status: 'processing',
            orderNumber: '15'
        },
        {
            id: 5,
            status: 'ready',
            orderNumber: '16'
        },
        {
            id: 6,
            status: 'processing',
            orderNumber: '17'
        },
    ]));
}